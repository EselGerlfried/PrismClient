import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { query } from '../db/client.js';
import { redis } from '../redis/client.js';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const equipSchema = z.object({
  slot: z.enum([
    'cape', 'hat', 'wings', 'aura', 'trail', 'backpack',
    'emote_slot_0', 'emote_slot_1', 'emote_slot_2', 'emote_slot_3',
    'emote_slot_4', 'emote_slot_5', 'emote_slot_6', 'emote_slot_7',
  ]),
  cosmeticId: z.string().regex(uuidRegex).nullable(),
});

type AuthRequest = FastifyRequest & { user: { sub: string } };

export default async function cosmeticsRoutes(app: FastifyInstance) {
  const verifyJwt = (app as FastifyInstance & { verifyJwt: unknown }).verifyJwt;

  app.get('/user/cosmetics', { preHandler: [verifyJwt] }, async (request, reply) => {
    const user = (request as AuthRequest).user;
    const { rows: owned } = await query(
      `SELECT ci.id, ci.name, ci.type, ci.rarity, ci.asset_url
       FROM user_cosmetics uc JOIN cosmetic_items ci ON uc.cosmetic_id = ci.id
       WHERE uc.user_uuid = $1`,
      [user.sub]
    );
    const { rows: equipped } = await query(
      'SELECT * FROM equipped_cosmetics WHERE user_uuid = $1',
      [user.sub]
    );
    return reply.send({ owned, equipped: equipped[0] ?? null });
  });

  app.get('/:uuid', async (request, reply) => {
    const { uuid } = request.params as { uuid: string };
    if (!uuidRegex.test(uuid)) return reply.status(400).send({ error: 'Invalid UUID' });

    const cacheKey = `cosmetics:player:${uuid}`;
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) return reply.send(JSON.parse(cached));

    const { rows: equipped } = await query(
      `SELECT ec.*, u.username, u.avatar_url
       FROM equipped_cosmetics ec JOIN users u ON ec.user_uuid = u.uuid
       WHERE u.uuid = $1`,
      [uuid]
    );
    if (!equipped[0]) return reply.status(404).send({ error: 'Player not found' });

    await redis.set(cacheKey, JSON.stringify(equipped[0]), 'EX', 30).catch(() => null);
    return reply.send(equipped[0]);
  });

  app.post('/equip', { preHandler: [verifyJwt] }, async (request, reply) => {
    const user = (request as AuthRequest).user;
    const body = equipSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Invalid body' });

    const { slot, cosmeticId } = body.data;

    if (cosmeticId) {
      const { rows } = await query(
        'SELECT 1 FROM user_cosmetics WHERE user_uuid = $1 AND cosmetic_id = $2',
        [user.sub, cosmeticId]
      );
      if (!rows[0]) return reply.status(403).send({ error: 'Cosmetic not owned' });
    }

    const colName = `${slot}_id`;
    await query(
      `INSERT INTO equipped_cosmetics (user_uuid, ${colName})
       VALUES ($1, $2)
       ON CONFLICT (user_uuid) DO UPDATE SET ${colName} = EXCLUDED.${colName}, updated_at = NOW()`,
      [user.sub, cosmeticId]
    );

    await redis.del(`cosmetics:player:${user.sub}`).catch(() => null);
    await redis.publish('cosmetics:update', JSON.stringify({ uuid: user.sub })).catch(() => null);

    return reply.send({ ok: true });
  });
}
