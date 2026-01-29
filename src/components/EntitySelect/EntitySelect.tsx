import * as React from "react";
import { forwardRef } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "../ui/combobox";
import { cn } from "@/lib/utils";
import type { EntitySelectConfig } from "@/types";
import type { NavigationDirection } from "@/lib/hooks/useEntityTabNavigation";
import { useFuzzySearch } from "@/lib/hooks/useFuzzySearch";

export interface EntitySelectProps<T extends Record<string, any>> {
  items?: T[];
  value?: string;
  config: EntitySelectConfig<T>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | null) => void;
  onSearchChange?: (query: string) => void;
  onTabNavigation?: (direction: NavigationDirection) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  "aria-label"?: string;
}

export interface EntitySelectRef extends HTMLInputElement {
  openDropdown?: () => void;
}

/**
 * Generic entity select component using shadcn Combobox.
 * Displays detailed entity information in a structured format based on configuration.
 */
function EntitySelectInner<T extends Record<string, any>>(
  props: EntitySelectProps<T>,
  ref: React.Ref<HTMLInputElement>,
) {
  const {
    items = [],
    value,
    config,
    open,
    onOpenChange,
    onValueChange,
    onSearchChange,
    onTabNavigation,
    placeholder,
    className,
    disabled = false,
    isLoading = false,
    "aria-label": ariaLabel,
  } = props;
  const [searchValue, setSearchValue] = React.useState("");
  const [isClearing, setIsClearing] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const isTabNavigatingRef = React.useRef(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Track if user has typed anything after clearing (to know if we should restore on blur/escape)
  const hasTypedRef = React.useRef(false);

  // Expose ref methods
  React.useImperativeHandle(ref, () => {
    const input = inputRef.current;
    if (!input) {
      return null as any;
    }
    return Object.assign(input, {
      openDropdown: () => {
        if (onOpenChange) {
          onOpenChange(true);
        }
      },
    });
  });

  // Filter items using fuzzy search with debouncing and caching
  // Handles typos, partial matches, and scrambled letters
  // Convert filterFields from (keyof T)[] to string[] for fuzzy search
  const filterFieldsAsStrings = config.filterFields.map((field) =>
    String(field),
  );
  const filteredItems = useFuzzySearch(
    items,
    searchValue,
    filterFieldsAsStrings,
    150, // 150ms debounce delay - faster response while still reducing unnecessary searches
  );

  // Find selected item
  const selectedItem = React.useMemo(() => {
    return items.find((item) => String(item[config.valueField]) === value);
  }, [items, value, config.valueField]);

  // Reset clearing flag when value changes (new selection made)
  // This ensures the display updates correctly when a new item is selected
  // Only reset if we're actually clearing and a new value is selected
  React.useEffect(() => {
    if (value && isClearing && !isSearching) {
      // If value exists and we were clearing (but not actively searching), user must have selected a new item
      setIsClearing(false);
    }
  }, [value, isClearing, isSearching]);

  const handleValueChange = (newValue: string | null) => {
    // If we're searching and Combobox tries to clear the value, ignore it
    // Only allow clearing when user explicitly selects null (not during search)
    if (newValue === null && isSearching && value) {
      // Don't clear the value while searching - keep the selected item
      return;
    }

    // Reset search mode when a value is selected or explicitly cleared
    setIsSearching(false);

    if (onValueChange) {
      onValueChange(newValue);
    }
    // Clear search when item is selected
    setSearchValue("");
    // Reset clearing flag when a new value is selected
    setIsClearing(false);
    // Reset typed flag since a selection was made
    hasTypedRef.current = false;

    // Close dropdown when a value is selected (non-null)
    if (newValue !== null && onOpenChange) {
      onOpenChange(false);
    }
  };

  // Restore original value if user didn't select anything
  const restoreOriginalValue = () => {
    // Only restore if we were clearing/searching and user didn't type anything
    // or if they typed but didn't select anything
    if ((isClearing || isSearching) && !hasTypedRef.current && value) {
      setIsClearing(false);
      setIsSearching(false);
      setSearchValue("");
      hasTypedRef.current = false;
    } else if (isSearching && hasTypedRef.current && !searchValue && value) {
      // User typed something then cleared it, restore original
      setIsClearing(false);
      setIsSearching(false);
      setSearchValue("");
      hasTypedRef.current = false;
    }
  };

  // Handle input focus/click: clear input display to allow free typing/searching
  // Note: We don't clear the actual value prop - that only changes when user selects from dropdown
  // This keeps the selected item's details visible until a new selection is made
  const handleFocus = () => {
    // Don't open dropdown if Tab navigation is in progress
    // This prevents the current dropdown from reopening when Tab moves focus to next entity
    if (isTabNavigatingRef.current) {
      return;
    }

    // If there's a selected value, clear the input display to allow user to search
    if (value) {
      // Set clearing flag to hide selected item display in input (but keep value prop unchanged)
      setIsClearing(true);
      // Set searching flag to prevent Combobox from clearing the value
      setIsSearching(true);
      // Clear search value to start fresh
      setSearchValue("");
      // Reset typed flag since we're starting fresh
      hasTypedRef.current = false;
      // Select all text in the input to make replacement easier (for manual focus, not Tab navigation)
      // Use setTimeout to ensure the input is focused first
      setTimeout(() => {
        if (inputRef.current && !isTabNavigatingRef.current) {
          inputRef.current.select();
        }
      }, 0);
      // Open dropdown to show available options (only if not already open)
      // Note: Tab navigation will explicitly open via ref.open(), so this handles click/focus cases
      if (onOpenChange && !open) {
        onOpenChange(true);
      }
    }
  };

  // Handle click to ensure clearing works even when input already has focus
  const handleClick = () => {
    // If there's a selected value, clear the input display to allow user to search
    if (value) {
      // Set clearing flag to hide selected item display in input (but keep value prop unchanged)
      setIsClearing(true);
      // Set searching flag to prevent Combobox from clearing the value
      setIsSearching(true);
      // Clear search value to start fresh
      setSearchValue("");
      // Reset typed flag since we're starting fresh
      hasTypedRef.current = false;
      // Select all text in the input to make replacement easier
      // Use setTimeout to ensure the input is focused first
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.select();
        }
      }, 0);
      // Open dropdown to show available options
      if (onOpenChange && !open) {
        onOpenChange(true);
      }
    }
    // Allow default click behavior (focus, etc.)
  };

  // Handle blur: restore original value if user didn't select anything
  const handleBlur = () => {
    // Don't restore if Tab navigation is in progress (will be handled by focus on next field)
    if (isTabNavigatingRef.current) {
      return;
    }
    // Restore original value if user didn't select anything
    restoreOriginalValue();
  };

  // Display value: show search value when searching, otherwise show selected item display field
  // Don't show selected item if we're in the process of clearing
  const displayValue = React.useMemo(() => {
    // If user has typed something, always show the search value
    if (searchValue) {
      return searchValue;
    }
    // If we're clearing (and searchValue is empty), don't show the selected item
    // This ensures the input appears empty when clicked, ready for typing
    if (isClearing && !searchValue) {
      return "";
    }
    // If not clearing and item is selected, show the selected item's display value
    if (selectedItem) {
      const displayValue = selectedItem[config.displayField];
      return displayValue != null ? String(displayValue) : "";
    }
    return "";
  }, [searchValue, selectedItem, config.displayField, isClearing]);

  // Ensure open is always a boolean for controlled mode
  const controlledOpen = open !== undefined ? open : undefined;

  // Use placeholder from config if not provided
  const finalPlaceholder = placeholder ?? config.placeholder;

  // Handle Tab/Shift+Tab navigation and Enter to open dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Escape key: restore original value and close dropdown
    if (e.key === "Escape") {
      if (isClearing || isSearching) {
        e.preventDefault();
        e.stopPropagation();
        restoreOriginalValue();
        if (onOpenChange) {
          onOpenChange(false);
        }
        // Blur the input to remove focus
        inputRef.current?.blur();
      }
      return;
    }

    // Handle Enter key: open dropdown if not already open
    // Only intercept Enter when dropdown is closed to allow Combobox to handle selection when open
    // Skip handling Enter when Command/Meta key is pressed to allow Command+Enter print shortcut
    if (e.key === "Enter" && open === false && !e.metaKey) {
      e.preventDefault();
      if (onOpenChange) {
        onOpenChange(true);
      }
      return;
    }

    // Only intercept Tab if onTabNavigation is provided
    if (onTabNavigation && e.key === "Tab") {
      // Set flag BEFORE navigation to prevent handleFocus from opening dropdown
      // This prevents the current dropdown from reopening when Tab moves focus away
      isTabNavigatingRef.current = true;
      // Restore original value before navigating away if nothing was selected
      restoreOriginalValue();
      if (e.shiftKey) {
        // Shift+Tab: navigate to previous entity
        e.preventDefault();
        onTabNavigation("prev");
      } else {
        // Tab: navigate to next entity (cyclic)
        e.preventDefault();
        onTabNavigation("next");
      }
      // Reset flag after navigation completes
      // Use setTimeout to ensure it happens after focus events
      setTimeout(() => {
        isTabNavigatingRef.current = false;
      }, 0);
    }
    // Allow other keys to work normally (including default Tab behavior if handler not provided)
  };

  // Handle dropdown close: restore original value if no selection was made
  const handleOpenChange = (newOpen: boolean) => {
    // When dropdown closes, check if we need to restore the original value
    if (!newOpen && (isClearing || isSearching)) {
      // Only restore if user didn't type anything or typed then cleared it
      if (!hasTypedRef.current || (!searchValue && hasTypedRef.current)) {
        restoreOriginalValue();
      }
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Combobox
      value={value ?? null}
      open={controlledOpen}
      onOpenChange={handleOpenChange}
      onValueChange={(newValue: string | null) => {
        handleValueChange(newValue);
      }}
      disabled={disabled}
    >
      <ComboboxInput
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current =
              node;
          }
        }}
        value={displayValue}
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          // Handle input event for immediate typing detection
          const newValue = (e.currentTarget as HTMLInputElement).value;
          setSearchValue(newValue);
          // Set searching flag to prevent Combobox from clearing the value while typing
          setIsSearching(true);
          // Reset clearing flag when user starts typing
          setIsClearing(false);
          // Mark that user has typed something
          hasTypedRef.current = true;
          if (onSearchChange) {
            onSearchChange(newValue);
          }
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          setSearchValue(newValue);
          // Set searching flag to prevent Combobox from clearing the value while typing
          setIsSearching(true);
          // Reset clearing flag when user starts typing
          setIsClearing(false);
          // Mark that user has typed something
          hasTypedRef.current = true;
          if (onSearchChange) {
            onSearchChange(newValue);
          }
        }}
        onFocus={handleFocus}
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={finalPlaceholder}
        showTrigger={true}
        showClear={!!searchValue}
        className={cn("w-full", className)}
        aria-label={ariaLabel}
      />
      <ComboboxContent
        className="!w-auto min-w-[calc(100vw-2rem)] sm:min-w-[calc(100vw-3rem)] md:min-w-[600px] max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-[800px]"
        sideOffset={4}
        align="start"
      >
        <ComboboxList className="overflow-x-auto">
          {isLoading ? (
            <ComboboxEmpty>Loading...</ComboboxEmpty>
          ) : filteredItems.length === 0 ? (
            <ComboboxEmpty>{config.emptyMessage}</ComboboxEmpty>
          ) : (
            filteredItems.map((item, index) => {
              const itemValue = String(item[config.valueField]);
              const isSelected = value === itemValue;
              // Use unique identifier for key (prefer 'id' field if available, otherwise use valueField + index)
              const uniqueKey = (item as any).id
                ? String((item as any).id)
                : `${itemValue}-${index}`;

              return (
                <ComboboxItem
                  key={uniqueKey}
                  value={itemValue}
                  className={cn(
                    "py-2.5 px-2 min-h-12",
                    isSelected && "bg-accent",
                  )}
                >
                  <div className="flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4 flex-nowrap min-w-max">
                    {config.fields.map((fieldConfig, fieldIndex) => {
                      const fieldValue = item[fieldConfig.field];
                      const displayValue =
                        fieldValue != null ? String(fieldValue) : "";

                      return (
                        <div
                          key={fieldIndex}
                          className="flex items-center gap-1 sm:gap-1.5 shrink-0"
                          style={{
                            minWidth: fieldConfig.minWidth
                              ? `clamp(80px, ${fieldConfig.minWidth}, ${fieldConfig.minWidth})`
                              : "auto",
                          }}
                        >
                          <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                            {fieldConfig.label}
                          </span>
                          <span className="text-[10px] sm:text-xs text-foreground font-medium whitespace-nowrap">
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ComboboxItem>
              );
            })
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

// Use forwardRef - TypeScript will infer types correctly
export const EntitySelect = forwardRef(EntitySelectInner) as <
  T extends Record<string, any>,
>(
  props: EntitySelectProps<T> & { ref?: React.Ref<HTMLInputElement> },
) => React.ReactElement;

// Set displayName for React DevTools
(EntitySelect as any).displayName = "EntitySelect";
