import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { debts } from './schema';

// Vercel PostgreSQL bağlantısı
export const db = drizzle(sql);

export async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS debts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type VARCHAR(50) NOT NULL,
        due_date TIMESTAMP NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Debts table created successfully');
  } catch (error) {
    console.error('Error creating debts table:', error);
    throw error;
  }
}
