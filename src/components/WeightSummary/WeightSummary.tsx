import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import type { WeightSummaryData } from "../../types";
import { HugeiconsIcon } from "@hugeicons/react";
import { PrinterIcon } from "@hugeicons/core-free-icons";

interface WeightSummaryProps {
  data: WeightSummaryData;
  onPrintTicket?: () => void;
  isPrintDisabled?: boolean;
  hasTruckSelected?: boolean;
}

/**
 * Weight summary component displaying scale status, weight calculations, and pricing
 * Located at the bottom of the dashboard card
 */
export function WeightSummary({
  data,
  onPrintTicket,
  isPrintDisabled = false,
  hasTruckSelected = false,
}: WeightSummaryProps) {
  // Normalize scale status to ensure it's "STABLE" or "READING"
  const scaleStatus = (
    data.scaleStatus.toUpperCase() === "READING" ? "READING" : "STABLE"
  ) as "STABLE" | "READING";

  // Determine scale status badge styling based on status with dark mode support
  const getScaleStatusStyles = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    if (normalizedStatus === "STABLE") {
      // Dark mode: darker green background with lighter green text for better contrast
      return "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700";
    } else if (normalizedStatus === "READING") {
      // Dark mode: darker orange background with lighter orange text for better contrast
      return "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-700";
    }
    // Default fallback for other states (could be red for unstable)
    return "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700";
  };

  return (
    <div className="px-4 md:px-6 pt-3 md:pt-4 pb-3 md:pb-4">
      {/* Top row: Scale status (left) and Price info (right) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6 mb-4 md:mb-6">
        {/* Scale status - left side */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">
            Scale:
          </span>
          <Badge
            variant="outline"
            className={`rounded-none border px-2.5 py-0.5 text-xs font-semibold uppercase whitespace-nowrap ${getScaleStatusStyles(
              hasTruckSelected ? scaleStatus : "STABLE",
            )}`}
          >
            {hasTruckSelected ? scaleStatus : "-"}
          </Badge>
        </div>

        {/* Price info - right side */}
        <div className="text-left sm:text-right shrink-0 min-w-0">
          <div className="text-xs text-muted-foreground mb-1 whitespace-nowrap">
            {data.pricePerTon > 0 ? (
              `@ $${data.pricePerTon.toFixed(2)}/ton`
            ) : (
              <span className="text-muted-foreground">@ -/ton</span>
            )}
          </div>
          <div
            className={`text-xl sm:text-2xl lg:text-3xl font-bold whitespace-nowrap ${
              data.pricePerTon > 0
                ? data.totalPrice > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
            }`}
          >
            {data.pricePerTon > 0 ? (
              `$${data.totalPrice.toFixed(2)}`
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: LBS | TONS | Print button */}
      <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-4 xl:gap-6 w-full">
        {/* Weight in LBS - titles above, values below with proper alignment */}
        <div className="flex-1 w-full lg:w-auto min-w-0 max-w-full">
          <div className="flex flex-col items-center gap-2">
            {/* Titles row */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 text-xs text-muted-foreground uppercase font-semibold">
              <span className="min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px] text-right">
                GROSS
              </span>
              <span className="text-muted-foreground">-</span>
              <span className="min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px] text-left">
                TARE
              </span>
              <span className="text-muted-foreground mx-0.5 sm:mx-1">=</span>
              <span className="min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px] text-left">
                NET
              </span>
            </div>
            {/* Values row */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 text-xs sm:text-sm">
              <span className="text-foreground font-semibold min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px] text-right truncate">
                {hasTruckSelected ? data.weightLbs.gross.toLocaleString() : "-"}
              </span>
              <span className="text-muted-foreground">-</span>
              <span className="text-foreground font-semibold min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px] text-left truncate">
                {hasTruckSelected ? data.weightLbs.tare.toLocaleString() : "-"}
              </span>
              <span className="text-muted-foreground text-sm sm:text-base font-medium mx-0.5 sm:mx-1">
                =
              </span>
              <span className="text-green-600 font-semibold min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px] text-left truncate">
                {hasTruckSelected ? data.weightLbs.net.toLocaleString() : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal separator on mobile/tablet, vertical on large desktop */}
        <Separator orientation="horizontal" className="w-full lg:hidden my-2" />
        <Separator orientation="vertical" className="h-12 hidden lg:block" />

        {/* Weight in TONS - titles above, values below with proper alignment */}
        <div className="flex-1 w-full lg:w-auto min-w-0 max-w-full">
          <div className="flex flex-col items-center gap-2">
            {/* Titles row */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 text-xs text-muted-foreground uppercase font-semibold">
              <span className="min-w-[45px] sm:min-w-[50px] md:min-w-[55px] lg:min-w-[60px] text-right">
                GROSS
              </span>
              <span className="text-muted-foreground">-</span>
              <span className="min-w-[45px] sm:min-w-[50px] md:min-w-[55px] lg:min-w-[60px] text-left">
                TARE
              </span>
              <span className="text-muted-foreground mx-0.5 sm:mx-1">=</span>
              <span className="min-w-[45px] sm:min-w-[50px] md:min-w-[55px] lg:min-w-[60px] text-left">
                NET
              </span>
            </div>
            {/* Values row */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 text-xs sm:text-sm">
              <span className="text-foreground font-semibold min-w-[45px] sm:min-w-[50px] md:min-w-[55px] lg:min-w-[60px] text-right truncate">
                {hasTruckSelected ? data.weightTons.gross.toFixed(2) : "-"}
              </span>
              <span className="text-muted-foreground">-</span>
              <span className="text-foreground font-semibold min-w-[45px] sm:min-w-[50px] md:min-w-[55px] lg:min-w-[60px] text-left truncate">
                {hasTruckSelected ? data.weightTons.tare.toFixed(2) : "-"}
              </span>
              <span className="text-muted-foreground text-sm sm:text-base font-medium mx-0.5 sm:mx-1">
                =
              </span>
              <span className="text-green-600 font-semibold min-w-[45px] sm:min-w-[50px] md:min-w-[55px] lg:min-w-[60px] text-left truncate">
                {hasTruckSelected ? data.weightTons.net.toFixed(2) : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal separator before button on mobile/tablet */}
        <Separator orientation="horizontal" className="w-full lg:hidden my-2" />

        {/* Print button - full width on mobile/tablet, auto on large desktop */}
        <div className="w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
          <Button
            type="button"
            onClick={onPrintTicket}
            disabled={isPrintDisabled}
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 w-full lg:w-auto shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Print ticket"
          >
            <HugeiconsIcon
              icon={PrinterIcon}
              size={16}
              color="currentColor"
              aria-hidden="true"
            />
            <span>Print Ticket</span>
            <span className="text-sm ml-2 opacity-70 hidden sm:inline">
              ⌘ ⏎
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
