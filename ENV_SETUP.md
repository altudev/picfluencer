# Environment Variables Setup Guide

This guide explains how to configure environment variables for both the backend API and mobile app.

## Quick Start

1. **Backend API**:
   ```bash
   cd backend-api
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Mobile App**:
   ```bash
   cd mobile
   cp .env.example .env
   # Edit .env with your values
   ```

## Backend API Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/picfluencer?schema=public` |
| `BETTER_AUTH_SECRET` | Secret key for auth tokens | Generate with: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Backend base URL | `http://localhost:3000` |

### Optional Variables

#### Email Service (Production)
- `RESEND_API_KEY` - Resend API key for sending emails
- `EMAIL_FROM` - From address for emails

#### Server Configuration
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGINS` - Allowed CORS origins

### Setting Up Backend Environment

1. **Copy the example file**:
   ```bash
   cd backend-api
   cp .env.example .env
   ```

2. **Generate a secure auth secret**:
   ```bash
   # macOS/Linux
   openssl rand -base64 32

   # Or use Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **Set up PostgreSQL**:
   ```bash
   # Using Docker
   docker run -d \
     --name postgres_db \
     -e POSTGRES_PASSWORD=123alper123 \
     -e POSTGRES_DB=picfluencer \
     -p 1453:5432 \
     postgres:latest
   ```

4. **Update your .env file**:
   ```env
   DATABASE_URL="postgresql://postgres:123alper123@localhost:1453/picfluencer?schema=public"
   BETTER_AUTH_SECRET="your-generated-secret-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

## Mobile App Environment Variables

### Required Variables

| Variable | Description | Platform-Specific Values |
|----------|-------------|-------------------------|
| `API_URL` | Backend API URL | iOS Sim: `http://localhost:3000/api/auth`<br>Android Emu: `http://10.0.2.2:3000/api/auth`<br>Physical: `http://YOUR_IP:3000/api/auth` |
| `API_BASE_URL` | Backend base URL | iOS Sim: `http://localhost:3000`<br>Android Emu: `http://10.0.2.2:3000`<br>Physical: `http://YOUR_IP:3000` |

### Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_ANONYMOUS_AUTH` | Enable guest sign-in | `true` |
| `ENABLE_MAGIC_LINK` | Enable passwordless auth | `true` |
| `ENABLE_SOCIAL_AUTH` | Enable OAuth providers | `false` |

### Setting Up Mobile Environment

1. **Copy the example file**:
   ```bash
   cd mobile
   cp .env.example .env
   ```

2. **Configure for your platform**:

   **iOS Simulator**:
   ```env
   API_URL="http://localhost:3000/api/auth"
   API_BASE_URL="http://localhost:3000"
   ```

   **Android Emulator**:
   ```env
   API_URL="http://10.0.2.2:3000/api/auth"
   API_BASE_URL="http://10.0.2.2:3000"
   ```

   **Physical Device**:
   ```bash
   # Find your IP address
   # macOS:
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows:
   ipconfig

   # Linux:
   ip addr show
   ```
   ```env
   API_URL="http://192.168.1.100:3000/api/auth"
   API_BASE_URL="http://192.168.1.100:3000"
   ```

3. **Using environment variables in code**:
   ```typescript
   import Constants from 'expo-constants';

   // Access environment variables
   const apiUrl = Constants.expoConfig?.extra?.apiUrl;
   const features = Constants.expoConfig?.extra?.features;

   // Check feature flags
   if (features?.anonymousAuth) {
     // Show anonymous sign-in button
   }
   ```

## Production Environment

### Backend Deployment

For production, set environment variables in your hosting platform:

**Heroku**:
```bash
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set BETTER_AUTH_SECRET="..."
```

**Vercel**:
```bash
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
```

**Docker**:
```dockerfile
# In your Dockerfile
ENV DATABASE_URL=postgresql://...
ENV BETTER_AUTH_SECRET=...

# Or use docker-compose.yml
environment:
  - DATABASE_URL=postgresql://...
  - BETTER_AUTH_SECRET=...
```

**Railway/Render/Fly.io**:
Use their dashboard to add environment variables.

### Mobile App Deployment

For mobile apps, use EAS Build environment variables:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**:
   ```bash
   eas build:configure
   ```

3. **Set production variables**:
   ```bash
   eas secret:create --name API_URL --value "https://api.picfluencer.app/api/auth"
   eas secret:create --name API_BASE_URL --value "https://api.picfluencer.app"
   ```

4. **Build with environment**:
   ```bash
   eas build --platform all --profile production
   ```

## Security Best Practices

### Do's ✅
- Use `.env.example` files to document required variables
- Generate strong, random secrets for production
- Use different secrets for each environment
- Store production secrets in secure vaults (AWS Secrets Manager, etc.)
- Rotate secrets regularly
- Use HTTPS in production

### Don'ts ❌
- Never commit `.env` files to version control
- Don't use default/example values in production
- Don't share secrets in plain text
- Don't log sensitive environment variables
- Don't use the same database for development and production

## Troubleshooting

### Backend Issues

**"Environment variable not found" error**:
```bash
# Check if .env file exists
ls -la backend-api/.env

# Verify variables are loaded
cd backend-api
node -e "require('dotenv').config(); console.log(process.env)"
```

**Database connection failed**:
```bash
# Test connection string
psql "postgresql://postgres:password@localhost:5432/picfluencer"

# Check if Docker container is running
docker ps | grep postgres
```

### Mobile Issues

**"Network request failed" error**:
- Verify backend is running: `curl http://localhost:3000/api/auth`
- Check API_URL matches your platform (localhost/10.0.2.2/IP)
- Ensure device is on same network (physical devices)

**Environment variables not loading**:
```bash
# Clear Metro cache
npx expo start --clear

# Verify app.config.js is being used
npx expo config --type public
```

## Environment Variable Reference

### Complete Backend Variables
See [`backend-api/.env.example`](./backend-api/.env.example)

### Complete Mobile Variables
See [`mobile/.env.example`](./mobile/.env.example)

## Additional Resources

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Better Auth Configuration](https://www.better-auth.com/docs/configuration)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)