import { useMemo } from "react";
import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

export function createDatabase(sqlite: SQLiteDatabase) {
  return drizzle(sqlite);
}

export type AppDatabase = ReturnType<typeof createDatabase>;

/**
 * Returnerar en stabil Drizzle-instans för den öppna SQLite-databasen.
 * Stabiliteten är viktig för useLiveQuery, som annars prenumererar om vid varje render.
 */
export function useDatabase(): AppDatabase {
  const sqlite = useSQLiteContext();

  return useMemo(() => createDatabase(sqlite), [sqlite]);
}
