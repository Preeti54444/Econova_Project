# 🧪 Role-Based System Testing Guide

## Quick Start Testing

### **Test Scenario 1: Login as User (Citizen)**
```
Steps:
1. Open: http://localhost:8000/login.html
2. Role: Select "👤 User (Citizen)"
3. Email: user@test.com
4. Password: password123 (or any 6+ chars)
5. Click "Sign In"

Expected Results:
✅ Redirected to http://localhost:8000/
✅ Navigation shows: Home | Report Issue | Live Map | My Reports | (user@test.com) | Logout
✅ "Authority" and "Field Teams" links are HIDDEN
✅ "Report Issue" form is VISIBLE
✅ Citizen Dashboard (#citizen-dash) section is visible
✅ Authority Control Center is HIDDEN
✅ Worker Dashboard is HIDDEN
✅ Photo Gallery is HIDDEN
✅ "Wetland Restoration Progress" button is NOT visible
```

---

### **Test Scenario 2: Login as Worker (Field Team)**
```
Steps:
1. Open: http://localhost:8000/login.html
2. Role: Select "🔧 Worker (Field Team)"
3. Email: worker@test.com
4. Password: password123
5. Click "Sign In"

Expected Results:
✅ Redirected to http://localhost:8000/
✅ Navigation shows: Home | Live Map | Field Teams | (worker@test.com) | Logout
✅ "My Reports" link is HIDDEN
✅ "Report Issue" link is HIDDEN
✅ "Authority" link is HIDDEN
✅ "Report Issue" form is HIDDEN
✅ Worker Dashboard (#worker-dash) shows with:
   - Task Statistics (Assigned: 1, In Progress: 1, Completed: 1, Photos: 2)
   - Three Task Cards:
     * T001 - Cleanup (In Progress)
     * T002 - Water testing (Assigned)
     * T003 - Documentation (Completed)
   - Each card has photo upload button
✅ Photo Gallery and Authority sections are HIDDEN
```

---

### **Test Scenario 3: Login as Admin (Authority)**
```
Steps:
1. Open: http://localhost:8000/login.html
2. Role: Select "👨‍💼 Admin (Authority)"
3. Email: admin@test.com
4. Password: password123
5. Click "Sign In"

Expected Results:
✅ Redirected to http://localhost:8000/
✅ Navigation shows: Home | Report Issue | Live Map | My Reports | Authority | Field Teams | (admin@test.com) | Logout
✅ ALL nav links are VISIBLE (user can see everything)
✅ Badge shows "ADMIN ACCESS" in Authority section
✅ All three sections are VISIBLE:
   - Citizen Dashboard (My Reports)
   - Authority Control Center (all reports)
   - Worker Dashboard (field teams)
   - Photo Gallery (before & after photos)
✅ Photo Gallery shows:
   - "Upload Photos" button
   - Sample before/after photo pair (P001)
   - Wetland restoration progress information
```

---

### **Test Scenario 4: Photo Upload as Admin**
```
Steps (from Admin login):
1. Scroll to "Wetland Restoration Progress" section
2. Click "Upload Photos" button
3. In modal:
   - Select a report from dropdown
   - Click "Click to upload BEFORE photo" and select an image
   - Click "Click to upload AFTER photo" and select an image
   - Type restoration details in textarea
   - Pick a date
   - Click "Upload Photos"

Expected Results:
✅ Modal opens with form fields
✅ Photos can be selected and previewed
✅ Form validates before submission
✅ Success notification appears: "Photos uploaded successfully! 🎉"
✅ New photo pair appears in gallery
✅ Before/after photos displayed side-by-side
```

---

### **Test Scenario 5: Worker Upload Photos for Task**
```
Steps (from Worker login):
1. Go to "Field Teams" in navigation
2. Find a task card (e.g., T001)
3. Click "Upload Photos" button in task
4. Modal opens for photo upload
5. Upload before/after photos
6. Fill task details
7. Submit

Expected Results:
✅ Modal opens
✅ Photos can be previewed
✅ Success notification shows
✅ Task photo count increments
✅ Photos stored in workerState
```

---

### **Test Scenario 6: Worker Update Task Status**
```
Steps (from Worker login):
1. Go to "Field Teams"
2. Find T002 task (Assigned status)
3. Click "Start" button
4. Status changes to "In Progress"
5. Click "Complete" button
6. Status changes to "Completed"

Expected Results:
✅ Button labels change based on status
✅ Status badge updates color:
   - Assigned: Blue
   - In Progress: Orange
   - Completed: Green
✅ Notification shows status update
✅ Task statistics update
```

---

### **Test Scenario 7: Logout Functionality**
```
Steps (from any logged-in state):
1. Click "Logout" button in navigation

Expected Results:
✅ localStorage.userEmail cleared
✅ localStorage.userRole cleared
✅ Redirects to login.html
✅ Login form appears
✅ "Login" link visible in navigation
✅ User role display hidden
```

---

### **Test Scenario 8: Cross-Role Data Isolation**
```
As USER:
- Can see only their own reports
- Cannot access authority control center
- Cannot see worker tasks

As WORKER:
- Can see only assigned tasks
- Cannot see all reports
- Cannot see admin features

As ADMIN:
- Can see ALL reports, ALL tasks, ALL photos
- Can manage both users and workers
```

---

## 🐛 Visual Checks

### Login Page:
- [ ] Role selector dropdown visible
- [ ] Three role options: User, Worker, Admin
- [ ] Role field shows error if left blank
- [ ] Icons display correctly (👤 👨‍💼 🔧)

### After Login:
- [ ] Navbar shows current role and email
- [ ] Role-specific nav links visible/hidden correctly
- [ ] Logout button appears
- [ ] Login button disappears

### Worker Dashboard:
- [ ] Task cards display in grid
- [ ] All 3 sample tasks show
- [ ] Status badges color-coded
- [ ] Photo upload buttons functional
- [ ] Action buttons (Details, Start, Complete) work

### Admin Photo Gallery:
- [ ] "Upload Photos" button visible
- [ ] Before/after photos display side-by-side
- [ ] Restoration details visible
- [ ] Photo pair cards have hover effects
- [ ] Modal opens and closes correctly

---

## 🔍 Browser Console Checks

Open DevTools (F12) and check Console for:
```
✅ No JavaScript errors
✅ Role initialization logs (if present)
✅ Event listener attachments working
✅ localStorage values set correctly
```

Check Application/Storage:
```
✅ localStorage contains:
   - userEmail: (selected email)
   - userRole: (user/worker/admin)
   - rememberEmail: (if checked)
```

---

## 📱 Responsive Design Testing

### Mobile (320px - 480px):
- [ ] Navigation hamburger menu works
- [ ] Task cards stack in single column
- [ ] Photo gallery single column
- [ ] Modal fits screen with scroll
- [ ] Buttons touch-friendly (minimum 44px)

### Tablet (481px - 1024px):
- [ ] Two-column grids work
- [ ] Photos side-by-side
- [ ] Good spacing and layout

### Desktop (1025px+):
- [ ] Full multi-column layout
- [ ] Optimal information density
- [ ] Hover effects visible

---

## 🎯 Expected File Changes

### Files Modified:
1. ✅ `login.html` - Added role selector
2. ✅ `login.js` - Role validation & storage
3. ✅ `index.html` - Worker dashboard & photo gallery HTML
4. ✅ `css/login.css` - Select field styling
5. ✅ `js/script.js` - All role-based logic
6. ✅ NEW: `css/role-based.css` - Complete styling
7. ✅ NEW: `ROLE_BASED_SYSTEM.md` - Documentation

### Total New Lines of Code:
- 950+ lines in role-based.css
- 380+ lines in script.js (new functions)
- HTML sections for worker & photo gallery
- All with responsive design & animations

---

## 🎯 Success Criteria

✅ All three roles work independently
✅ Data doesn't leak between roles
✅ UI updates dynamically on login
✅ Photos upload and display correctly
✅ Tasks can be updated by workers
✅ Admin sees all data
✅ Logout clears session
✅ Responsive on all devices
✅ No console errors
✅ Smooth animations throughout

---

## 📊 Sample Test Results

### Expected Behavior Summary:
```
USER LOGIN:
├── Sees: Report form, My Reports dashboard, Map
├── Cannot see: Authority control, Worker tasks, Photo gallery
└── Role badge: None visible

WORKER LOGIN:
├── Sees: Field tasks, Photo upload, Task details
├── Cannot see: Report form, Authority, All reports
└── Role badge: "🔧 FIELD WORKER"

ADMIN LOGIN:
├── Sees: EVERYTHING (all sections, all roles)
├── Can: Manage users, workers, upload photos
└── Role badge: "👨‍💼 ADMIN ACCESS" (glowing)
```

---

## 🚀 Ready to Test!

Your WetlandGuard application now has a fully functional role-based system. Simply:
1. Navigate to http://localhost:8000/login.html
2. Select a role
3. Login with any credentials (6+ char password)
4. Explore the role-specific features!

**Enjoy testing! 🎉**
