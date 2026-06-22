import { Pool } from 'pg';
import { ENV } from './environment.js';

const rawConn = (ENV.DATABASE_URL || 'postgresql://postgres.oincokovtluztijhrugm:LYxS9bsHlSPuTpeJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require')
  .replace('?sslmode=require', '')
  .replace('&sslmode=require', '');

export const pgPool = new Pool({
  connectionString: rawConn,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export default pgPool;
