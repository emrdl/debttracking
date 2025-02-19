import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { debts } from './schema';

// Yerel geliştirme için PostgreSQL bağlantısı
const connectionString = process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/debt_tracker';
const client = postgres(connectionString);
export const db = drizzle(client);

export async function createTable() {
  try {
    await client`
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
