import { createApp } from './app.js';
import { runMigrations } from './db/migrate.js';
import { config } from './config.js';
import { redis } from './redis/client.js';

async function main() {
  await runMigrations();
  await redis.connect();
  const app = await createApp();
  await app.listen({ port: config.PORT, host: '0.0.0.0' });
  console.log(`[prism-api] listening on :${config.PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
