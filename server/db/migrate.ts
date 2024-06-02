import 'dotenv/config';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Client, Pool } from 'pg';

async function main() {
  const migrations = await readFile(join(__dirname, 'migrations.sql'), 'utf-8');
  await ensureDatabaseExists(process.env.DATABASE_URL!);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  client.on('notice', (notice) => console.log('NOTICE:', notice.message));
  await client.connect();

  console.log('Running migrations...');
  await client.query(migrations);

  const latest = await client.query(`SELECT * FROM migrations ORDER BY version DESC LIMIT 1`);
  console.log('Latest migration:', latest.rows[0]);
  await client.end();
  await pool.end();
}

async function ensureDatabaseExists(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const databaseName = url.pathname.slice(1);
  url.pathname = '';

  console.log(`Checking if database ${databaseName} exists at ${url.host}`);
  const pool = new Pool({ connectionString: url.toString() });
  const result = await pool.query(`SELECT * FROM pg_database WHERE datname = $1`, [databaseName]);
  if (result.rowCount === 0) {
    console.log(`Database ${databaseName} does not exist, creating it...`);
    await pool.query(`CREATE DATABASE ${databaseName}`);
  }
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
