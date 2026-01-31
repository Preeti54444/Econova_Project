# 🎭 ROLE-BASED SYSTEM - VISUAL ARCHITECTURE

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                        WetlandGuard Platform                        │
│                   Three-Tier Role-Based Access Control              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

                           LOGIN PAGE
                              │
                ┌─────────────┼─────────────┐
                │             │             │
            ┌─────────┐   ┌─────────┐   ┌─────────┐
            │  USER   │   │ WORKER  │   │ ADMIN   │
            └────┬────┘   └────┬────┘   └────┬────┘
                 │             │             │
        ┌────────▼─────────────▼──────┬──────▼────────────┐
        │                             │                   │
        │  localStorage.setItem(      │                   │
        │    'userRole',              │                   │
        │    'user|worker|admin'      │                   │
        │  )                          │                   │
        │                             │                   │
        └────────┬─────────────┬──────┴──────┬────────────┘
                 │             │             │
    ┌────────────▼─────────────▼─────────────▼────────────┐
    │                                                      │
    │  PAGE LOADS → initializeRoleBasedAccess()          │
    │     ├─ Read userRole from localStorage             │
    │     ├─ Apply CSS class: body.{role}-role           │
    │     ├─ updateNavigation(role)                       │
    │     ├─ updateVisibility(role)                       │
    │     └─ loadRoleSpecificData(role)                   │
    │                                                      │
    └────────┬──────────────┬──────────────┬──────────────┘
             │              │              │
    ┌────────▼─┐  ┌─────────▼──┐  ┌───────▼────────┐
    │ USER     │  │ WORKER     │  │ ADMIN          │
    │ PANEL    │  │ PANEL      │  │ PANELS         │
    │          │  │            │  │                │
    │ ✅ Show  │  │ ✅ Show    │  │ ✅ Show ALL    │
    │ .role    │  │ .role      │  │ - User Panel   │
    │  -user   │  │  -worker   │  │ - Worker Panel │
    │          │  │            │  │ - Admin Panel  │
    │ ❌ Hide  │  │ ❌ Hide    │  │ ✅ Show Photo  │
    │ .role    │  │ .role      │  │    Gallery     │
    │  -admin  │  │  -admin    │  │                │
    │ .role    │  │ .role      │  │ Can upload:    │
    │  -worker │  │  -user     │  │ - Before photo │
    │          │  │            │  │ - After photo  │
    └──────────┘  └────────────┘  └────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│              REPORT LIFECYCLE & PHOTOS                   │
└──────────────────────────────────────────────────────────┘

STEP 1: CITIZEN REPORTS VIOLATION
┌─────────────────────────────────────────┐
│ USER (Citizen) logs in                  │
├─────────────────────────────────────────┤
│ 1. Fills "Report Wetland Violation"     │
│ 2. Selects violation type               │
│    - Dumping                            │
│    - Sewage                             │
│    - Construction                       │
│ 3. Adds location, description, photos   │
│ 4. Submits report                       │
└──────────────┬──────────────────────────┘
               │ Report stored in state
               ▼
        Report ID: 1001
        Status: "reported"
        
STEP 2: ADMIN VIEWS & ASSIGNS TASK
┌─────────────────────────────────────────┐
│ ADMIN logs in                           │
├─────────────────────────────────────────┤
│ 1. Goes to "Authority Control Center"   │
│ 2. Views all citizen reports            │
│ 3. Reviews violation details            │
│ 4. Assigns to field team worker         │
│    Report ID: 1001 → Task ID: T001      │
└──────────────┬──────────────────────────┘
               │ Task created & assigned
               ▼
        Task Status: "assigned"
        Assigned to: Field Worker

STEP 3: WORKER COMPLETES FIELD WORK
┌─────────────────────────────────────────┐
│ WORKER (Field Team) logs in             │
├─────────────────────────────────────────┤
│ 1. Goes to "Field Team Dashboard"       │
│ 2. Sees assigned task T001               │
│    - Location: Thane Creek               │
│    - Description: Dumping cleanup        │
│    - Due date: 2 days                    │
│ 3. Clicks "Start Work" → Status changes  │
│    from "assigned" → "in-progress"       │
│ 4. Does actual restoration work          │
│ 5. Uploads progress photos               │
│    Photo 1: Progress shot                │
│    Photo 2: Another angle                │
│ 6. Clicks "Complete" → Status changes    │
│    from "in-progress" → "completed"      │
└──────────────┬──────────────────────────┘
               │ Task completed
               ▼
        Task Status: "completed"
        Photos uploaded: 2

STEP 4: ADMIN UPLOADS OFFICIAL PHOTOS ⭐
┌─────────────────────────────────────────┐
│ ADMIN logs in again                     │
├─────────────────────────────────────────┤
│ 1. Goes to "Wetland Restoration         │
│    Progress" section                    │
│ 2. Clicks "Upload Photos"                │
│ 3. Selects Report #1001                  │
│ 4. Uploads BEFORE photo                  │
│    (Shows: dirty, dumped area)           │
│ 5. Uploads AFTER photo                   │
│    (Shows: cleaned, restored area)       │
│ 6. Adds details:                         │
│    "Removed 50 tons of waste             │
│     Replanted native vegetation"         │
│ 7. Adds date: Completed today            │
│ 8. Submits to gallery                    │
└──────────────┬──────────────────────────┘
               │ Before/after pair created
               ▼
        Photo Pair ID: P001
        reportID: 1001
        Before: [image]
        After: [image]
        Description: "Restoration details..."
        Impact: "Wetland successfully restored"

STEP 5: GALLERY DISPLAYS PROGRESS
┌─────────────────────────────────────────┐
│ ADMIN views "Restoration Progress"      │
├─────────────────────────────────────────┤
│ Beautiful side-by-side display:         │
│                                         │
│ BEFORE           AFTER                  │
│ ┌──────────┐   ┌──────────┐             │
│ │ Dumping  │   │ Cleaned  │             │
│ │ Area     │ → │ Restored │             │
│ │ Dirty    │   │ Green    │             │
│ └──────────┘   └──────────┘             │
│                                         │
│ Report #1001 - Dumping                  │
│ Completed: Today                        │
│ Description: "Removed 50 tons..."       │
│ Impact: ✅ Wetland successfully         │
│ restored                                │
└─────────────────────────────────────────┘

COMPLETE WORKFLOW SUMMARY:
Citizen Reports → Admin Assigns → Worker Executes → 
Admin Documents → Gallery Shows Progress
```

---

## Role Access Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHAT EACH ROLE CAN ACCESS                    │
└─────────────────────────────────────────────────────────────────┘

FEATURE                          USER    WORKER    ADMIN
─────────────────────────────────────────────────────────────────
Report Violation Form             ✅       ❌       ✅
My Reports Dashboard              ✅       ❌       ✅
View All Reports                  ❌       ❌       ✅
Live Map                           ✅       ✅       ✅
Ecosystem Information              ✅       ✅       ✅

Field Team Dashboard              ❌       ✅       ✅
View Assigned Tasks               ❌       ✅       ✅
Upload Task Progress Photos       ❌       ✅       ✅
Update Task Status                ❌       ✅       ✅

Authority Control Center          ❌       ❌       ✅
Manage All Reports                ❌       ❌       ✅
View All Workers                  ❌       ❌       ✅
Restoration Progress Gallery      ❌       ❌       ✅
Upload Before & After Photos      ❌       ❌       ✅
View Restoration History          ❌       ❌       ✅

─────────────────────────────────────────────────────────────────
TOTAL VISIBLE ITEMS             5/11      5/11    11/11
                               (45%)     (45%)    (100%)
```

---

## Navigation Structure by Role

```
┌──────────────────────────────────────────────────────────────┐
│                     NAVIGATION MENU                          │
└──────────────────────────────────────────────────────────────┘

USER ROLE (Citizen):
Home | Report Issue | Live Map | My Reports | (user@test.com) | Logout

WORKER ROLE (Field Team):
Home | Live Map | Field Teams | (worker@test.com) | Logout

ADMIN ROLE (Authority):
Home | Report Issue | Live Map | My Reports | Authority | Field Teams | 
(admin@test.com) | Logout
```

---

## File Structure with Role Information

```
PROJECT ROOT
│
├── html/
│   ├── index.html (Main app)
│   │   ├── #report (Form) ................... role-user, role-admin
│   │   ├── #citizen-dash (User Panel) ....... role-user, role-admin
│   │   ├── #authority-dash (Admin Panel) ... role-admin
│   │   ├── #worker-dash (Worker Panel) .... role-worker, role-admin
│   │   └── #photos-gallery (Photo Gallery). role-admin
│   │
│   └── login.html (Login)
│       └── Role Selector
│
├── css/
│   ├── style.css (Base)
│   ├── role-based.css ...................... NEW - Role styling
│   ├── animations.css (20+ animations)
│   ├── hero-background.css
│   ├── ecosystem.css
│   ├── watermarks.css
│   └── login.css (+ role select styling)
│
├── js/
│   ├── script.js (Main logic + NEW role functions)
│   ├── login.js (Login + role storage)
│   └── translations.js (Multi-language)
│
└── docs/
    ├── QUICK_REFERENCE.md
    ├── TESTING_GUIDE.md
    ├── ROLE_BASED_SYSTEM.md
    ├── IMPLEMENTATION_COMPLETE.md
    └── FINAL_SUMMARY.md (This overview)
```

---

## CSS Class Application

```
HTML Body Element:

<body class="user-role">        ← When user is logged in
<body class="worker-role">      ← When worker is logged in  
<body class="admin-role">       ← When admin is logged in
<body>                          ← When guest (not logged in)


CSS Hiding/Showing Logic:

.role-user {
    display: none;              /* Hidden by default */
}

body.user-role .role-user {
    display: block !important;  /* Visible when user-role */
}

body.user-role .role-admin,
body.user-role .role-worker {
    display: none !important;   /* Hide other roles */
}


SAME PATTERN FOR:
- .role-admin (visible when admin-role)
- .role-worker (visible when worker-role)
```

---

## Data Storage Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  BROWSER LOCAL STORAGE                      │
└─────────────────────────────────────────────────────────────┘

AFTER LOGIN:
┌────────────────────────────────────────┐
│ localStorage.getItem('userEmail')      │
│ → "user@test.com"                      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ localStorage.getItem('userRole')       │
│ → "user" | "worker" | "admin"         │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ localStorage.getItem('rememberEmail')  │
│ → "user@test.com" (if checked)         │
└────────────────────────────────────────┘

ON PAGE LOAD:
These values are read and used to:
1. Apply body class
2. Update navigation
3. Show/hide sections
4. Load appropriate data


JAVASCRIPT STATE (In Memory):

appState = {
    reports: [...],           /* All reports */
    selectedReport: null,
    userLocation: null
}

workerState = {
    tasks: [
        {id: "T001", status: "in-progress", ...},
        {id: "T002", status: "assigned", ...}
    ],
    photos: []
}

photoState = {
    beforeAfterPairs: [
        {
            id: "P001",
            beforePhoto: "image_url",
            afterPhoto: "image_url",
            description: "..."
        }
    ]
}
```

---

## Event Flow Diagram

```
USER INTERACTION FLOW

1. LOGIN CLICK
   ├─ Validate role ✓
   ├─ Validate email ✓
   ├─ Validate password ✓
   ├─ Save to localStorage ✓
   └─ Redirect to index.html ✓

2. PAGE LOADS (index.html)
   ├─ DOMContentLoaded fires
   ├─ initializeRoleBasedAccess() called
   ├─ Read userRole from localStorage
   ├─ Apply CSS class to body
   ├─ updateNavigation(role)
   ├─ updateVisibility(role)
   ├─ loadRoleSpecificData(role)
   ├─ All sections show/hide instantly
   └─ User sees role-specific UI ✓

3. USER INTERACTS
   ├─ Click reports → see only own
   ├─ Worker sees tasks → click "Start"
   ├─ Admin clicks "Upload Photos"
   ├─ Modal opens → select report
   ├─ Upload before/after images
   ├─ Add details & date
   ├─ Submit → photos added to state
   ├─ Gallery updates instantly
   └─ Beautiful before/after pair visible ✓

4. LOGOUT CLICK
   ├─ Clear localStorage (userEmail)
   ├─ Clear localStorage (userRole)
   ├─ Clear sessionStorage
   ├─ Redirect to login.html
   └─ All sensitive data cleared ✓
```

---

## Complete System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    WETLANDGUARD ECOSYSTEM                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │   CITIZEN   │    │   WORKER    │    │    ADMIN    │       │
│  │    USER     │    │  FIELD TEAM │    │  AUTHORITY  │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│        │                   │                   │              │
│        │                   │                   │              │
│    REPORTS        FIELD WORK            OVERSIGHT             │
│        │                   │                   │              │
│        └───────────────────┼───────────────────┘              │
│                            │                                  │
│                   ┌────────▼────────┐                         │
│                   │  DATABASE/STATE │                         │
│                   │   Central Hub   │                         │
│                   └────────┬────────┘                         │
│                            │                                  │
│                ┌───────────┼───────────┐                      │
│                │           │           │                      │
│           REPORTS      TASKS       PHOTOS                     │
│                │           │           │                      │
│                └───────────┼───────────┘                      │
│                            │                                  │
│                      ┌─────▼─────┐                           │
│                      │  DISPLAY  │                           │
│                      │    LAYER  │                           │
│                      └───────────┘                           │
│                            │                                  │
│         ┌──────────────────┼──────────────────┐              │
│         │                  │                  │              │
│    CITIZEN              WORKER             ADMIN             │
│  DASHBOARD            DASHBOARD          DASHBOARDS           │
│  (My Reports)       (Field Tasks)      (All + Gallery)       │
│                                                               │
└────────────────────────────────────────────────────────────────┘
```

---

## Summary of Visual Architecture

**Three Pillars of the System:**

1. **ROLES** (Authentication) → Who are you?
2. **VISIBILITY** (Authorization) → What can you see?
3. **FUNCTIONALITY** (Actions) → What can you do?

**All powered by:**
- localStorage (persistence)
- CSS classes (visibility)
- JavaScript state (data)
- HTML sections (markup)

**Result:** A seamless, role-based experience where each user sees exactly what they should! 🎯
