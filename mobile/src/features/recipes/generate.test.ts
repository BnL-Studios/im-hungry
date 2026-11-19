import { expect, it, vi } from "vitest";
import { generateFromInventory } from "./generate";

const endpoint = "http://127.0.0.1:8787/functions/v1/generate-recipe";
const stock = [{ id: 1, name: "Ris", unit: "g" as const, quantity: 120 }];
const recipe = { title: "Ris", ingredients: [{ id: 1, quantity: 80, unit: "g" }],
  steps: ["Tillaga riset."], estimatedCookingTime: 15 };

it("sends only stock fields, reads again and hands the original snapshot to the result view", async () => {
  const read = vi.fn(() => stock.map(row => ({ ...row, private: true })));
  const send = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) => Response.json(recipe));
  await expect(generateFromInventory(read, endpoint, send)).resolves.toEqual({ recipe, snapshot: stock });
  expect(JSON.parse(String(send.mock.calls[0][1]?.body))).toEqual({ ingredients: stock });
  expect(read).toHaveBeenCalledTimes(2);
});

it("rejects stock consumed during generation", async () => {
  const read = vi.fn().mockReturnValueOnce(stock).mockReturnValueOnce([]);
  await expect(generateFromInventory(read, endpoint, async () => Response.json(recipe))).rejects.toThrow("ändrats");
});

it("does not call the service for empty inventory", async () => {
  const send = vi.fn();
  await expect(generateFromInventory(() => [], endpoint, send)).rejects.toThrow("Lägg till");
  expect(send).not.toHaveBeenCalled();
});

it("reports no recipe separately from an invalid success response", async () => {
  await expect(generateFromInventory(() => stock, endpoint, async () =>
    Response.json({ error: { code: "NO_RECIPE" } }, { status: 422 }))).rejects.toThrow("inte att laga");
  await expect(generateFromInventory(() => stock, endpoint, async () =>
    Response.json({ ...recipe, steps: [] }))).rejects.toThrow("stämde inte");
});
