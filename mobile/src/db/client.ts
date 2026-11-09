import { useMemo } from "react";
import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

export function createDatabase(sqlite: SQLiteDatabase) {
  return drizzle(sqlite);
}

export type AppDatabase = ReturnType<typeof createDatabase>;

export function useDatabase(): AppDatabase {
  const sqlite = useSQLiteContext();

  return useMemo(() => createDatabase(sqlite), [sqlite]);
}
