/**
 * Custom hook for entity tab navigation
 * Provides navigation logic for moving between entity fields (TRUCK, CUSTOMER, ORDER, PRODUCT)
 * with circular wrap-around support
 */

export type EntityLabel = "TRUCK" | "CUSTOMER" | "ORDER" | "PRODUCT";
export type NavigationDirection = "next" | "prev";

const ENTITY_ORDER: EntityLabel[] = ["TRUCK", "CUSTOMER", "ORDER", "PRODUCT"];

/**
 * Hook that provides entity tab navigation logic
 * @returns Function to get the next/previous entity in the navigation order
 */
export function useEntityTabNavigation() {
  /**
   * Get the next or previous entity in the navigation order
   * @param currentEntity - The current entity label
   * @param direction - "next" for Tab, "prev" for Shift+Tab
   * @returns The target entity label with wrap-around
   */
  const getTargetEntity = (
    currentEntity: EntityLabel,
    direction: NavigationDirection,
  ): EntityLabel => {
    const currentIndex = ENTITY_ORDER.indexOf(currentEntity);

    if (currentIndex === -1) {
      // Fallback to first entity if current entity not found
      return ENTITY_ORDER[0];
    }

    if (direction === "next") {
      // Move to next entity, wrap around to first if at end
      const nextIndex = (currentIndex + 1) % ENTITY_ORDER.length;
      return ENTITY_ORDER[nextIndex];
    } else {
      // Move to previous entity, wrap around to last if at start
      const prevIndex =
        currentIndex === 0 ? ENTITY_ORDER.length - 1 : currentIndex - 1;
      return ENTITY_ORDER[prevIndex];
    }
  };

  return { getTargetEntity };
}
