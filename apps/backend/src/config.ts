import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(32),
  MS_CLIENT_ID: z.string(),
  MS_CLIENT_SECRET: z.string(),
  MS_REDIRECT_URI: z.string().url(),
  TEBEX_SECRET: z.string(),
  R2_PUBLIC_URL: z.string().url().default('https://assets.prismclient.app'),
  ADMIN_TOKEN: z.string().min(32),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const config = schema.parse(process.env);
export type Config = z.infer<typeof schema>;
