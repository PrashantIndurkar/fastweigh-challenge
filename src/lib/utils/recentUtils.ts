import type { RecentActivityItem } from "@/types";
import { customers } from "@/lib/data/customers";

const STORAGE_KEY = "fastweigh_recent_items";
const MAX_RECENT_ITEMS = 20;

/**
 * Internal storage format (without display fields)
 */
interface RecentItemStorage {
  id: string;
  truckId: string;
  customerId: string;
  netWeight: number;
  timestamp: number;
}

/**
 * Formats net weight for display (e.g., 48680 -> "48.7k")
 */
export function formatNetWeight(netWeightLbs: number): string {
  if (netWeightLbs >= 1000) {
    const tons = netWeightLbs / 1000;
    return `${tons.toFixed(1)}k`;
  }
  return netWeightLbs.toString();
}

/**
 * Truncates customer name for display (e.g., "Red Builders" -> "Red...")
 */
function truncateCustomerName(name: string, maxLength: number = 10): string {
  if (name.length <= maxLength) {
    return name;
  }
  return `${name.substring(0, maxLength - 3)}...`;
}

/**
 * Formats a storage item into a display-ready RecentActivityItem
 */
function formatRecentItem(storageItem: RecentItemStorage): RecentActivityItem {
  const customer = customers.find((c) => c.name === storageItem.customerId);
  const customerName = customer?.name || storageItem.customerId;

  return {
    id: storageItem.id,
    code: storageItem.truckId,
    description: truncateCustomerName(customerName),
    value: formatNetWeight(storageItem.netWeight),
    truckId: storageItem.truckId,
    customerId: storageItem.customerId,
    netWeight: storageItem.netWeight,
  };
}

/**
 * Generates a unique ID for a recent item
 */
function generateRecentItemId(): string {
  return `recent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Saves a recent item to localStorage
 * Only saves if truckId and customerId are provided
 */
export function saveRecentItem(
  truckId: string,
  customerId: string,
  netWeight: number,
): void {
  // Validate required fields
  if (!truckId || !customerId || netWeight <= 0) {
    console.warn(
      "Cannot save recent item: missing truckId, customerId, or invalid netWeight",
    );
    return;
  }

  try {
    // Load existing items
    const existingItems = loadRecentItemsStorage();

    // Create new item
    const newItem: RecentItemStorage = {
      id: generateRecentItemId(),
      truckId,
      customerId,
      netWeight,
      timestamp: Date.now(),
    };

    // Add new item at the beginning (most recent first)
    const updatedItems = [newItem, ...existingItems];

    // Limit to MAX_RECENT_ITEMS
    const limitedItems = updatedItems.slice(0, MAX_RECENT_ITEMS);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedItems));
  } catch (error) {
    // Handle localStorage errors (quota exceeded, etc.)
    console.error("Failed to save recent item to localStorage:", error);
  }
}

/**
 * Loads recent items from localStorage and formats them for display
 */
export function loadRecentItems(): RecentActivityItem[] {
  try {
    const storageItems = loadRecentItemsStorage();
    return storageItems.map(formatRecentItem);
  } catch (error) {
    console.error("Failed to load recent items from localStorage:", error);
    return [];
  }
}

/**
 * Internal function to load raw storage items
 */
function loadRecentItemsStorage(): RecentItemStorage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as RecentItemStorage[];

    // Validate structure
    if (!Array.isArray(parsed)) {
      console.warn("Invalid recent items format in localStorage, clearing");
      clearRecentItems();
      return [];
    }

    // Filter out invalid items
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.truckId === "string" &&
        typeof item.customerId === "string" &&
        typeof item.netWeight === "number" &&
        item.netWeight > 0,
    );
  } catch (error) {
    console.error("Failed to parse recent items from localStorage:", error);
    return [];
  }
}

/**
 * Clears all recent items from localStorage
 */
export function clearRecentItems(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear recent items from localStorage:", error);
  }
}
