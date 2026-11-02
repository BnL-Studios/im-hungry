import { sql } from 'drizzle-orm';
import { check, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const inventoryItems = sqliteTable(
  'inventory_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    quantity: real('quantity').notNull(),
    unit: text('unit', { enum: ['g', 'ml', 'qty'] }).notNull(),
  },
  (table) => [
    check('inventory_items_quantity_positive', sql`${table.quantity} > 0`),
    check('inventory_items_unit_allowed', sql`${table.unit} in ('g', 'ml', 'qty')`),
  ],
);

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type NewInventoryItem = typeof inventoryItems.$inferInsert;
