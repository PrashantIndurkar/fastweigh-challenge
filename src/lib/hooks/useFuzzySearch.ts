import { useMemo } from "react";
import { useDebounce } from "./useDebounce";
import { createFuzzySearchIndex } from "@/lib/utils/fuzzySearch";
import type { IFuseOptions } from "fuse.js";

/**
 * Custom hook for fuzzy search with debouncing and caching
 * Optimized for search inputs that need to handle typos, partial matches, and scrambled letters
 *
 * @param items - Array of items to search
 * @param searchQuery - Search query string (will be debounced)
 * @param filterFields - Array of field names to search in (e.g., ["id", "license", "driver"])
 * @param debounceDelay - Debounce delay in milliseconds (default: 300ms)
 * @param fuseOptions - Optional Fuse.js configuration options
 * @returns Filtered items sorted by relevance score
 *
 * @example
 * const items = [{ id: "T001", license: "ABC-123", driver: "John Doe" }];
 * const filtered = useFuzzySearch(items, "ABC", ["id", "license", "driver"]);
 */
export function useFuzzySearch<T extends Record<string, any>>(
  items: T[],
  searchQuery: string,
  filterFields: string[],
  debounceDelay: number = 300,
  fuseOptions?: Partial<IFuseOptions<T>>,
): T[] {
  // Only debounce when there's actual search text - empty queries return immediately
  // This ensures instant dropdown opening when clicking on input
  const shouldDebounce = searchQuery.trim().length > 0;
  const debouncedQuery = useDebounce(
    searchQuery,
    shouldDebounce ? debounceDelay : 0,
  );

  // Create and cache Fuse index per items array
  // Index is only recreated when items array reference or filterFields change
  // Note: fuseOptions should be stable (not change between renders) for optimal performance
  const fuseIndex = useMemo(() => {
    return createFuzzySearchIndex(items, filterFields, fuseOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, filterFields]);

  // Perform fuzzy search with cached index
  const filteredItems = useMemo(() => {
    // Return all items if query is empty
    if (!debouncedQuery.trim()) {
      return items;
    }

    // Perform search using cached index
    const results = fuseIndex.search(debouncedQuery);

    // Extract items from results (already sorted by relevance score)
    return results.map((result) => result.item);
  }, [fuseIndex, debouncedQuery, items]);

  return filteredItems;
}
