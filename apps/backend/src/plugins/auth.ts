import fp from 'fastify-plugin';
import { jwtVerify } from 'jose';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { config } from '../config.js';

const secret = new TextEncoder().encode(config.JWT_SECRET);

export default fp(async (app: FastifyInstance) => {
  app.decorate('verifyJwt', async (request: FastifyRequest, reply: FastifyReply) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing token' });
    }
    try {
      const { payload } = await jwtVerify(auth.slice(7), secret);
      (request as FastifyRequest & { user: unknown }).user = payload;
    } catch {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });
});
