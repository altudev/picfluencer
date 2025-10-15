import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth';

const app = new Hono();

// Add CORS middleware to handle requests from mobile app
app.use(
  '/api/auth/*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8081', 'exp://'], // Add your mobile app origins
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// Mount the Better Auth handler
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

// Add a basic home route
app.get('/', (c) => {
  return c.text('Welcome to Picfluencer Backend API!');
});

// Add a test route to verify session
app.get('/api/user', async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  return c.json({
    user: session.user,
    session: session.session,
  });
});

export default app;
