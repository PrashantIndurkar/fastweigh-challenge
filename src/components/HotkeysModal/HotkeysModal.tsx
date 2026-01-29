import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Separator } from "../ui/separator";

interface HotkeysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShortcutItem {
  keys: string;
  description: string;
}

interface ShortcutGroup {
  category: string;
  items: ShortcutItem[];
}

const shortcuts: ShortcutGroup[] = [
  {
    category: "Entity Navigation",
    items: [
      { keys: "⌘K", description: "Focus TRUCK" },
      { keys: "⌘J", description: "Focus CUSTOMER" },
      { keys: "⌘O", description: "Focus ORDER" },
      { keys: "⌘P", description: "Focus PRODUCT" },
    ],
  },
  {
    category: "Navigation",
    items: [
      { keys: "Tab", description: "Navigate to next entity" },
      { keys: "Shift+Tab", description: "Navigate to previous entity" },
    ],
  },
  {
    category: "Selection",
    items: [
      { keys: "Enter", description: "Select item or open dropdown" },
      { keys: "Esc", description: "Close dropdowns/sidebars" },
    ],
  },
  {
    category: "Actions",
    items: [{ keys: "⌘+Enter", description: "Print ticket" }],
  },
  {
    category: "Recent Activity",
    items: [
      { keys: "⌘U", description: "Focus recent activity sidebar" },
      { keys: "⌘⇧K", description: "Clear recent activity" },
    ],
  },
  {
    category: "Search",
    items: [
      { keys: "Type to search", description: "Search within entity selects" },
    ],
  },
  {
    category: "Help",
    items: [{ keys: "⌘/", description: "Open keyboard shortcuts" }],
  },
];

/**
 * Formats keyboard shortcut keys for display in Kbd components
 * Handles special keys like ⌘, ⇧, and multi-key combinations
 */
function formatKeys(keys: string): React.ReactNode {
  // Handle special text shortcuts that don't need Kbd formatting
  if (keys === "Type to search") {
    return <span className="text-muted-foreground italic">{keys}</span>;
  }

  // Split by + to handle multi-key combinations
  const parts = keys.split("+").map((part) => part.trim());

  if (parts.length === 1) {
    // Single key
    return <Kbd>{parts[0]}</Kbd>;
  }

  // Multiple keys - use KbdGroup
  return (
    <KbdGroup>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <Kbd>{part}</Kbd>
          {index < parts.length - 1 && (
            <span className="text-muted-foreground/60 mx-1">+</span>
          )}
        </React.Fragment>
      ))}
    </KbdGroup>
  );
}

/**
 * HotkeysModal component displays all keyboard shortcuts in the application
 * Follows the boxy design system with rounded-none borders and existing color scheme
 */
export function HotkeysModal({ open, onOpenChange }: HotkeysModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            All available keyboard shortcuts for navigating and using the
            application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {shortcuts.map((group, groupIndex) => (
            <div key={group.category}>
              {/* Category header */}
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {group.category}
              </h3>

              {/* Shortcut items */}
              <div className="space-y-2.5">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between gap-4 py-1.5 px-2 rounded-none hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs text-foreground flex-1">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {formatKeys(item.keys)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Separator between groups (except last) */}
              {groupIndex < shortcuts.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
