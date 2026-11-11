import {
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  ActivityIndicator,
  Platform,
  View,
} from "react-native";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../../drizzle/migrations';


async function onInit(db: SQLiteDatabase): Promise<void> {
  let stage = "connecting";

  try {
    const connection = await db.getFirstAsync<{
      version: string;
    }>("SELECT sqlite_version() AS version");

    console.info("[DB] Connected:", connection?.version);

    // Ensure the tracking table has a valid SQLite primary key.
    // IF NOT EXISTS preserves any existing migration history.
    stage = "migration tracking";

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT NOT NULL,
        created_at NUMERIC
      );
    `);

    stage = "schema migrations";

    await migrate(drizzle(db), migrations);

    stage = "schema verification";

    const table = await db.getFirstAsync<{
      name: string;
    }>(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'inventory_items'
    `);

    if (!table) {
      throw new Error(
        "Required inventory_items table was not created"
      );
    }

    console.info("[DB] Initialization successful");
  } catch (error) {
    console.error(`[DB] Initialization failed at: ${stage}`);

    let current: unknown = error;

    for (let level = 0; level < 5 && current != null; level++) {
      console.error(`[DB] Error level ${level}:`, current);

      current =
        typeof current === "object" && "cause" in current
          ? current.cause
          : undefined;
    }

    throw error;
  }
}


export function DatabaseProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Native apps can initialize SQLite immediately.
  // Web must wait until React mounts in the browser.
  const [ready, setReady] = useState(
    Platform.OS !== "web"
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      setReady(true);
    }
  }, []);

  const loading = (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator />
    </View>
  );

  if (!ready) {
    return loading;
  }

  return (
    <Suspense fallback={loading}>
      <SQLiteProvider
        databaseName="imhungry.db"
        onInit={onInit}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        {children}
      </SQLiteProvider>
    </Suspense>
  );
}

