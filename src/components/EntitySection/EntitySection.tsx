import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Kbd } from "../ui/kbd";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultiple02Icon,
  GoogleDocIcon,
  PackageIcon,
} from "@hugeicons/core-free-icons";
import { ContainerTruck01Icon } from "@hugeicons/core-free-icons";
import type { EntityData } from "../../types";

export interface EntitySectionRef {
  focus: () => void;
}

interface EntitySectionProps {
  data: EntityData;
  isActive?: boolean;
  onValueChange?: (value: string | null) => void;
  onFocus?: () => void;
  showSeparator?: boolean;
  onStepClick?: () => void;
  showStepConnector?: boolean;
}

/**
 * Entity section component for displaying form inputs with associated details
 * Each section represents a step in the transaction process (Truck, Customer, Order, Product)
 */
export const EntitySection = forwardRef<EntitySectionRef, EntitySectionProps>(
  (
    {
      data,
      isActive = false,
      onValueChange,
      onFocus,
      showSeparator = true,
      onStepClick,
      showStepConnector = false,
    },
    ref,
  ) => {
    const selectTriggerRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        selectTriggerRef.current?.focus();
      },
    }));

    // Map entity labels to keyboard shortcuts
    const hotkeyMap: Record<string, string> = {
      TRUCK: "⌘K",
      CUSTOMER: "⌘J",
      ORDER: "⌘O",
      PRODUCT: "⌘P",
    };

    // Map entity labels to icons
    const iconMap: Record<string, typeof ContainerTruck01Icon> = {
      TRUCK: ContainerTruck01Icon,
      CUSTOMER: UserMultiple02Icon,
      ORDER: GoogleDocIcon,
      PRODUCT: PackageIcon,
    };

    const hotkey = hotkeyMap[data.label] || "";
    const IconComponent = iconMap[data.label] || ContainerTruck01Icon;

    return (
      <div className="py-5 px-6 relative">
        {/* Vertical connecting line - centered through icon */}
        {showStepConnector && (
          <div
            className="absolute top-1/2 left-11 -translate-x-1/2 bottom-0 w-px bg-border z-0"
            aria-hidden="true"
          />
        )}
        <div className="flex items-start gap-4">
          {/* Step icon container */}
          <div className="flex flex-col items-center shrink-0 relative z-10">
            <button
              type="button"
              onClick={onStepClick}
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring
                relative z-10 bg-background
                ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-background border-2 border-border text-foreground hover:border-ring"
                }
              `}
              aria-label={`Navigate to ${data.label} step`}
              aria-current={isActive ? "step" : undefined}
            >
              <HugeiconsIcon
                icon={IconComponent}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Main content: Label, Select, and Details */}
          <div className="flex-1 flex items-start gap-6">
            {/* Left side: Label and Select - compact width */}
            <div className="w-64 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={`entity-${data.label}`}
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {data.label}
                </label>
                {hotkey && <Kbd className="h-auto py-0.5">{hotkey}</Kbd>}
              </div>
              <Select
                value={data.value}
                onValueChange={(value) => {
                  if (value && onValueChange) {
                    onValueChange(value);
                  }
                }}
                onOpenChange={(open) => {
                  if (open && onFocus) {
                    onFocus();
                  }
                }}
              >
                <SelectTrigger
                  ref={selectTriggerRef}
                  id={`entity-${data.label}`}
                  className={`w-full ${isActive ? "ring-2 ring-ring" : ""}`}
                  aria-label={`Select ${data.label}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <SelectValue placeholder={`Select ${data.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {/* Mock options - in real app, these would come from props */}
                  <SelectItem value={data.value}>{data.value}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right side: Details - takes remaining space */}
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
              {data.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    {detail.key}:
                  </span>
                  {detail.highlight ? (
                    <Badge variant="secondary" className="text-xs">
                      {detail.value}
                    </Badge>
                  ) : (
                    <span className="text-xs text-foreground">
                      {detail.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal separator - stops before vertical line (icon width 40px + gap 16px = 56px) */}
        {showSeparator && (
          <div className="mt-5 ml-[56px]">
            <Separator />
          </div>
        )}
      </div>
    );
  },
);

EntitySection.displayName = "EntitySection";
