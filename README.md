# 🌿 WetlandGuard: AI-Powered Ecosystem Protection

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **Empowering communities to safeguard our wetlands through real-time reporting, AI-driven automation, and transparent restoration tracking.**

---

## 🚀 The Vision
Wetlands are the kidneys of our planet, but they are under constant threat from illegal dumping, sewage discharge, and unauthorized construction. **WetlandGuard** bridging the gap between vigilant citizens and field authorities using modern technology.

## ✨ Core Features

### 🛂 Role-Based Access Control (RBAC)
- **👤 Citizen (User)**: Report violations with geo-tagged photos, track personal reports, and view interactive community maps.
- **🔧 Field Team (Worker)**: Receive automated task assignments, upload progress photos, and manage restoration status.
- **👨‍💼 Authority (Admin)**: Full oversight of all reports, manual worker assignment overrides, and a "Before & After" restoration gallery.

### 🤖 Smart Automation & AI
- **Automated Routing**: New reports are intelligently assigned to workers based on current workload and location.
- **AI Chatbot**: Integrated assistant to answer citizen queries about wetland laws and reporting procedures.
- **WhatsApp Integration**: Backend ready for WhatsApp reporting via Twilio/webhook logic.
- **High-Precision Geolocation**: Automatic extraction of GPS coordinates for accurate field response.

### 📸 Transparency & Impact
- **Restoration Gallery**: Admin-curated side-by-side "Before & After" photos to prove environmental impact.
- **Interactive Map**: Real-time visualization using Leaflet.js with color-coded violation categories.

---

## 🛠️ Tech Stack

**Frontend:**
- Clean, responsive HTML5 & CSS3
- Role-specific UI frameworks (Role-Based CSS)
- Leaflet.js for high-performance mapping
- FontAwesome for intuitive iconography

**Backend:**
- **Python (FastAPI)**: High-performance, production-ready API.
- **SQLite**: Local relational database for persistent storage.
- **Uvicorn**: Lightning-fast ASGI server.
- **Background Tasks**: Asynchronous worker assignment.

---

## 🏃 Setup Instructions

### 1. Clone & Prepare
```powershell
# Create & activate virtual environment
python -m venv venv
.\venv\Scripts\activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Start the Platform
```powershell
python backend.py
```
Visit `http://localhost:8000` in your browser.

---

## 📂 Project Architecture

```text
├── backend.py            # FastAPI Application & Database Logic
├── index.html            # Main Portal & Dashboard Entry
├── login.html            # Role-Based Authentication
├── css/                  # specialized UI styling
│   ├── role-based.css    # RBAC layout logic
│   └── ecosystem.css     # Themed environmental components
├── js/
│   ├── script.js         # Core frontend logic & API calls
│   └── translations.js   # Multi-language support (EN, HI, MR)
└── wetlandguard.db       # Persistent SQLite data store
```

---

## 🏆 Hackathon Achievements
- **Built in < 48 Hours**: From a simple concept to a full-stack automated platform.
- **Zero Framework Dependency**: Pure modern JavaScript and CSS for lightning-fast load times.
- **Experience Driven**: Designed by backend developers to handle industrial-grade data isolation.

## 🤝 Contact
Developed with ❤️ by **team econova**  
*Building technology for a sustainable future.*
