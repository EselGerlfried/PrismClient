import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

vi.mock('../db/client.js', () => ({
  query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
  pool: { end: vi.fn() },
}));

vi.mock('../redis/client.js', () => ({
  redis: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    quit: vi.fn().mockResolvedValue('OK'),
    duplicate: vi.fn().mockReturnValue({
      subscribe: vi.fn(),
      on: vi.fn(),
      unsubscribe: vi.fn(),
      quit: vi.fn(),
    }),
  },
}));

import { createApp } from '../app.js';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;

beforeAll(async () => {
  app = await createApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('POST /webhooks/tebex', () => {
  it('returns 401 with invalid signature', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/webhooks/tebex',
      headers: { 'x-signature': 'invalidsig', 'content-type': 'application/json' },
      payload: JSON.stringify({ type: 'payment.completed', subject: {} }),
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /admin/*', () => {
  it('returns 401 without admin token', async () => {
    const res = await app.inject({ method: 'GET', url: '/admin/users' });
    expect(res.statusCode).toBe(401);
  });
});
