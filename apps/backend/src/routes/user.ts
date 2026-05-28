import type { FastifyInstance, FastifyRequest } from 'fastify';
import { query } from '../db/client.js';

export default async function userRoutes(app: FastifyInstance) {
  app.get('/me', { preHandler: [(app as FastifyInstance & { verifyJwt: unknown }).verifyJwt] }, async (request, reply) => {
    const user = (request as FastifyRequest & { user: { sub: string } }).user;
    const { rows } = await query(
      'SELECT uuid, username, email, tier, avatar_url, created_at FROM users WHERE uuid = $1',
      [user.sub]
    );
    if (!rows[0]) return reply.status(404).send({ error: 'User not found' });
    return reply.send(rows[0]);
  });
}
