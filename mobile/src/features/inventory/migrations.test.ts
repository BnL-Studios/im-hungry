import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const migrationsDir = fileURLToPath(
  new URL("../../../drizzle/", import.meta.url),
);

function createMigratedDatabase(): DatabaseSync {
  const db = new DatabaseSync(":memory:");
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const migration = readFileSync(join(migrationsDir, file), "utf8");

    for (const statement of migration.split("--> statement-breakpoint")) {
      if (statement.trim().length > 0) {
        db.exec(statement);
      }
    }
  }

  return db;
}

describe("SQLite-migrationer", () => {
  it("skapar inventory_items och sparar en giltig rad", () => {
    const db = createMigratedDatabase();

    db.prepare(
      "INSERT INTO inventory_items (name, quantity, unit) VALUES (?, ?, ?)",
    ).run("Mjöl", 500, "g");

    const row = db
      .prepare("SELECT name, quantity, unit FROM inventory_items")
      .get();

    expect(row).toEqual({ name: "Mjöl", quantity: 500, unit: "g" });
    db.close();
  });

  const invalidRows: [string, number, string][] = [
    ["noll", 0, "g"],
    ["negativ mängd", -1, "g"],
    ["okänd enhet", 1, "kg"],
  ];

  for (const [label, quantity, unit] of invalidRows) {
    it(`stoppar ${label}`, () => {
      const db = createMigratedDatabase();

      expect(() =>
        db
          .prepare(
            "INSERT INTO inventory_items (name, quantity, unit) VALUES (?, ?, ?)",
          )
          .run("Test", quantity, unit),
      ).toThrow();

      db.close();
    });
  }
});
