# WetlandGuard Chatbot Troubleshooting Guide

## Quick Fix Steps

### 1. Start the Backend Server
The chatbot needs the backend server to be running. Follow these steps:

1. **Open Command Prompt** in the project folder
2. **Run the server startup script:**
   ```
   start-server.bat
   ```
   OR manually:
   ```
   cd server
   npm install
   node server.js
   ```

3. **Verify server is running** - you should see:
   ```
   WetlandGuard API Server
   Server running on port 3004
   http://localhost:3004
   ```

### 2. Open the Website
1. **Open `index.html`** in your browser
2. **Look for the chatbot button** in the bottom-right corner (green robot icon)
3. **Click the chatbot button** to open the chat window

### 3. Test the Chatbot
Try these sample messages:
- "Hello"
- "How do I report a violation?"
- "What are wetlands?"
- "Help me track my report"

## Common Issues & Solutions

### Issue: "I'm having trouble connecting right now"
**Cause:** Backend server is not running
**Solution:** 
1. Run `start-server.bat`
2. Wait for "Server running on port 3004" message
3. Refresh your browser page

### Issue: Chatbot button not visible
**Cause:** JavaScript not loaded properly
**Solution:**
1. Open browser Developer Tools (F12)
2. Check Console for errors
3. Refresh the page
4. Look for "[CHATBOT] Initialization complete!" message

### Issue: Chatbot window doesn't open
**Cause:** CSS or JavaScript conflict
**Solution:**
1. Hard refresh the page (Ctrl+F5)
2. Check browser console for errors
3. Try in a different browser

### Issue: Messages not sending
**Cause:** API endpoint not responding
**Solution:**
1. Check if server is running on port 3004
2. Visit http://localhost:3004/api/health to test
3. Check browser Network tab for failed requests

## Debug Information

### Check Server Status
Visit: http://localhost:3004/api/health
Should return: `{"status":"ok","timestamp":"..."}`

### Check Database
Visit: http://localhost:3004/api/debug/view-database
Shows all reports in a nice table format

### Browser Console Logs
Look for these messages:
- `[CHATBOT] Initializing chatbot...`
- `[CHATBOT] All elements found, setting up event listeners...`
- `[CHATBOT] Initialization complete!`

## Chatbot Features

The chatbot can help with:
- 🚨 **Reporting violations** - explains how to use the report form
- 📊 **Tracking reports** - explains the status dashboard
- 🗺️ **Using the map** - explains marker colors and features
- 🌿 **Wetland information** - shares ecosystem facts
- 📸 **Photo uploads** - explains camera and upload features
- 🔐 **Account features** - explains login and roles
- 🚨 **Emergency guidance** - directs to appropriate channels

## Technical Details

### API Endpoint
- **URL:** `POST /api/chat`
- **Body:** `{"message": "user message", "user_id": "guest"}`
- **Response:** `{"reply": "bot response", "timestamp": "...", "user_id": "..."}`

### File Locations
- **Frontend:** `js/script.js` (initializeChatbot function)
- **Backend:** `server/server.js` (POST /api/chat endpoint)
- **UI:** `index.html` (chatbot HTML structure and CSS)

### Dependencies
- **Backend:** Express.js server with CORS enabled
- **Frontend:** Vanilla JavaScript with Fetch API
- **UI:** Font Awesome icons, CSS animations

## Need More Help?

1. **Check the browser console** (F12 → Console tab)
2. **Check the server terminal** for error messages
3. **Try the sample messages** listed above
4. **Restart both server and browser** if issues persist

The chatbot should work perfectly once the server is running! 🤖✨