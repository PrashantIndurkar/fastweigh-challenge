import { useQuery } from "@tanstack/react-query";
import { searchTrucks, getTruckById } from "@/lib/api/trucks";
import type { TruckSearchResult, TruckDetail } from "@/types";
import { trucks } from "@/lib/data/trucks";

/**
 * Pre-computed initial data for empty query (all trucks)
 * This ensures instant dropdown opening without waiting for API call
 */
const initialTruckData: TruckSearchResult[] = trucks.map(
  ({ id, license, driver, type, carrier, tare }) => ({
    id,
    license,
    driver,
    type,
    carrier,
    tare,
  }),
);

/**
 * Hook for searching trucks
 * Query key: ['trucks', 'search', query]
 * Always enabled (empty query returns all trucks)
 * Uses initialData for empty queries to enable instant dropdown opening
 */
export function useTruckSearch(query: string) {
  const isEmptyQuery = !query.trim();
  return useQuery<TruckSearchResult[]>({
    queryKey: ["trucks", "search", query],
    queryFn: () => searchTrucks(query),
    enabled: true, // Always enabled, empty query returns all trucks
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Provide initial data for empty queries to enable instant dropdown opening
    initialData: isEmptyQuery ? initialTruckData : undefined,
    // Use placeholderData for instant UI updates while fetching
    placeholderData: isEmptyQuery ? initialTruckData : undefined,
  });
}

/**
 * Hook for fetching truck details by ID
 * Query key: ['trucks', 'detail', id]
 * Only enabled when id is not null
 */
export function useTruckDetail(id: string | null) {
  return useQuery<TruckDetail | null>({
    queryKey: ["trucks", "detail", id],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return getTruckById(id);
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
