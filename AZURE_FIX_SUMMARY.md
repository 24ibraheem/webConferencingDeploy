# Azure Static Web Apps Fix - Quick Summary

## Problem
Your Azure-deployed frontend couldn't reach the backend, causing:
```
HTTP 405: Make sure the backend server is running on port 3000.
```

## Root Cause
✗ **Old Code:** Hardcoded backend URLs that don't work in Azure
```javascript
// Before (WRONG)
fetch('https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net/api/create-meeting')
io('https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net/')
```

## Solution Applied
✅ **New Code:** Uses environment variables that can be configured per environment
```javascript
// After (CORRECT)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
fetch(`${apiUrl}/api/create-meeting`)

const socketUrl = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000';
io(socketUrl)
```

## Files Modified
1. `src/pages/Home.jsx` - Create meeting endpoint
2. `src/pages/admin/AdminLogin.jsx` - Admin login endpoint
3. `src/pages/admin/AdminDashboard.jsx` - Socket.IO connection
4. `src/pages/MeetingRoom.jsx` - Socket.IO connection
5. `.env.example` - Template for environment variables
6. `AZURE_CONFIGURATION_GUIDE.md` - Full configuration guide (NEW)

## What You Need to Do NOW

### In Azure Portal:
1. Go to **Azure Static Web Apps** → Your app
2. Click **Settings** → **Configuration**
3. Add these application settings:

```
VITE_API_URL = https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net
VITE_SOCKET_SERVER_URL = https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net
```

4. Click **Save**
5. Wait 2-3 minutes for changes to apply
6. Clear browser cache (Ctrl+Shift+Delete)
7. Visit your app URL again

### GitHub Actions:
- Deployment triggered automatically ✓
- Wait for build to complete (~5 min)
- Check Actions tab for success status

## Testing
After configuration:
1. Visit: `https://proud-moss-034cd9b00.3.azurestaticapps.net`
2. Try "Create New Meeting" button
3. Should work without errors

## Troubleshooting
| Issue | Solution |
|-------|----------|
| Still getting 405 error | Verify backend URL in Azure config, ensure backend service is running |
| CORS errors | Backend has CORS enabled, check browser console for exact error |
| Blank page | Check browser console for JavaScript errors |
| Changes not taking effect | Clear cache, wait 3-5 min, hard refresh (Ctrl+F5) |

## Local Development
For testing locally, make sure you have:
```bash
# In project root
npm install
npm run dev

# In server folder (different terminal)
cd server
npm install
npm start
```

Environment variables will use defaults (http://localhost:3000).

---

For detailed info, see: **AZURE_CONFIGURATION_GUIDE.md** in the repo root.
