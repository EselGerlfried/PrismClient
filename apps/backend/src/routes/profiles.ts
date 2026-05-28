import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { query } from '../db/client.js';

const createProfileSchema = z.object({
  name: z.string().min(1).max(64),
  mcVersion: z.string().default('1.21.4'),
  modLoader: z.enum(['vanilla', 'fabric', 'forge', 'quilt']).default('fabric'),
  hudLayout: z.record(z.unknown()).default({}),
  mods: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
});

type AuthRequest = FastifyRequest & { user: { sub: string } };

export default async function profilesRoutes(app: FastifyInstance) {
  const verifyJwt = (app as FastifyInstance & { verifyJwt: unknown }).verifyJwt;

  app.get('/', { preHandler: [verifyJwt] }, async (request, reply) => {
    const user = (request as AuthRequest).user;
    const { rows } = await query(
      'SELECT * FROM profiles WHERE user_uuid = $1 ORDER BY created_at ASC',
      [user.sub]
    );
    return reply.send(rows);
  });

  app.post('/', { preHandler: [verifyJwt] }, async (request, reply) => {
    const user = (request as AuthRequest).user;
    const body = createProfileSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid body' });

    const { name, mcVersion, modLoader, hudLayout, mods, isDefault } = body.data;

    if (isDefault) {
      await query('UPDATE profiles SET is_default = FALSE WHERE user_uuid = $1', [user.sub]);
    }

    const { rows } = await query(
      `INSERT INTO profiles (user_uuid, name, mc_version, mod_loader, hud_layout, mods, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user.sub, name, mcVersion, modLoader, JSON.stringify(hudLayout), JSON.stringify(mods), isDefault]
    );

    return reply.status(201).send(rows[0]);
  });

  app.put('/:id', { preHandler: [verifyJwt] }, async (request, reply) => {
    const user = (request as AuthRequest).user;
    const { id } = request.params as { id: string };
    const body = createProfileSchema.partial().safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid body' });

    const { rows: existing } = await query(
      'SELECT id FROM profiles WHERE id = $1 AND user_uuid = $2',
      [id, user.sub]
    );
    if (!existing[0]) return reply.status(404).send({ error: 'Profile not found' });

    const updates = body.data;
    if (updates.isDefault) {
      await query('UPDATE profiles SET is_default = FALSE WHERE user_uuid = $1', [user.sub]);
    }

    const { rows } = await query(
      `UPDATE profiles SET
        name = COALESCE($1, name),
        mc_version = COALESCE($2, mc_version),
        mod_loader = COALESCE($3, mod_loader),
        hud_layout = COALESCE($4, hud_layout),
        mods = COALESCE($5, mods),
        is_default = COALESCE($6, is_default),
        updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [
        updates.name ?? null,
        updates.mcVersion ?? null,
        updates.modLoader ?? null,
        updates.hudLayout ? JSON.stringify(updates.hudLayout) : null,
        updates.mods ? JSON.stringify(updates.mods) : null,
        updates.isDefault ?? null,
        id,
      ]
    );
    return reply.send(rows[0]);
  });

  app.delete('/:id', { preHandler: [verifyJwt] }, async (request, reply) => {
    const user = (request as AuthRequest).user;
    const { id } = request.params as { id: string };
    const { rowCount } = await query(
      'DELETE FROM profiles WHERE id = $1 AND user_uuid = $2',
      [id, user.sub]
    );
    if (!rowCount) return reply.status(404).send({ error: 'Profile not found' });
    return reply.send({ ok: true });
  });
}
