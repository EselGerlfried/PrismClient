import type { FastifyInstance } from 'fastify';
import { redis } from '../redis/client.js';

export default async function wsRoutes(app: FastifyInstance) {
  app.get('/ws/cosmetics', { websocket: true }, (socket, _request) => {
    const sub = redis.duplicate();

    sub.subscribe('cosmetics:update', (err) => {
      if (err) socket.close();
    });

    sub.on('message', (_channel: string, message: string) => {
      if (socket.readyState === socket.OPEN) {
        socket.send(message);
      }
    });

    socket.on('close', () => {
      sub.unsubscribe();
      sub.quit();
    });
  });
}
