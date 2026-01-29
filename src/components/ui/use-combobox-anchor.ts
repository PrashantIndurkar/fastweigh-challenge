import * as React from "react";

/**
 * Hook to create a ref for combobox anchor positioning.
 * Used for advanced positioning scenarios with the Combobox component.
 */
export function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}
