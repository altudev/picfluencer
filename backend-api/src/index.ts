import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'

// Type definitions for context variables
type Variables = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}

const app = new Hono<{ Variables: Variables }>()

// Configure CORS for mobile and web clients
app.use(
  '/api/*',
  cors({
    origin: [
      'http://localhost:3000',      // Web development
      'http://localhost:3001',      // Alternative port
      'http://localhost:8081',      // Expo development
      'http://localhost:19006',     // Expo web
      'exp://192.168.1.*',          // Expo mobile (adjust IP as needed)
      'picfluencer://',             // Mobile app scheme
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
    credentials: true,
  })
)

// Auth middleware - adds user and session to context
app.use('*', async (c, next) => {
  // Skip auth middleware for auth routes themselves
  if (c.req.path.startsWith('/api/auth/')) {
    return next()
  }

  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    })

    if (!session) {
      c.set('user', null)
      c.set('session', null)
    } else {
      c.set('user', session.user)
      c.set('session', session.session)
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    c.set('user', null)
    c.set('session', null)
  }

  return next()
})

// Mount Better Auth handler
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (c) => {
  return c.json({
    name: 'Picfluencer API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      health: '/health',
      protected: '/api/protected',
      user: '/api/user/profile'
    }
  })
})

// Example protected endpoint
app.get('/api/protected', (c) => {
  const user = c.get('user')

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  return c.json({
    message: 'This is a protected route',
    user
  })
})

// User profile endpoint
app.get('/api/user/profile', (c) => {
  const user = c.get('user')
  const session = c.get('session')

  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }

  return c.json({
    user,
    session: {
      id: session?.id,
      expiresAt: session?.expiresAt
    }
  })
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

// For Bun server
const port = process.env.PORT || 3000
console.log(`🚀 Server starting on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
