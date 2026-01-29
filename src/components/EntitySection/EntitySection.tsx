import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Kbd } from "../ui/kbd";
import { Skeleton } from "../ui/skeleton";
import { EntitySelect } from "../EntitySelect";
import { entityConfigs } from "@/lib/config/entityConfigs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultiple02Icon,
  GoogleDocIcon,
  PackageIcon,
} from "@hugeicons/core-free-icons";
import { ContainerTruck01Icon } from "@hugeicons/core-free-icons";
import type { EntityData } from "../../types";
import { useTruckSearch } from "@/lib/hooks/useTrucks";
import type { NavigationDirection } from "@/lib/hooks/useEntityTabNavigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

export interface EntitySectionRef {
  focus: () => void;
  open: () => void;
  close: () => void;
}

interface EntitySectionProps {
  data: EntityData;
  isActive?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | null) => void;
  onFocus?: () => void;
  showSeparator?: boolean;
  onStepClick?: () => void;
  showStepConnector?: boolean;
  onTabNavigation?: (direction: NavigationDirection) => void;
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
      isOpen: controlledIsOpen = false,
      onOpenChange,
      onValueChange,
      onFocus,
      showSeparator = true,
      onStepClick,
      showStepConnector = false,
      onTabNavigation,
    },
    ref,
  ) => {
    const entitySelectRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Debounce search query to reduce API calls for truck search
    // 150ms delay provides fast response while still reducing unnecessary API requests
    const debouncedSearchQuery = useDebounce(searchQuery, 150);

    // Get entity config and items based on label
    const entityConfig =
      entityConfigs[data.label as keyof typeof entityConfigs];

    // Use truck search hook for TRUCK entity with debounced query
    const isTruck = data.label === "TRUCK";
    const { data: truckSearchResults, isLoading: isTruckSearchLoading } =
      useTruckSearch(debouncedSearchQuery);

    // Determine items to use: truck search results or static config items
    const items =
      isTruck && truckSearchResults
        ? truckSearchResults
        : entityConfig?.items || [];

    // Handle focus after dropdown opens - instant focus for crisp UX
    useEffect(() => {
      if (controlledIsOpen && entitySelectRef.current) {
        // Focus immediately without delay for instant response
        entitySelectRef.current.focus();
      }
    }, [controlledIsOpen]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        entitySelectRef.current?.focus();
      },
      open: () => {
        // Call onFocus first to set active state
        if (onFocus) {
          onFocus();
        }
        // Notify parent to open dropdown
        if (onOpenChange) {
          onOpenChange(true);
        }
        // Focus and click immediately for instant dropdown opening
        if (entitySelectRef.current) {
          entitySelectRef.current.focus();
          entitySelectRef.current.click();
        }
      },
      close: () => {
        // Notify parent to close dropdown
        if (onOpenChange) {
          onOpenChange(false);
        }
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
      <div className="py-3 px-4 md:py-5 md:px-6 relative">
        {/* Vertical connecting line - centered through icon */}
        {showStepConnector && (
          <div
            className="absolute top-1/2 left-8 md:left-11 -translate-x-1/2 bottom-0 w-px bg-border z-0 hidden md:block"
            aria-hidden="true"
          />
        )}
        <div className="flex items-start gap-3 md:gap-4">
          {/* Step icon container */}
          <div className="flex flex-col items-center shrink-0 relative z-10">
            <button
              type="button"
              onClick={onStepClick}
              className={`
                flex items-center justify-center
                w-8 h-8 md:w-10 md:h-10 rounded-full
                focus:outline-none
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
                size={20}
                color="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Main content: Label, Select, and Details */}
          <div className="flex-1 flex flex-col md:flex-row items-start gap-4 md:gap-6 w-full">
            {/* Left side: Label and Select - compact width */}
            <div className="w-full md:w-64 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={`entity-${data.label}`}
                  className="block text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {data.label}
                </label>
                {hotkey && <Kbd className="h-auto py-0.5">{hotkey}</Kbd>}
              </div>
              {entityConfig ? (
                <EntitySelect
                  ref={entitySelectRef}
                  items={items as any}
                  value={data.value}
                  config={entityConfig.config as any}
                  open={controlledIsOpen}
                  onOpenChange={(open) => {
                    if (onOpenChange) {
                      onOpenChange(open);
                    }
                    if (open && onFocus) {
                      onFocus();
                    }
                  }}
                  onValueChange={(value) => {
                    if (onValueChange) {
                      // Allow null values to pass through for clearing selections
                      onValueChange(value);
                    }
                  }}
                  onSearchChange={(query) => {
                    if (isTruck) {
                      setSearchQuery(query);
                    }
                  }}
                  onTabNavigation={onTabNavigation}
                  isLoading={isTruck && isTruckSearchLoading}
                  aria-label={`Select ${data.label}`}
                />
              ) : null}
            </div>

            {/* Right side: Details - takes remaining space */}
            {/* For lg/xl: 2 columns with first column having 3 items, second column having rest */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-3 gap-y-1.5 md:gap-y-2 min-w-0 w-full lg:grid-flow-row-dense">
              {data.details.map((detail, index) => {
                const isLoading = detail.value === "Loading...";
                const isError = detail.value === "Error loading data";
                const isEmpty = detail.value === "-";
                // For lg/xl screens: first 3 items go to column 1, rest to column 2
                // Using grid-column to control placement
                const columnClass =
                  index < 3 ? "lg:col-start-1" : "lg:col-start-2";

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 min-w-0 w-full ${columnClass}`}
                  >
                    <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase shrink-0 whitespace-nowrap">
                      {detail.key}:
                    </span>
                    {isLoading ? (
                      <Skeleton className="h-3 md:h-4 w-12 md:w-16" />
                    ) : detail.highlight ? (
                      <Badge
                        variant="secondary"
                        className="text-[10px] md:text-xs shrink-0"
                      >
                        {detail.value}
                      </Badge>
                    ) : (
                      <span
                        className={`text-[10px] md:text-xs sm:truncate ${
                          isError
                            ? "text-muted-foreground italic"
                            : isEmpty
                              ? "text-muted-foreground"
                              : "text-foreground"
                        }`}
                      >
                        {detail.value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Horizontal separator - stops before vertical line (icon width 40px + gap 16px = 56px) */}
        {showSeparator && (
          <div className="mt-5 ml-0 md:ml-[56px]">
            <Separator />
          </div>
        )}
      </div>
    );
  },
);

EntitySection.displayName = "EntitySection";
