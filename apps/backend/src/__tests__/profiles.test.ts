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

describe('profiles routes', () => {
  it('GET /profiles returns 401 without auth', async () => {
    const res = await app.inject({ method: 'GET', url: '/profiles' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /profiles returns 401 without auth', async () => {
    const res = await app.inject({ method: 'POST', url: '/profiles', payload: {} });
    expect(res.statusCode).toBe(401);
  });
});

describe('updates routes', () => {
  it('GET /updates/latest returns 200', async () => {
    const res = await app.inject({ method: 'GET', url: '/updates/latest' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /announcements returns 200', async () => {
    const res = await app.inject({ method: 'GET', url: '/announcements' });
    expect(res.statusCode).toBe(200);
  });
});
