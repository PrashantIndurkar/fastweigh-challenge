import { HugeiconsIcon } from "@hugeicons/react";
import { ContainerTruck01Icon } from "@hugeicons/core-free-icons";
import { Separator } from "../ui/separator";
import type { EntityData } from "../../types";

interface StepsProps {
  entities: EntityData[];
  activeEntityLabel: string | null;
  onStepClick: (entityLabel: string) => void;
}

/**
 * Vertical steps component displaying entity progression
 * Shows active step with black background and white icon
 * Inactive steps have white circles with black icons
 * Steps are clickable to navigate/focus corresponding inputs
 */
export function Steps({
  entities,
  activeEntityLabel,
  onStepClick,
}: StepsProps) {
  return (
    <div className="flex flex-col items-center">
      {entities.map((entity, index) => {
        const isActive = activeEntityLabel === entity.label;
        const isLast = index === entities.length - 1;

        return (
          <div
            key={entity.label}
            className="flex flex-col items-center w-full"
            style={{
              // Match EntitySection padding: py-5 = 20px top and bottom
              paddingTop: "20px",
              paddingBottom: "0px",
              // Match EntitySection height: approximately 99px per section (with separator)
              minHeight: isLast ? "auto" : "99px",
            }}
          >
            {/* Step icon - aligned with SelectTrigger center */}
            {/* EntitySection: py-5 (20px) + label row (~14px) + mb-2 (8px) + SelectTrigger center (h-8/2 = 16px from top of trigger) */}
            {/* Total from section top: 20px + 14px + 8px + 16px = 58px */}
            {/* Icon is h-10 (40px), center is 20px from top, so icon top should be at 58px - 20px = 38px */}
            {/* Since container has 20px paddingTop, add 18px marginTop */}
            <button
              type="button"
              onClick={() => onStepClick(entity.label)}
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                focus:outline-none
                ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-background border-2 border-border text-foreground hover:border-ring"
                }
              `}
              aria-label={`Navigate to ${entity.label} step`}
              aria-current={isActive ? "step" : undefined}
              style={{
                marginTop: "18px",
              }}
            >
              <HugeiconsIcon
                icon={ContainerTruck01Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>

            {/* Vertical connecting line using Separator */}
            {!isLast && (
              <div
                className="flex items-center justify-center w-full"
                style={{ height: "59px" }}
              >
                <Separator
                  orientation="vertical"
                  className="h-full bg-border"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
