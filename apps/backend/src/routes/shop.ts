import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { query } from '../db/client.js';

const purchaseSchema = z.object({ cosmeticId: z.string().uuid() });

export default async function shopRoutes(app: FastifyInstance) {
  const verifyJwt = (app as FastifyInstance & { verifyJwt: unknown }).verifyJwt;

  app.get('/items', async (_request, reply) => {
    const { rows } = await query(
      'SELECT id, name, type, rarity, asset_url, price_cents FROM cosmetic_items WHERE active = TRUE ORDER BY rarity DESC, name ASC'
    );
    return reply.send(rows);
  });

  app.post('/purchase', { preHandler: [verifyJwt] }, async (request, reply) => {
    const body = purchaseSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'cosmeticId required' });

    const { rows } = await query(
      'SELECT id, tebex_id, price_cents FROM cosmetic_items WHERE id = $1 AND active = TRUE',
      [body.data.cosmeticId]
    );
    if (!rows[0]) return reply.status(404).send({ error: 'Item not found' });

    const item = rows[0];
    if (!item.tebex_id) return reply.status(422).send({ error: 'Item not purchasable' });

    const checkoutUrl = `https://checkout.tebex.io/checkout/packages/add/${item.tebex_id}/single`;
    return reply.send({ checkoutUrl });
  });
}
