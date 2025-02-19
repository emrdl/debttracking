import { pgTable, serial, varchar, decimal, timestamp, text } from 'drizzle-orm/pg-core';

export const debts = pgTable('debts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  dueDate: timestamp('due_date').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
