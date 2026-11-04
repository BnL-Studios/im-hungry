import { Suspense, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../../drizzle/migrations';

async function onInit(db: SQLiteDatabase): Promise<void> {
  await migrate(drizzle(db), migrations);
}

export function DatabaseProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      }
    >
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