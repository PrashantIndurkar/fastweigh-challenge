// import { Printer01Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import type { WeightSummaryData } from "../../types";
import { HugeiconsIcon } from "@hugeicons/react";
import { PrinterIcon } from "@hugeicons/core-free-icons";

interface WeightSummaryProps {
  data: WeightSummaryData;
  onPrintTicket?: () => void;
}

/**
 * Weight summary component displaying scale status, weight calculations, and pricing
 * Located at the bottom of the dashboard card
 */
export function WeightSummary({ data, onPrintTicket }: WeightSummaryProps) {
  // Determine scale status badge styling based on status
  const getScaleStatusStyles = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    if (normalizedStatus === "STABLE") {
      return "bg-green-50 text-green-700 border-green-200";
    } else if (normalizedStatus === "READING") {
      return "bg-orange-50 text-orange-600 border-orange-200";
    }
    // Default fallback for other states (could be red for unstable)
    return "bg-red-50 text-red-600 border-red-200";
  };

  return (
    <div className="px-6 py-4">
      <Separator className="mb-4" />

      <div className="flex items-center justify-between gap-6">
        {/* Left side: Scale status and weight breakdown */}
        <div className="flex-1 space-y-4">
          {/* Scale status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Scale:
            </span>
            <Badge
              variant="outline"
              className={`rounded-none border px-2.5 py-0.5 text-xs font-semibold uppercase ${getScaleStatusStyles(
                data.scaleStatus,
              )}`}
            >
              {data.scaleStatus}
            </Badge>
          </div>

          {/* Weight breakdown: LBS and TONS side by side */}
          <div className="flex items-center gap-6">
            {/* Weight in LBS */}
            <div className="flex-1">
              <div className="text-xs text-muted-foreground uppercase mb-2 text-center font-semibold">
                LBS
              </div>
              <div className="flex items-center justify-center gap-2.5 text-xs">
                <span className="text-muted-foreground uppercase">GROSS</span>
                <span className="text-foreground font-semibold text-sm">
                  {data.weightLbs.gross.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-base font-medium">
                  -
                </span>
                <span className="text-muted-foreground uppercase">TARE</span>
                <span className="text-foreground font-semibold text-sm">
                  {data.weightLbs.tare.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-base font-medium">
                  =
                </span>
                <span className="text-muted-foreground uppercase">NET</span>
                <span className="text-green-600 font-semibold text-sm">
                  {data.weightLbs.net.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Vertical separator */}
            <Separator orientation="vertical" className="h-8" />

            {/* Weight in TONS */}
            <div className="flex-1">
              <div className="text-xs text-muted-foreground uppercase mb-2 text-center font-semibold">
                TONS
              </div>
              <div className="flex items-center justify-center gap-2.5 text-xs">
                <span className="text-muted-foreground uppercase">GROSS</span>
                <span className="text-foreground font-semibold text-sm">
                  {data.weightTons.gross.toFixed(2)}
                </span>
                <span className="text-muted-foreground text-base font-medium">
                  -
                </span>
                <span className="text-muted-foreground uppercase">TARE</span>
                <span className="text-foreground font-semibold text-sm">
                  {data.weightTons.tare.toFixed(2)}
                </span>
                <span className="text-muted-foreground text-base font-medium">
                  =
                </span>
                <span className="text-muted-foreground uppercase">NET</span>
                <span className="text-green-600 font-semibold text-sm">
                  {data.weightTons.net.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Pricing and print button - aligned with weight values */}
        <div className="flex flex-col items-end justify-center gap-2">
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">
              @ ${data.pricePerTon.toFixed(2)}/ton
            </div>
            <div className="text-2xl font-bold text-primary">
              ${data.totalPrice.toFixed(2)}
            </div>
          </div>
          <Button
            type="button"
            onClick={onPrintTicket}
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Print ticket"
          >
            <HugeiconsIcon
              icon={PrinterIcon}
              size={16}
              color="currentColor"
              aria-hidden="true"
            />
            <span>Print Ticket</span>
            <span className="text-sm ml-2 opacity-70">⌘ ⏎</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
