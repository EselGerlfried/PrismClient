import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

vi.mock('../db/client.js', () => ({
  query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
  pool: { end: vi.fn() },
}));

vi.mock('../redis/client.js', () => ({
  redis: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    publish: vi.fn().mockResolvedValue(1),
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

describe('GET /cosmetics/:uuid', () => {
  it('returns 400 for invalid uuid', async () => {
    const res = await app.inject({ method: 'GET', url: '/cosmetics/not-a-uuid' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 for unknown uuid', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/cosmetics/00000000-0000-0000-0000-000000000000',
    });
    expect(res.statusCode).toBe(404);
  });
});

describe('GET /user/me', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'GET', url: '/user/me' });
    expect(res.statusCode).toBe(401);
  });
});
