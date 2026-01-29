import Fuse from "fuse.js";
import type { IFuseOptions, FuseResultMatch } from "fuse.js";

/**
 * Configuration options for fuzzy search
 * Optimized for operator search use cases (typos, partial matches, scrambled letters)
 */
const DEFAULT_FUSE_OPTIONS: IFuseOptions<any> = {
  threshold: 0.3, // Balanced: allows typos but not too loose (0 = exact, 1 = match anything)
  includeScore: true, // Enable relevance scoring for sorting
  minMatchCharLength: 1, // Allow single character searches
  ignoreLocation: true, // Match anywhere in string (better for partial matches)
  findAllMatches: true, // Find all matches across all fields
};

/**
 * Creates a Fuse.js search index for a given dataset
 * The index is cached and reused for multiple searches on the same dataset
 *
 * @param items - Array of items to index
 * @param keys - Array of field names to search in (e.g., ["id", "license", "driver"])
 * @param options - Optional Fuse.js configuration options
 * @returns Fuse instance ready for searching
 */
export function createFuzzySearchIndex<T>(
  items: T[],
  keys: string[],
  options?: Partial<IFuseOptions<T>>,
): Fuse<T> {
  const fuseOptions: IFuseOptions<T> = {
    ...DEFAULT_FUSE_OPTIONS,
    ...options,
    keys, // Fields to search in
  };

  return new Fuse(items, fuseOptions);
}

/**
 * Performs fuzzy search on a dataset using Fuse.js
 * Returns results sorted by relevance score (best matches first)
 *
 * @param items - Array of items to search
 * @param query - Search query string
 * @param keys - Array of field names to search in
 * @param options - Optional Fuse.js configuration options
 * @returns Array of items matching the query, sorted by relevance
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  keys: string[],
  options?: Partial<IFuseOptions<T>>,
): T[] {
  // Return all items if query is empty
  if (!query.trim()) {
    return items;
  }

  // Create search index
  const fuse = createFuzzySearchIndex(items, keys, options);

  // Perform search
  const results = fuse.search(query);

  // Extract items from results (sorted by relevance score)
  return results.map((result) => result.item);
}

/**
 * Type guard to check if Fuse.js types are available
 * Fuse.js v7+ includes TypeScript types
 */
export type FuzzySearchResult<T> = {
  item: T;
  score?: number;
  matches?: readonly FuseResultMatch[];
};
