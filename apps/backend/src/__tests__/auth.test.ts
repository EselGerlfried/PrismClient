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

describe('POST /auth/microsoft', () => {
  it('returns 400 when code missing', async () => {
    const res = await app.inject({ method: 'POST', url: '/auth/microsoft', payload: {} });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /auth/refresh', () => {
  it('returns 401 when refreshToken invalid', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: { refreshToken: 'bogus' },
    });
    expect(res.statusCode).toBe(401);
  });
});
