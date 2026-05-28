import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

export default async function updatesRoutes(app: FastifyInstance) {
  app.get('/updates/latest', async (_request, reply) => {
    const { rows } = await query(
      `SELECT version, channel, download_url, changelog, published_at
       FROM versions WHERE channel = 'stable' ORDER BY published_at DESC LIMIT 1`
    );
    return reply.send(
      rows[0] ?? { version: '0.0.0', channel: 'stable', download_url: '', changelog: '' }
    );
  });

  app.get('/announcements', async (_request, reply) => {
    const { rows } = await query(
      `SELECT id, type, title, body, cta_label, cta_url, force_read, expires_at
       FROM announcements
       WHERE active = TRUE AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC`
    );
    return reply.send(rows);
  });
}
