import { useCallback, useMemo, useState } from "react";
import { eq } from "drizzle-orm";
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

export async function updateInventoryItemQuantity(
  db: AppDatabase,
  id: number,
  quantity: number,
): Promise<void> {
  await db
    .update(inventoryItems)
    .set({ quantity })
    .where(eq(inventoryItems.id, id));
}

export async function deleteInventoryItem(
  db: AppDatabase,
  id: number,
): Promise<void> {
  await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
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

export function useUpdateIngredient() {
  const db = useDatabase();
  const [saving, setSaving] = useState(false);

  const updateQuantity = useCallback(
    async (id: number, quantity: number) => {
      setSaving(true);
      try {
        await updateInventoryItemQuantity(db, id, quantity);
      } finally {
        setSaving(false);
      }
    },
    [db],
  );

  return { updateQuantity, saving };
}

export function useRemoveIngredient() {
  const db = useDatabase();
  const [removing, setRemoving] = useState(false);

  const remove = useCallback(
    async (id: number) => {
      setRemoving(true);
      try {
        await deleteInventoryItem(db, id);
      } finally {
        setRemoving(false);
      }
    },
    [db],
  );

  return { remove, removing };
}
