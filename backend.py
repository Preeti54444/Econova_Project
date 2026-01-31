from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import sqlite3
import datetime
import json
import uvicorn
import random
import os

# --- Configuration ---
DB_PATH = "wetlandguard.db"
APP_VERSION = "2.0.0"

app = FastAPI(title="WetlandGuard Pro Backend", version=APP_VERSION)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve Static Files
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/images", StaticFiles(directory="images"), name="images")

# --- Database Setup ---
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Reports Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'reported',
            reporter TEXT DEFAULT 'Anonymous',
            email TEXT,
            phone TEXT,
            progress INTEGER DEFAULT 10,
            worker_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Workers Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS workers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT,
            active_tasks INTEGER DEFAULT 0,
            specialty TEXT
        )
    ''')
    
    # Task Photos Table (Before & After)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS photo_pairs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id INTEGER NOT NULL,
            before_photo TEXT,
            after_photo TEXT,
            description TEXT,
            impact TEXT,
            date TEXT,
            FOREIGN KEY(report_id) REFERENCES reports(id)
        )
    ''')
    
    # Seed Workers if empty
    cursor.execute("SELECT COUNT(*) FROM workers")
    if cursor.fetchone()[0] == 0:
        workers = [
            ('W001', 'Rahul Sharma', '+919876543210', 0, 'Waste Management'),
            ('W002', 'Amit Patel', '+919876543211', 0, 'Bio-Diversity'),
            ('W003', 'Suresh Kumar', '+919876543212', 0, 'Water Quality')
        ]
        cursor.executemany("INSERT INTO workers VALUES (?,?,?,?,?)", workers)
    
    conn.commit()
    conn.close()

# --- Schemas ---
class ReportCreate(BaseModel):
    type: str
    description: str
    location: str
    latitude: float
    longitude: float
    reporter: Optional[str] = "Anonymous"
    email: Optional[str] = None
    phone: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str
    comment: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = "guest"

# --- Utility Functions ---
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def auto_assign_worker(report_id: int):
    """Logic to automatically assign a worker to a new report."""
    conn = get_db_connection()
    # Find worker with least active tasks
    worker = conn.execute("SELECT id FROM workers ORDER BY active_tasks ASC LIMIT 1").fetchone()
    if worker:
        worker_id = worker['id']
        conn.execute("UPDATE reports SET worker_id = ?, status = 'review', progress = 20 WHERE id = ?", (worker_id, report_id))
        conn.execute("UPDATE workers SET active_tasks = active_tasks + 1 WHERE id = ?", (worker_id,))
        conn.commit()
        print(f"[AUTO-ASSIGN] Report #{report_id} assigned to Worker {worker_id}")
    conn.close()

# --- API Endpoints ---

@app.get("/")
async def root():
    return FileResponse("index.html")

@app.get("/login")
async def login_page():
    return FileResponse("login.html")

@app.get("/worker")
async def worker_dashboard():
    return FileResponse("worker-dashboard.html")

@app.get("/admin")
async def admin_dashboard():
    return FileResponse("admin-dashboard.html")

@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.datetime.now().isoformat()}

@app.get("/api/reports")
async def get_reports():
    conn = get_db_connection()
    reports = conn.execute("SELECT * FROM reports ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in reports]

@app.post("/api/reports", status_code=201)
async def create_report(report: ReportCreate, background_tasks: BackgroundTasks):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.datetime.now().isoformat()
    
    cursor.execute('''
        INSERT INTO reports (type, description, location, latitude, longitude, date, reporter, email, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (report.type, report.description, report.location, report.latitude, report.longitude, now, report.reporter, report.email, report.phone))
    
    report_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Trigger Auto-Assignment in background
    background_tasks.add_task(auto_assign_worker, report_id)
    
    return {"id": report_id, **report.dict(), "status": "reported", "message": "Report submitted and assignment queued."}

@app.patch("/api/reports/{report_id}/status")
async def update_status(report_id: int, update: StatusUpdate):
    progress_map = {
        'reported': 15,
        'review': 40,
        'action': 75,
        'resolved': 100
    }
    progress = progress_map.get(update.status, 10)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get old status to handle worker task count if resolved
    old_data = conn.execute("SELECT status, worker_id FROM reports WHERE id = ?", (report_id,)).fetchone()
    
    cursor.execute(
        'UPDATE reports SET status = ?, progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        (update.status, progress, report_id)
    )
    
    # If resolved, decrement worker task count
    if update.status == 'resolved' and old_data and old_data['status'] != 'resolved' and old_data['worker_id']:
        cursor.execute("UPDATE workers SET active_tasks = MAX(0, active_tasks - 1) WHERE id = ?", (old_data['worker_id'],))
        
    conn.commit()
    updated = conn.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()
    conn.close()
    
    if not updated:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return dict(updated)

# --- AI Chatbot Implementation ---
@app.post("/api/chat")
async def chatbot_interface(chat: ChatMessage):
    """
    Advanced Chatbot Logic
    In a real scenario, this would call Gemini/GPT API.
    For this hackathon, we implement a smart responder with wetland knowledge.
    """
    msg = chat.message.lower()
    
    knowledge_base = {
        "report": "To report a violation, use the 'Report Violation' form on the home page. You can upload photos and we'll auto-detect your location.",
        "status": "You can track your report status in 'My Reports' panel. We'll update you as workers take action.",
        "construction": "Illegal construction in wetlands is a serious offense under Environmental Protection Acts. We prioritize these reports.",
        "dumping": "Waste dumping destroys local ecosystems. Our field teams clear reported sites within 48-72 hours.",
        "worker": "Workers are specialized field agents assigned based on the type of violation reported.",
        "hello": "Hello! I am the WetlandGuard Assistant. How can I help you protect our wetlands today?",
    }
    
    response = "I'm not sure about that specifically, but you can report any wetland violations directly through our portal, and our admin team will review it immediately."
    
    for key in knowledge_base:
        if key in msg:
            response = knowledge_base[key]
            break
            
    return {"reply": response}

# --- WhatsApp Integration Hub ---
@app.post("/api/whatsapp/webhook")
async def whatsapp_webhook(request: Request):
    """
    Webhook for WhatsApp integration (e.g., via Twilio).
    Receives messages from WhatsApp and processes them.
    """
    data = await request.form()
    incoming_msg = data.get('Body', '').lower()
    sender_phone = data.get('From', '')
    
    print(f"[WHATSAPP] Received from {sender_phone}: {incoming_msg}")
    
    # Simple Logic: If user sends "REPORT <description>", create a report
    if incoming_msg.startswith("report"):
        desc = incoming_msg.replace("report", "").strip()
        # Mocking coordinates for WhatsApp (in real life, user would share location pin)
        report_data = {
            "type": "dumping",
            "description": f"WhatsApp Report: {desc}",
            "location": "Via WhatsApp",
            "latitude": 19.0760,
            "longitude": 72.8777,
            "reporter": "WhatsApp User",
            "phone": sender_phone
        }
        # In a real app, call create_report logic here
        return {"status": "Report received via WhatsApp"}
        
    return {"status": "Message logged"}

@app.get("/api/reports/{report_id}")
async def get_report(report_id: int):
    conn = get_db_connection()
    report = conn.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()
    conn.close()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return dict(report)

@app.get("/api/workers/tasks/{worker_id}")
async def get_worker_tasks(worker_id: str):
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM reports WHERE worker_id = ?", (worker_id,)).fetchall()
    conn.close()
    return [dict(t) for t in tasks]

class PhotoPairCreate(BaseModel):
    report_id: int
    before_photo: Optional[str] = None
    after_photo: Optional[str] = None
    description: str
    impact: Optional[str] = "Wetland restoration completed"
    date: str

@app.post("/api/photos")
async def add_photo_pair(data: PhotoPairCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO photo_pairs (report_id, before_photo, after_photo, description, impact, date)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (data.report_id, data.before_photo, data.after_photo, data.description, data.impact, data.date))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Photo pair added"}

@app.get("/api/photos")
async def get_photo_pairs():
    conn = get_db_connection()
    pairs = conn.execute("SELECT * FROM photo_pairs ORDER BY date DESC").fetchall()
    conn.close()
    return [dict(p) for p in pairs]

@app.get("/api/stats")
async def get_stats():
    conn = get_db_connection()
    stats = {
        "total": conn.execute("SELECT COUNT(*) FROM reports").fetchone()[0],
        "resolved": conn.execute("SELECT COUNT(*) FROM reports WHERE status = 'resolved'").fetchone()[0],
        "in_progress": conn.execute("SELECT COUNT(*) FROM reports WHERE status IN ('review', 'action')").fetchone()[0],
        "workers_online": conn.execute("SELECT COUNT(*) FROM workers").fetchone()[0]
    }
    conn.close()
    return stats

if __name__ == "__main__":
    init_db()
    print("Backend started successfully on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
