# Android Troubleshooting Guide

## Common Issues and Solutions

### 1. Network Request Failed Error

**Symptoms:**
- `ERROR Get session error: [TypeError: Network request failed]`
- App can't connect to backend API
- Authentication fails with network errors

**Solutions:**

#### For Android Emulator

The Android emulator can't access `localhost` directly. The app automatically detects Android emulator and uses `10.0.2.2` instead, but make sure:

1. **Backend is running:**
   ```bash
   cd backend-api
   bun run dev
   # Should show: Server running on http://localhost:3000
   ```

2. **Check the console logs:**
   Look for these logs when the app starts:
   ```
   🔗 Auth API URL: http://10.0.2.2:3000/api/auth
   📱 Platform: android
   🔧 Is Device: false
   ```

3. **Verify connectivity:**
   From your terminal on the host machine:
   ```bash
   curl http://localhost:3000/api/auth
   # Should return a response, not an error
   ```

#### For Physical Android Device

1. **Find your machine's IP address:**
   ```bash
   # Windows
   ipconfig | findstr IPv4

   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Update .env file:**
   ```env
   # mobile/.env
   API_URL="http://YOUR_IP_ADDRESS:3000/api/auth"
   API_BASE_URL="http://YOUR_IP_ADDRESS:3000"
   ```
   Example:
   ```env
   API_URL="http://192.168.1.100:3000/api/auth"
   API_BASE_URL="http://192.168.1.100:3000"
   ```

3. **Ensure both devices are on the same network:**
   - Your development machine and Android device must be on the same WiFi network
   - Disable VPNs that might interfere

4. **Check firewall settings:**
   Make sure your firewall allows connections on port 3000

### 2. useEffect Warning

**Fixed in latest version**

The warning about `useEffect must not return anything besides a function` has been fixed. If you still see it:

1. **Clear Metro cache:**
   ```bash
   npx expo start --clear
   ```

2. **Restart the app:**
   - Press `r` in the terminal to reload
   - Or shake device and select "Reload"

### 3. Session Not Persisting

**Symptoms:**
- User gets logged out on app restart
- Session data not saved

**Solutions:**

1. **Verify SecureStore is working:**
   Check for any SecureStore errors in the console

2. **Clear app data:**
   - Go to Android Settings > Apps > Picfluencer > Storage
   - Clear Cache and Clear Data
   - Restart the app

### 4. CORS Issues

**Symptoms:**
- `CORS policy` errors in console
- Requests blocked by CORS

**Solutions:**

1. **Backend is configured correctly:**
   Check that `/backend-api/src/index.ts` has CORS enabled:
   ```typescript
   app.use(
     cors({
       origin: [
         "http://localhost:*",
         "http://10.0.2.2:*",
         "exp://*",
         "picfluencer://"
       ],
       credentials: true,
     })
   );
   ```

2. **For production:**
   Add your production URLs to the CORS origin list

### 5. Build Errors

**Symptoms:**
- App won't build for Android
- Metro bundler errors

**Solutions:**

1. **Clear all caches:**
   ```bash
   # Clear Metro cache
   npx expo start --clear

   # Clear watchman (if installed)
   watchman watch-del-all

   # Clear node modules and reinstall
   rm -rf node_modules
   bun install

   # For Android specific issues
   cd android && ./gradlew clean
   cd ..
   ```

2. **Check Metro config:**
   Ensure `metro.config.js` exists and has:
   ```javascript
   config.resolver.unstable_enablePackageExports = true;
   ```

## Testing Checklist

Before testing authentication on Android:

- [ ] Backend server is running (`bun run dev` in backend-api)
- [ ] PostgreSQL database is running
- [ ] Console shows correct API URL (10.0.2.2 for emulator)
- [ ] No error messages in Metro bundler console
- [ ] Backend console shows incoming requests

## Debug Mode

To enable more detailed logging:

1. **In the app:**
   The auth client already logs the API URL and platform info

2. **Check backend logs:**
   Backend should log all incoming requests:
   ```
   POST /api/auth/sign-in/anonymous 200
   GET /api/auth/session 200
   ```

3. **Use React Native Debugger:**
   - Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
   - Select "Debug JS Remotely"
   - Open Chrome DevTools to see all console logs

## Quick Commands

```bash
# Start everything for Android development
# Terminal 1 - Database
docker start postgres_db

# Terminal 2 - Backend
cd backend-api
bun run dev

# Terminal 3 - Mobile
cd mobile
npx expo start --clear

# Then press 'a' for Android
```

## Still Having Issues?

1. **Check the logs:**
   - Look for the API URL being used (should be 10.0.2.2 for emulator)
   - Check for any error messages in red
   - Verify backend is receiving requests

2. **Try the web version first:**
   - Press `w` in Expo to open web version
   - If web works but Android doesn't, it's likely a network/URL issue

3. **Common fixes:**
   - Restart the Metro bundler
   - Restart the backend server
   - Restart the Android emulator
   - Clear all caches

4. **File an issue:**
   If problems persist, create an issue with:
   - Error messages (full stack trace)
   - Platform info (Android version, emulator/device)
   - Network setup (using emulator or physical device)
   - Console logs showing API URL detection