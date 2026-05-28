import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { query } from '../db/client.js';
import { config } from '../config.js';

async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers['x-admin-token'];
  if (token !== config.ADMIN_TOKEN) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}

const announcementSchema = z.object({
  type: z.enum(['info', 'sale', 'update', 'warning']),
  title: z.string().min(1),
  body: z.string().min(1),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().url().optional(),
  forceRead: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
});

const versionSchema = z.object({
  version: z.string().min(1),
  channel: z.enum(['stable', 'beta', 'alpha']).default('stable'),
  downloadUrl: z.string().url(),
  changelog: z.string().default(''),
});

const shopItemSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']).default('common'),
  assetUrl: z.string().url(),
  priceCents: z.number().int().min(0),
  tebexId: z.string().optional(),
});

export default async function adminRoutes(app: FastifyInstance) {
  app.get('/users', { preHandler: [requireAdmin] }, async (_req, reply) => {
    const { rows } = await query(
      'SELECT uuid, username, email, tier, created_at FROM users ORDER BY created_at DESC LIMIT 100'
    );
    return reply.send(rows);
  });

  app.get('/announcements', { preHandler: [requireAdmin] }, async (_req, reply) => {
    const { rows } = await query('SELECT * FROM announcements ORDER BY created_at DESC');
    return reply.send(rows);
  });

  app.post('/announcements', { preHandler: [requireAdmin] }, async (request, reply) => {
    const body = announcementSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid body' });
    const d = body.data;
    const { rows } = await query(
      `INSERT INTO announcements (type, title, body, cta_label, cta_url, force_read, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [d.type, d.title, d.body, d.ctaLabel ?? null, d.ctaUrl ?? null, d.forceRead, d.expiresAt ?? null]
    );
    return reply.status(201).send(rows[0]);
  });

  app.delete('/announcements/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await query('UPDATE announcements SET active = FALSE WHERE id = $1', [id]);
    return reply.send({ ok: true });
  });

  app.post('/versions', { preHandler: [requireAdmin] }, async (request, reply) => {
    const body = versionSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid body' });
    const d = body.data;
    const { rows } = await query(
      `INSERT INTO versions (version, channel, download_url, changelog)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [d.version, d.channel, d.downloadUrl, d.changelog]
    );
    return reply.status(201).send(rows[0]);
  });

  app.get('/shop', { preHandler: [requireAdmin] }, async (_req, reply) => {
    const { rows } = await query('SELECT * FROM cosmetic_items ORDER BY created_at DESC');
    return reply.send(rows);
  });

  app.post('/shop', { preHandler: [requireAdmin] }, async (request, reply) => {
    const body = shopItemSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid body' });
    const d = body.data;
    const { rows } = await query(
      `INSERT INTO cosmetic_items (name, type, rarity, asset_url, price_cents, tebex_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [d.name, d.type, d.rarity, d.assetUrl, d.priceCents, d.tebexId ?? null]
    );
    return reply.status(201).send(rows[0]);
  });
}
