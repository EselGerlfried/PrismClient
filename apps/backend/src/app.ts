import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import corsPlugin from './plugins/cors.js';
import authPlugin from './plugins/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import cosmeticsRoutes from './routes/cosmetics.js';
import shopRoutes from './routes/shop.js';
import profilesRoutes from './routes/profiles.js';
import updatesRoutes from './routes/updates.js';
import webhooksRoutes from './routes/webhooks.js';
import adminRoutes from './routes/admin.js';
import wsRoutes from './routes/ws.js';

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });

  await app.register(corsPlugin);
  await app.register(authPlugin);
  await app.register(websocket);

  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(userRoutes, { prefix: '/user' });
  await app.register(cosmeticsRoutes, { prefix: '/cosmetics' });
  await app.register(shopRoutes, { prefix: '/shop' });
  await app.register(profilesRoutes, { prefix: '/profiles' });
  await app.register(updatesRoutes);
  await app.register(webhooksRoutes, { prefix: '/webhooks' });
  await app.register(adminRoutes, { prefix: '/admin' });
  await app.register(wsRoutes);

  return app;
}
