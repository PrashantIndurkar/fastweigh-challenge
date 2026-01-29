import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Card, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { RecentActivityItem } from "./RecentActivityItem";
import type { RecentActivityItem as RecentActivityItemType } from "../../types";

interface RecentActivityProps {
  items: RecentActivityItemType[];
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
  onClear?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export interface RecentActivityRef {
  focus: () => void;
  close: () => void;
}

/**
 * Recent activity sidebar component
 * Features accessible list structure with header and scrollable list
 * This is a standalone card component, detached from the dashboard
 * Matches minimalist design with clean spacing and modern UI
 * Supports keyboard navigation with arrow keys, Enter/Space to select, Escape to exit
 */
export const RecentActivity = forwardRef<
  RecentActivityRef,
  RecentActivityProps
>(function RecentActivity(
  {
    items,
    activeItemId,
    onItemClick,
    onClear,
    onClose,
    showCloseButton = false,
  },
  ref,
) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasItems = items.length > 0;

  // Expose focus and close methods to parent component
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (hasItems && items.length > 0) {
        setFocusedIndex(0);
        // Focus will be handled by useEffect after state update
      }
    },
    close: () => {
      setFocusedIndex(null);
      listRef.current?.blur();
      onClose?.();
    },
  }));

  // Focus the active item button when focusedIndex changes
  useEffect(() => {
    if (
      focusedIndex !== null &&
      focusedIndex >= 0 &&
      focusedIndex < items.length
    ) {
      // Use multiple requestAnimationFrame calls to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const itemButton = itemRefs.current[focusedIndex];
          if (itemButton) {
            // Focus the actual button element
            itemButton.focus();
          } else {
            // If button ref isn't ready, try multiple retry attempts
            let retryCount = 0;
            const maxRetries = 5;
            const retryDelay = 100;

            const tryFocus = () => {
              const retryButton = itemRefs.current[focusedIndex];
              if (retryButton) {
                retryButton.focus();
              } else if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(tryFocus, retryDelay);
              } else if (listRef.current) {
                // Final fallback to list container if button refs never become available
                listRef.current.focus();
              }
            };

            setTimeout(tryFocus, retryDelay);
          }
        });
      });
    }
  }, [focusedIndex, items.length]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex !== null && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  // Handle keyboard navigation - shared handler for both list and buttons
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!hasItems) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        setFocusedIndex((prev) => {
          if (prev === null) return 0;
          return prev < items.length - 1 ? prev + 1 : prev;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        setFocusedIndex((prev) => {
          if (prev === null) return items.length - 1;
          return prev > 0 ? prev - 1 : 0;
        });
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        e.stopPropagation();
        if (focusedIndex !== null && items[focusedIndex]) {
          onItemClick?.(items[focusedIndex].id);
          // Keep focus index to allow continued navigation from current position
        }
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        setFocusedIndex(null);
        listRef.current?.blur();
        onClose?.();
        break;
      default:
        break;
    }
  };

  // Reset focused index when items change
  useEffect(() => {
    if (focusedIndex !== null && focusedIndex >= items.length) {
      setFocusedIndex(items.length > 0 ? items.length - 1 : null);
    }
  }, [items.length, focusedIndex]);

  return (
    <Card className="w-full h-full shadow-sm bg-card border-border flex flex-col overflow-hidden">
      {/* Header */}
      <CardHeader className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={18}
              color="currentColor"
              strokeWidth={1.5}
              className="text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Recent
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {hasItems && onClear && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onClear}
                aria-label="Clear recent activity"
                className="text-muted-foreground hover:text-foreground h-auto py-0.5 px-2 text-xs font-normal hover:bg-transparent"
              >
                Clear
              </Button>
            )}
            {showCloseButton && onClose && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onClose}
                aria-label="Close recent activity"
                className="text-muted-foreground hover:text-foreground h-auto py-0.5 px-2 text-xs font-normal hover:bg-transparent"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator className="bg-border shrink-0" />

      {/* Scrollable list or empty state */}
      {hasItems ? (
        <div className="flex-1 overflow-y-auto min-h-0">
          <nav aria-label="Recent activity">
            <ul
              ref={listRef}
              role="listbox"
              aria-label="Recent activity items"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="space-y-0 focus:outline-none"
              aria-activedescendant={
                focusedIndex !== null && items[focusedIndex]
                  ? `recent-item-${items[focusedIndex].id}`
                  : undefined
              }
            >
              {items.map((item, index) => (
                <RecentActivityItem
                  key={item.id}
                  item={item}
                  itemId={`recent-item-${item.id}`}
                  isActive={item.id === activeItemId || focusedIndex === index}
                  onClick={() => {
                    onItemClick?.(item.id);
                    // Update focused index when clicking with mouse
                    setFocusedIndex(index);
                  }}
                  onKeyDown={handleKeyDown}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                />
              ))}
            </ul>
          </nav>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              No recent transactions
            </p>
            <p className="text-xs text-muted-foreground/70">
              Complete a transaction and print a ticket to see it here
            </p>
          </div>
        </div>
      )}
    </Card>
  );
});
