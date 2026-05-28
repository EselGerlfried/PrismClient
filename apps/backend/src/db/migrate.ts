import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { pool } from './client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MIGRATIONS = ['001_initial.sql'];

export async function runMigrations(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  for (const file of MIGRATIONS) {
    const { rows } = await pool.query(
      'SELECT version FROM schema_migrations WHERE version = $1',
      [file]
    );
    if (rows.length > 0) continue;

    const sql = await readFile(join(__dirname, 'migrations', file), 'utf8');
    await pool.query(sql);
    await pool.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
    console.log(`[migrate] applied ${file}`);
  }
}
