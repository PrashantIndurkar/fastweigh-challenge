import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  Sun01Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "@/lib/utils";

/**
 * Theme toggle component that allows users to switch between system, light, and dark modes
 * Displays current theme icon and provides dropdown menu for theme selection
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return Sun01Icon;
      case "dark":
        return Moon02Icon;
      case "system":
      default:
        return ComputerIcon;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className={cn(
          "bg-muted text-muted-foreground hover:bg-muted/80 border border-border rounded-md px-3 py-2 font-normal",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1",
          "inline-flex items-center justify-center whitespace-nowrap transition-all",
          "disabled:pointer-events-none disabled:opacity-50 outline-none",
          "text-xs font-medium h-7 gap-1",
        )}
        aria-label="Toggle theme"
      >
        <HugeiconsIcon
          icon={getThemeIcon()}
          size={18}
          color="currentColor"
          strokeWidth={2}
          className="text-foreground"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (value === "system" || value === "light" || value === "dark") {
              setTheme(value);
            }
          }}
        >
          <DropdownMenuRadioItem value="system">
            <HugeiconsIcon
              icon={ComputerIcon}
              size={16}
              color="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>System</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <HugeiconsIcon
              icon={Sun01Icon}
              size={16}
              color="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <HugeiconsIcon
              icon={Moon02Icon}
              size={16}
              color="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>Dark</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
