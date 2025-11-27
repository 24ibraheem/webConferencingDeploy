# Azure Static Web Apps Configuration Guide

## Overview
Your frontend is deployed on Azure Static Web Apps at: `https://proud-moss-034cd9b00.3.azurestaticapps.net`

However, it still needs to communicate with your backend server (running elsewhere).

## Error You're Getting
```
HTTP 405: Make sure the backend server is running on port 3000.
```

This happens because the frontend can't reach your backend service.

---

## Solution: Configure Environment Variables in Azure

### Step 1: Get Your Backend Service URL
Your backend is deployed at:
```
https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net
```

### Step 2: Add Environment Variables to Azure Static Web Apps

1. **Go to Azure Portal**
   - Search for "Static Web Apps"
   - Click on your app: `webtime-frontend` (or similar)

2. **Configure Settings**
   - Click **Settings** → **Configuration**
   
3. **Add Environment Variables**
   Create two new application settings:

   ```
   Name: VITE_API_URL
   Value: https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net
   
   Name: VITE_SOCKET_SERVER_URL
   Value: https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net
   ```

4. **Save Changes**

### Step 3: Rebuild & Deploy

Go to **GitHub Actions** in your repository:
1. Click on the latest workflow run
2. Click **Re-run jobs** → **Re-run all jobs**
3. Wait for deployment to complete (~5 minutes)

---

## Troubleshooting

### If you're still getting errors:

1. **Backend Service is Down**
   - Check if your backend is running: `https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net/api/admin-login`
   - Should return a response (even if it's an error)

2. **CORS Issues**
   - Your backend (`server/server.js`) already has CORS enabled:
     ```javascript
     app.use(cors());
     ```
   - If errors persist, check your backend logs in Azure

3. **Wrong Backend URL**
   - Double-check the backend URL in Azure Portal
   - Should start with `https://`

4. **Environment Variables Not Updated**
   - After changing config, wait 2-3 minutes
   - Clear browser cache (Ctrl+Shift+Delete)
   - Do a hard refresh (Ctrl+F5)

---

## File Structure Reference

### Frontend (What's Deployed)
- Location: Root of repository
- Build output: `dist/` folder (auto-generated)
- Build command: `npm run build` 
- Framework: React + Vite

### Backend (Separate Service)
- Location: `server/` folder (in same repo, but deployed separately)
- Running on: Azure App Service
- Port: 3000 (in container)
- Socket.IO: WebSocket server for real-time communication

---

## What Changed in the Code

Updated these files to use environment variables:

1. **`src/pages/Home.jsx`**
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   const res = await fetch(`${apiUrl}/api/create-meeting`, ...)
   ```

2. **`src/pages/admin/AdminLogin.jsx`**
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   const res = await fetch(`${apiUrl}/api/admin-login`, ...)
   ```

3. **`src/pages/admin/AdminDashboard.jsx`**
   ```javascript
   const socketUrl = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000';
   socketRef.current = io(socketUrl);
   ```

4. **`src/pages/MeetingRoom.jsx`**
   ```javascript
   const socketUrl = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000';
   socketRef.current = io(socketUrl, {...});
   ```

---

## Quick Checklist

- [ ] Backend service is running and accessible
- [ ] Environment variables are set in Azure Static Web Apps
- [ ] `VITE_API_URL` is correct
- [ ] `VITE_SOCKET_SERVER_URL` is correct
- [ ] GitHub Actions workflow completed successfully
- [ ] Cleared browser cache and did hard refresh
- [ ] Backend URL starts with `https://`
- [ ] Port 3000 is mentioned in Azure (should be in-container, not exposed)

---

## Need Help?

Check these logs in Azure Portal:
1. **Static Web App → Monitoring → Logs** - Frontend deployment logs
2. **App Service → Monitoring → Log Stream** - Backend runtime logs

Both should show green/success status for proper functioning.
