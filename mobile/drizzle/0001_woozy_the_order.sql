PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_inventory_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`quantity` real NOT NULL,
	`unit` text NOT NULL,
	CONSTRAINT "inventory_items_quantity_positive" CHECK("__new_inventory_items"."quantity" > 0),
	CONSTRAINT "inventory_items_unit_allowed" CHECK("__new_inventory_items"."unit" in ('g', 'ml', 'quantity'))
);
--> statement-breakpoint
INSERT INTO `__new_inventory_items`("id", "name", "quantity", "unit") SELECT "id", "name", "quantity", "unit" FROM `inventory_items`;--> statement-breakpoint
DROP TABLE `inventory_items`;--> statement-breakpoint
ALTER TABLE `__new_inventory_items` RENAME TO `inventory_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;