import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
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
}

/**
 * Recent activity sidebar component
 * Features accessible list structure with header and scrollable list
 * This is a standalone card component, detached from the dashboard
 * Matches minimalist design with clean spacing and modern UI
 */
export function RecentActivity({
  items,
  activeItemId,
  onItemClick,
  onClear,
}: RecentActivityProps) {
  const hasItems = items.length > 0;

  return (
    <Card className="w-64 h-fit max-h-[calc(100vh-8rem)] flex flex-col shadow-sm bg-card border-border">
      {/* Header */}
      <CardHeader>
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
        </div>
      </CardHeader>

      <Separator className="bg-border" />

      {/* Scrollable list */}
      {hasItems && (
        <div className="flex-1 overflow-y-auto">
          <nav aria-label="Recent activity">
            <ul className="space-y-0">
              {items.map((item) => (
                <RecentActivityItem
                  key={item.id}
                  item={item}
                  isActive={item.id === activeItemId}
                  onClick={() => onItemClick?.(item.id)}
                />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </Card>
  );
}
