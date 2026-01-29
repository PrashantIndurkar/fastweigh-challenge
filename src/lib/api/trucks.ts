import { trucks } from "@/lib/data/trucks";
import type { TruckSearchResult, TruckDetail } from "@/types";
import { createFuzzySearchIndex } from "@/lib/utils/fuzzySearch";
import type { Truck } from "@/types";

/**
 * Simulates network delay for realistic API behavior
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Random delay between min and max milliseconds
 */
const randomDelay = (min: number, max: number): Promise<void> =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min);

/**
 * Module-level cached Fuse.js index for truck search
 * Created once and reused for all search operations
 * Searches across: id, license, driver, type, carrier
 */
const truckSearchIndex = createFuzzySearchIndex<Truck>(trucks, [
  "id",
  "license",
  "driver",
  "type",
  "carrier",
]);

/**
 * Search trucks by query string
 * Returns lightweight truck data (no loads field)
 * Simulates 150-300ms network delay
 */
/**
 * Search trucks by query string using fuzzy search
 * Returns lightweight truck data (no loads field)
 * Instant response for empty queries (dropdown opening), minimal delay for searches
 * Uses Fuse.js for fuzzy matching (handles typos, partial matches, scrambled letters)
 */
export async function searchTrucks(
  query: string,
): Promise<TruckSearchResult[]> {
  const queryTrimmed = query.trim();

  // If empty query, return all trucks instantly (no delay for dropdown opening)
  if (!queryTrimmed) {
    return trucks.map(({ id, license, driver, type, carrier, tare }) => ({
      id,
      license,
      driver,
      type,
      carrier,
      tare,
    }));
  }

  // Small delay only for actual searches (simulates network, but minimal)
  await randomDelay(50, 100);

  // Perform fuzzy search using cached index
  // Results are automatically sorted by relevance score
  const searchResults = truckSearchIndex.search(queryTrimmed);

  // Map results to TruckSearchResult format
  return searchResults.map((result) => {
    const truck = result.item;
    return {
      id: truck.id,
      license: truck.license,
      driver: truck.driver,
      type: truck.type,
      carrier: truck.carrier,
      tare: truck.tare,
    };
  });
}

/**
 * Get full truck details by ID
 * Returns truck with loads field
 * Simulates 100-200ms network delay
 */
export async function getTruckById(id: string): Promise<TruckDetail | null> {
  await randomDelay(100, 200);

  const truck = trucks.find((t) => t.id === id);

  if (!truck) {
    return null;
  }

  // Generate mock loads value (random between 5-50)
  // In a real app, this would come from the backend
  const loads = String(Math.floor(Math.random() * 46) + 5);

  return {
    ...truck,
    loads,
  };
}
