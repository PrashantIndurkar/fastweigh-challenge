import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import {
  BubbleChatQuestionIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { ThemeToggle } from "../ThemeToggle";

interface HeaderProps {
  onHotkeysClick?: () => void;
  onRecentToggle?: () => void;
  isRecentOpen?: boolean;
}

/**
 * Top header component for the application
 * Features branding on the left and hotkeys info button on the right
 * This is a standalone top bar, not connected to the dashboard
 */
export function Header({
  onHotkeysClick,
  onRecentToggle,
  isRecentOpen = false,
}: HeaderProps) {
  return (
    <header className="w-full bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Left side: Branding */}
        <div className="flex items-center gap-2 md:gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-tight">
            FASTWEIGH
          </h1>
          <span className="text-sm md:text-base text-muted-foreground font-normal">
            Point of Sale
          </span>
        </div>

        {/* Right side: Theme toggle, Recent toggle (small screens), and Hotkeys info button */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <ThemeToggle />
          {/* Recent toggle button - only visible on small/medium screens */}
          {onRecentToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRecentToggle}
              className="lg:hidden bg-muted text-muted-foreground hover:bg-muted/80 border border-border rounded-md px-3 py-2 font-normal"
              aria-label={
                isRecentOpen ? "Hide recent activity" : "Show recent activity"
              }
              aria-expanded={isRecentOpen}
            >
              <HugeiconsIcon
                icon={Clock01Icon}
                size={18}
                color="currentColor"
                strokeWidth={2}
                className="text-foreground"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Recent</span>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onHotkeysClick}
            className="bg-muted text-muted-foreground hover:bg-muted/80 border border-border rounded-md px-3 py-2 font-normal"
            aria-label="View keyboard shortcuts"
          >
            <HugeiconsIcon
              icon={BubbleChatQuestionIcon}
              size={18}
              color="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>Hotkeys</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
