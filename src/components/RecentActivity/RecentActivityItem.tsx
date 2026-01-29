import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Kbd } from "../ui/kbd";

interface RecentActivityItemProps {
  item: {
    id: string;
    code: string;
    description: string;
    value: string;
  };
  isActive?: boolean;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  itemId?: string; // For ARIA aria-activedescendant reference
}

/**
 * Individual recent activity item component
 * Displays code, truncated description, and value
 * Matches minimalist design with proper spacing and interactive states
 */
export const RecentActivityItem = forwardRef<
  HTMLButtonElement,
  RecentActivityItemProps
>(function RecentActivityItem(
  { item, isActive = false, onClick, onKeyDown, itemId },
  ref,
) {
  return (
    <li role="option" aria-selected={isActive ? "true" : "false"}>
      <button
        ref={ref}
        type="button"
        id={itemId}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={-1}
        className={cn(
          "w-full text-left px-3 py-2.5 rounded-none transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-inset",
          isActive ? "bg-muted/50" : "hover:bg-muted/30",
        )}
        aria-label={`Select ${item.code} - ${item.description}`}
        aria-current={isActive ? "true" : undefined}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Kbd className="text-xs font-semibold h-auto py-0.5 px-1.5 rounded-[3px] bg-muted text-muted-foreground border-0">
              {item.code}
            </Kbd>
            <span className="text-xs truncate leading-relaxed text-foreground">
              {item.description}
            </span>
          </div>
          <span className="font-semibold text-sm text-foreground shrink-0 tabular-nums">
            {item.value}
          </span>
        </div>
      </button>
    </li>
  );
});
