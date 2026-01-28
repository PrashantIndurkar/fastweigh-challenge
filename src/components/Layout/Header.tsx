import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import { BubbleChatQuestionIcon } from "@hugeicons/core-free-icons";

interface HeaderProps {
  onHotkeysClick?: () => void;
}

/**
 * Top header component for the application
 * Features branding on the left and hotkeys info button on the right
 * This is a standalone top bar, not connected to the dashboard
 */
export function Header({ onHotkeysClick }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side: Branding */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary uppercase tracking-tight">
            FASTWEIGH
          </h1>
          <span className="text-base text-muted-foreground font-normal">
            Point of Sale
          </span>
        </div>

        {/* Right side: Hotkeys info button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onHotkeysClick}
          className="bg-muted text-muted-foreground hover:bg-muted/80 border border-border rounded-md px-3 py-2 h-auto font-normal"
          aria-label="View keyboard shortcuts"
        >
          <HugeiconsIcon
            icon={BubbleChatQuestionIcon}
            size={16}
            color="currentColor"
            strokeWidth={1.5}
            className="text-muted-foreground"
            aria-hidden="true"
          />
          <span>Hotkeys</span>
        </Button>
      </div>
    </header>
  );
}
