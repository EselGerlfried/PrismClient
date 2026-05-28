import type { FastifyInstance } from 'fastify';
import { verifyTebexSignature } from '../services/tebex.js';
import { query } from '../db/client.js';

interface TebexEvent {
  type: string;
  subject: {
    packages?: Array<{ id: string }>;
    customer?: { username?: { id?: string; username: string } };
  };
}

export default async function webhooksRoutes(app: FastifyInstance) {
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
    done(null, body);
  });

  app.post('/tebex', async (request, reply) => {
    const rawBody = request.body as string;
    const signature = (request.headers['x-signature'] as string) ?? '';

    if (!verifyTebexSignature(rawBody, signature)) {
      return reply.status(401).send({ error: 'Invalid signature' });
    }

    const event: TebexEvent = JSON.parse(rawBody);

    if (event.type === 'payment.completed') {
      const msOid = event.subject?.customer?.username?.id;
      const packages = event.subject?.packages ?? [];

      if (msOid && packages.length > 0) {
        const { rows: userRows } = await query(
          'SELECT uuid FROM users WHERE ms_oid = $1',
          [msOid]
        );
        const user = userRows[0];
        if (user) {
          for (const pkg of packages) {
            const { rows: items } = await query(
              'SELECT id FROM cosmetic_items WHERE tebex_id = $1',
              [pkg.id]
            );
            if (items[0]) {
              await query(
                `INSERT INTO user_cosmetics (user_uuid, cosmetic_id) VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`,
                [user.uuid, items[0].id]
              );
            }
          }
        }
      }
    }

    return reply.send({ ok: true });
  });
}
