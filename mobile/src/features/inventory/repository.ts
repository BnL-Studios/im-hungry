import { useCallback, useMemo, useState } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDatabase, type AppDatabase } from "@/db/client";
import { inventoryItems, type NewInventoryItem } from "@/db/schema";

/**
 * Live-query mot matförrådet. Listan uppdateras automatiskt när en rad infogas,
 * ändras eller tas bort, så skärmarna behöver ingen egen refresh.
 */
export function useInventoryItems() {
  const db = useDatabase();
  const query = useLiveQuery(db.select().from(inventoryItems), [db]);

  const data = useMemo(
    () => [...query.data].sort((a, b) => a.name.localeCompare(b.name, "sv")),
    [query.data],
  );

  return { ...query, data };
}

export async function insertInventoryItem(
  db: AppDatabase,
  item: NewInventoryItem,
): Promise<void> {
  await db.insert(inventoryItems).values(item);
}

export function useAddIngredient() {
  const db = useDatabase();
  const [saving, setSaving] = useState(false);

  const add = useCallback(
    async (item: NewInventoryItem) => {
      setSaving(true);
      try {
        await insertInventoryItem(db, item);
      } finally {
        setSaving(false);
      }
    },
    [db],
  );

  return { add, saving };
}
