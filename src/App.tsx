import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Header } from "./components/Layout";
import {
  RecentActivity,
  type RecentActivityRef,
} from "./components/RecentActivity";
import {
  EntitySection,
  type EntitySectionRef,
} from "./components/EntitySection";
import { WeightSummary } from "./components/WeightSummary";
import { HotkeysModal } from "./components/HotkeysModal";
import { Card } from "./components/ui/card";
import { Kbd } from "./components/ui/kbd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import type {
  EntityData,
  RecentActivityItem,
  WeightSummaryData,
} from "./types";
import { useTruckDetail } from "@/lib/hooks/useTrucks";
import { useScale } from "@/lib/hooks/useScale";
import { useEntityTabNavigation } from "@/lib/hooks/useEntityTabNavigation";
import { mapTruckDetailToEntityDetails } from "@/lib/utils/truckUtils";
import { mapCustomerToEntityDetails } from "@/lib/utils/customerUtils";
import { mapOrderToEntityDetails } from "@/lib/utils/orderUtils";
import { mapProductToEntityDetails } from "@/lib/utils/productUtils";
import {
  calculateNetLbs,
  poundsToTons,
  parsePricePerTon,
  calculateTotalPrice,
  parseTareWeight,
} from "@/lib/utils/weightUtils";
import { customers } from "@/lib/data/customers";
import { orders } from "@/lib/data/orders";
import { products } from "@/lib/data/products";
import type { NavigationDirection } from "@/lib/hooks/useEntityTabNavigation";
import {
  loadRecentItems,
  saveRecentItem,
  clearRecentItems,
} from "@/lib/utils/recentUtils";
import { useToast } from "@/components/ui/use-toast";

// Mock data for entity sections
const mockEntities: EntityData[] = [
  {
    label: "TRUCK",
    value: "TRK-1058",
    details: [
      { key: "LICENSE", value: "AL-4438-WP" },
      { key: "DRIVER", value: "Jim Miller" },
      { key: "TYPE", value: "Transfer" },
      { key: "CARRIER", value: "Owner Operator" },
      { key: "TARE", value: "29.3k" },
      { key: "LOADS", value: "11" },
    ],
  },
  {
    label: "CUSTOMER",
    value: "Red Builders",
    details: [
      { key: "ID", value: "CUST-1028" },
      { key: "LOCATION", value: "Charlotte, VA" },
      { key: "STATUS", value: "Active", highlight: true },
      { key: "TERMS", value: "Net 15" },
      { key: "CREDIT", value: "$50k" },
      { key: "YTD", value: "19.9kT" },
    ],
  },
  {
    label: "ORDER",
    value: "ORD-10023",
    details: [
      { key: "PO", value: "PO-59055" },
      { key: "PROJECT", value: "Park Pavilion Build" },
      { key: "TYPE", value: "Industrial" },
      { key: "SITE", value: "1134 Commerce Ave" },
      { key: "REM", value: "480T" },
    ],
  },
  {
    label: "PRODUCT",
    value: "Limestone #4",
    details: [
      { key: "DOT", value: "AASHTO #4" },
      { key: "CATEGORY", value: "Aggregate" },
      { key: "STOCKPILE", value: "Pit B" },
      { key: "PRICE", value: "$22.50/T" },
      { key: "STOCK", value: "9,500T" },
      { key: "TAX", value: "Government" },
    ],
  },
];

// Load recent items from localStorage on module load (will be updated on mount)
const initialRecentItems = loadRecentItems();

function App() {
  const [activeEntityLabel, setActiveEntityLabel] = useState<string | null>(
    null,
  );
  const [openEntityLabel, setOpenEntityLabel] = useState<string | null>(null);
  const [recentActivityItems, setRecentActivityItems] =
    useState<RecentActivityItem[]>(initialRecentItems);
  const [isRecentSidebarOpen, setIsRecentSidebarOpen] = useState(false);
  const [isHotkeysOpen, setIsHotkeysOpen] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const entityRefs = useRef<Record<string, EntitySectionRef | null>>({});
  const desktopRecentRef = useRef<RecentActivityRef>(null);
  const mobileRecentRef = useRef<RecentActivityRef>(null);
  const { getTargetEntity } = useEntityTabNavigation();
  const { toast } = useToast();

  // Fetch truck details when a truck is selected
  const {
    data: truckDetail,
    isLoading: isTruckDetailLoading,
    error: truckDetailError,
  } = useTruckDetail(selectedTruckId);

  // Parse truck tare weight to pounds (for use in scale hook)
  const truckTareLbs = useMemo(() => {
    if (truckDetail?.tare) {
      return parseTareWeight(truckDetail.tare);
    }
    return null;
  }, [truckDetail]);

  // Get live scale readings (pass truck tare weight so scale uses it)
  const { grossLbs, tareLbs, scaleStatus, triggerReading } =
    useScale(truckTareLbs);

  // Load recent items from localStorage on mount
  useEffect(() => {
    const loadedItems = loadRecentItems();
    setRecentActivityItems(loadedItems);
  }, []);

  const handleStepClick = (entityLabel: string) => {
    const ref = entityRefs.current[entityLabel];
    if (ref) {
      ref.focus();
      ref.open();
    }
  };

  // Keyboard shortcuts for focusing entity inputs
  useHotkeys("meta+k", () => handleStepClick("TRUCK"), {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys("meta+j", () => handleStepClick("CUSTOMER"), {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys("meta+o", () => handleStepClick("ORDER"), {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys("meta+p", () => handleStepClick("PRODUCT"), {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys("meta+shift+k", () => handleClearRecentActivity(), {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys(
    "meta+u",
    () => {
      // Helper function to focus the appropriate Recent panel instance
      const focusRecentPanel = () => {
        // Check if we're on a large screen (desktop) - desktop panel is always visible
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        if (isDesktop) {
          // On desktop, focus the desktop instance
          desktopRecentRef.current?.focus();
        } else {
          // On mobile/tablet, focus the mobile sidebar instance
          mobileRecentRef.current?.focus();
        }
      };

      // Open the sidebar on mobile/tablet if it's closed
      const needsToOpen = !isRecentSidebarOpen;
      if (needsToOpen) {
        setIsRecentSidebarOpen(true);
      }

      // Focus the first item - use appropriate delay based on whether panel needs to open
      const focusDelay = needsToOpen ? 350 : 0;

      setTimeout(() => {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            focusRecentPanel();
          });
        });
      }, focusDelay);
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    },
  );
  useHotkeys(
    "meta+slash",
    () => {
      console.log("Command + / pressed");
      handleHotkeysClick();
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
  );
  useHotkeys(
    "meta+enter",
    () => {
      handlePrintTicket();
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    },
  );

  // Function to close all dropdowns
  const closeAllDropdowns = useCallback(() => {
    setOpenEntityLabel(null);
    // Also close via refs as backup
    Object.values(entityRefs.current).forEach((ref) => {
      if (ref) ref.close?.();
    });
  }, []);

  const handleEntityFocus = (entityLabel: string) => {
    setActiveEntityLabel(entityLabel);
    setOpenEntityLabel(entityLabel); // Open this dropdown
  };

  const handleEntityOpenChange = (entityLabel: string, open: boolean) => {
    if (open) {
      // Close all other dropdowns when opening a new one
      setOpenEntityLabel(entityLabel);
    } else {
      // Only close if this is the currently open dropdown
      if (openEntityLabel === entityLabel) {
        setOpenEntityLabel(null);
      }
    }
  };

  // Handle custom Tab navigation between entity fields
  const handleEntityTabNavigation = (
    currentEntityLabel: string,
    direction: NavigationDirection,
  ) => {
    // Close current dropdown before navigating
    if (openEntityLabel === currentEntityLabel) {
      setOpenEntityLabel(null);
    }
    const targetEntity = getTargetEntity(
      currentEntityLabel as "TRUCK" | "CUSTOMER" | "ORDER" | "PRODUCT",
      direction,
    );
    const ref = entityRefs.current[targetEntity];
    if (ref) {
      // Focus and open the dropdown for the next entity (cyclic navigation)
      ref.focus();
      ref.open();
    }
  };

  const handleEntityChange = (label: string, value: string | null) => {
    if (value) {
      console.log(`Entity ${label} changed to ${value}`);
      // Update selected IDs when entities are selected
      if (label === "TRUCK") {
        setSelectedTruckId(value);
      } else if (label === "CUSTOMER") {
        setSelectedCustomerId(value);
      } else if (label === "ORDER") {
        setSelectedOrderId(value);
      } else if (label === "PRODUCT") {
        setSelectedProductId(value);
      }
    } else {
      // Clear selections when cleared
      if (label === "TRUCK") {
        setSelectedTruckId(null);
      } else if (label === "CUSTOMER") {
        setSelectedCustomerId(null);
      } else if (label === "ORDER") {
        setSelectedOrderId(null);
      } else if (label === "PRODUCT") {
        setSelectedProductId(null);
      }
    }
  };

  // Calculate net weight in pounds (never negative)
  const netLbs = useMemo(
    () => calculateNetLbs(grossLbs, tareLbs),
    [grossLbs, tareLbs],
  );

  // Convert weights to tons (rounded to 2 decimal places)
  const grossTons = useMemo(() => poundsToTons(grossLbs), [grossLbs]);
  const tareTons = useMemo(() => poundsToTons(tareLbs), [tareLbs]);
  const netTons = useMemo(() => poundsToTons(netLbs), [netLbs]);

  // Get selected product and extract price per ton
  const selectedProduct = useMemo(
    () => products.find((p) => p.name === selectedProductId),
    [selectedProductId],
  );
  const pricePerTon = useMemo(
    () => (selectedProduct ? parsePricePerTon(selectedProduct.price) : 0),
    [selectedProduct],
  );

  // Calculate total price
  const totalPrice = useMemo(
    () => calculateTotalPrice(netTons, pricePerTon),
    [netTons, pricePerTon],
  );

  // Build weight summary data object
  const weightSummaryData = useMemo<WeightSummaryData>(
    () => ({
      scaleStatus,
      weightLbs: { gross: grossLbs, tare: tareLbs, net: netLbs },
      weightTons: { gross: grossTons, tare: tareTons, net: netTons },
      pricePerTon,
      totalPrice,
    }),
    [
      scaleStatus,
      grossLbs,
      tareLbs,
      netLbs,
      grossTons,
      tareTons,
      netTons,
      pricePerTon,
      totalPrice,
    ],
  );

  // Print validation: check all required conditions
  const isPrintEnabled = useMemo(() => {
    return (
      scaleStatus === "STABLE" &&
      netLbs > 0 &&
      !!selectedTruckId &&
      !!selectedCustomerId &&
      !!selectedOrderId &&
      !!selectedProductId
    );
  }, [
    scaleStatus,
    netLbs,
    selectedTruckId,
    selectedCustomerId,
    selectedOrderId,
    selectedProductId,
  ]);

  // Build entities array with dynamic data for all entities
  const entities = useMemo<EntityData[]>(() => {
    return mockEntities.map((entity) => {
      // For TRUCK entity, use data from React Query hook
      if (entity.label === "TRUCK") {
        if (isTruckDetailLoading) {
          return {
            ...entity,
            value: selectedTruckId || "",
            details: [
              { key: "LICENSE", value: "Loading..." },
              { key: "DRIVER", value: "Loading..." },
              { key: "TYPE", value: "Loading..." },
              { key: "CARRIER", value: "Loading..." },
              { key: "TARE", value: "Loading..." },
              { key: "LOADS", value: "Loading..." },
            ],
          };
        }

        if (truckDetailError) {
          return {
            ...entity,
            value: selectedTruckId || "",
            details: [
              { key: "LICENSE", value: "Error loading data" },
              { key: "DRIVER", value: "-" },
              { key: "TYPE", value: "-" },
              { key: "CARRIER", value: "-" },
              { key: "TARE", value: "-" },
              { key: "LOADS", value: "-" },
            ],
          };
        }

        if (truckDetail) {
          return {
            ...entity,
            value: selectedTruckId || "",
            details: mapTruckDetailToEntityDetails(truckDetail),
          };
        }

        // No truck selected yet - show all fields with "-"
        return {
          ...entity,
          value: "",
          details: [
            { key: "LICENSE", value: "-" },
            { key: "DRIVER", value: "-" },
            { key: "TYPE", value: "-" },
            { key: "CARRIER", value: "-" },
            { key: "TARE", value: "-" },
            { key: "LOADS", value: "-" },
          ],
        };
      }

      // For CUSTOMER entity, use data from static array
      if (entity.label === "CUSTOMER") {
        if (selectedCustomerId) {
          const customer = customers.find((c) => c.name === selectedCustomerId);
          if (customer) {
            return {
              ...entity,
              value: selectedCustomerId,
              details: mapCustomerToEntityDetails(customer),
            };
          }
        }

        // No customer selected yet - show all fields with "-"
        return {
          ...entity,
          value: "",
          details: [
            { key: "ID", value: "-" },
            { key: "LOCATION", value: "-" },
            { key: "STATUS", value: "-" },
            { key: "TERMS", value: "-" },
            { key: "CREDIT", value: "-" },
          ],
        };
      }

      // For ORDER entity, use data from static array
      if (entity.label === "ORDER") {
        if (selectedOrderId) {
          const order = orders.find((o) => o.order === selectedOrderId);
          if (order) {
            return {
              ...entity,
              value: selectedOrderId,
              details: mapOrderToEntityDetails(order),
            };
          }
        }

        // No order selected yet - show all fields with "-"
        return {
          ...entity,
          value: "",
          details: [
            { key: "PO", value: "-" },
            { key: "PROJECT", value: "-" },
            { key: "CUSTOMER", value: "-" },
            { key: "JOB SITE", value: "-" },
            { key: "REMAINING", value: "-" },
          ],
        };
      }

      // For PRODUCT entity, use data from static array
      if (entity.label === "PRODUCT") {
        if (selectedProductId) {
          const product = products.find((p) => p.name === selectedProductId);
          if (product) {
            return {
              ...entity,
              value: selectedProductId,
              details: mapProductToEntityDetails(product),
            };
          }
        }

        // No product selected yet - show all fields with "-"
        return {
          ...entity,
          value: "",
          details: [
            { key: "DOT", value: "-" },
            { key: "CATEGORY", value: "-" },
            { key: "STOCKPILE", value: "-" },
            { key: "PRICE", value: "-" },
          ],
        };
      }

      // Fallback for any other entities
      return entity;
    });
  }, [
    selectedTruckId,
    truckDetail,
    isTruckDetailLoading,
    truckDetailError,
    selectedCustomerId,
    selectedOrderId,
    selectedProductId,
  ]);

  const handleRecentItemClick = (itemId: string) => {
    console.log(`Recent item clicked: ${itemId}`);

    // Find the clicked recent item
    const recentItem = recentActivityItems.find((item) => item.id === itemId);

    if (!recentItem) {
      console.warn(`Recent item not found: ${itemId}`);
      return;
    }

    // Apply the selected item: only update Truck and Customer from recent item
    // Keep Order and Product selections unchanged (don't clear them)
    setSelectedTruckId(recentItem.truckId);
    setSelectedCustomerId(recentItem.customerId);
    // Note: Order and Product are intentionally NOT cleared - they remain as selected

    // Close the sidebar on mobile/tablet after selection
    setIsRecentSidebarOpen(false);

    // Truck data will auto-fetch via existing useTruckDetail(selectedTruckId) hook
    // Customer data will auto-load via existing customers.find() logic in entities useMemo
    // UI will automatically update via existing reactive logic
  };

  const handleClearRecentActivity = () => {
    clearRecentItems();
    setRecentActivityItems([]);
    toast({
      variant: "success",
      title: "Recent activity cleared",
      description: "All recent transactions have been removed",
    });
  };

  // Validate print conditions and return specific error message if validation fails
  const validatePrintConditions = ():
    | { isValid: true }
    | { isValid: false; error: string } => {
    // Check scale status first (most critical)
    if (scaleStatus !== "STABLE") {
      return {
        isValid: false,
        error: "Scale is unstable - wait for STABLE status before printing",
      };
    }

    // Check net weight
    if (netLbs <= 0) {
      return {
        isValid: false,
        error:
          "Net weight is zero - ensure gross weight is greater than tare weight",
      };
    }

    // Check required entity selections (in order of workflow)
    if (!selectedTruckId) {
      return {
        isValid: false,
        error: "Truck must be selected",
      };
    }

    if (!selectedCustomerId) {
      return {
        isValid: false,
        error: "Customer must be selected",
      };
    }

    if (!selectedOrderId) {
      return {
        isValid: false,
        error: "Order must be selected",
      };
    }

    if (!selectedProductId) {
      return {
        isValid: false,
        error: "Product must be selected",
      };
    }

    // All conditions met
    return { isValid: true };
  };

  const handlePrintTicket = () => {
    console.log("Print ticket clicked");

    // Validate before proceeding with specific error messages
    const validation = validatePrintConditions();
    if (!validation.isValid) {
      console.warn("Print validation failed:", validation.error);
      toast({
        variant: "destructive",
        title: "Cannot print ticket",
        description: validation.error,
      });
      return;
    }

    // Only save to Recent if transaction is complete (truckId and customerId are present)
    if (selectedTruckId && selectedCustomerId) {
      // Get netWeight from calculated state (in pounds)
      const netWeight = netLbs;

      // Save to localStorage
      saveRecentItem(selectedTruckId, selectedCustomerId, netWeight);

      // Reload recent items to update UI
      const updatedItems = loadRecentItems();
      setRecentActivityItems(updatedItems);

      toast({
        variant: "success",
        title: "Ticket printed",
        description: "Transaction saved to recent activity",
      });

      // Trigger a new scale reading to simulate starting a new weighing
      triggerReading();
    } else {
      console.warn("Cannot save recent item: truckId or customerId is missing");
      toast({
        variant: "destructive",
        title: "Cannot save transaction",
        description: "Truck and customer must be selected",
      });
    }
  };

  const handleHotkeysClick = () => {
    setIsHotkeysOpen(true);
  };

  const handleRecentToggle = () => {
    setIsRecentSidebarOpen((prev) => !prev);
  };

  const handleCloseRecentSidebar = () => {
    setIsRecentSidebarOpen(false);
  };

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Close dropdowns first (if any are open)
        if (openEntityLabel) {
          closeAllDropdowns();
          e.preventDefault();
          e.stopPropagation();
        } else if (isRecentSidebarOpen) {
          // Only close sidebar if no dropdowns are open
          setIsRecentSidebarOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isRecentSidebarOpen, openEntityLabel, closeAllDropdowns]);

  // Fallback keyboard listener for Command + / (in case react-hotkeys-hook doesn't catch it)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command (Mac) or Ctrl (Windows/Linux) + /
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "/" || e.key === "?") &&
        !e.shiftKey
      ) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Fallback: Command + / detected");
        setIsHotkeysOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background relative">
      {/* Top header - separate, full width */}
      <Header
        onHotkeysClick={handleHotkeysClick}
        onRecentToggle={handleRecentToggle}
        isRecentOpen={isRecentSidebarOpen}
      />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-12 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-stretch">
            {/* Center: Dashboard Card */}
            <Card className="shadow-sm pb-2 min-w-0 overflow-hidden">
              {/* Entity sections with integrated step icons */}
              <div>
                {entities.map((entity, index) => (
                  <EntitySection
                    key={entity.label}
                    ref={(ref) => {
                      entityRefs.current[entity.label] = ref;
                    }}
                    data={entity}
                    isActive={activeEntityLabel === entity.label}
                    isOpen={openEntityLabel === entity.label}
                    onOpenChange={(open) =>
                      handleEntityOpenChange(entity.label, open)
                    }
                    onValueChange={(value) =>
                      handleEntityChange(entity.label, value)
                    }
                    onFocus={() => handleEntityFocus(entity.label)}
                    onStepClick={() => handleStepClick(entity.label)}
                    onTabNavigation={(direction) =>
                      handleEntityTabNavigation(entity.label, direction)
                    }
                    showStepConnector={index < entities.length - 1}
                    showSeparator={index < entities.length - 1}
                  />
                ))}
              </div>

              {/* Keyboard navigation hint */}
              <div
                className="px-4 md:px-6 py-2 md:py-3 bg-muted/30 border-t border-b border-border"
                role="region"
                aria-label="Keyboard shortcuts information"
              >
                <div className="flex items-center gap-1.5 md:gap-3 text-[10px] md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Search01Icon}
                        size={14}
                        color="currentColor"
                        strokeWidth={1.5}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      <span>Search</span>
                    </span>
                    <span
                      className="text-muted-foreground/60"
                      aria-hidden="true"
                    >
                      •
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Kbd>Tab</Kbd>
                      <span>next</span>
                    </span>
                    <span
                      className="text-muted-foreground/60"
                      aria-hidden="true"
                    >
                      •
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Kbd>Enter</Kbd>
                      <span>select</span>
                    </span>
                    <span
                      className="text-muted-foreground/60"
                      aria-hidden="true"
                    >
                      •
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Kbd>Esc</Kbd>
                      <span>close</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Weight summary */}
              <WeightSummary
                data={weightSummaryData}
                onPrintTicket={handlePrintTicket}
                isPrintDisabled={!isPrintEnabled}
                hasTruckSelected={!!selectedTruckId}
              />
            </Card>

            {/* Right: Recent Activity Card - detached - only visible on large screens */}
            <div className="hidden lg:block min-w-[256px] w-64">
              <RecentActivity
                ref={desktopRecentRef}
                items={recentActivityItems}
                activeItemId="1"
                onItemClick={handleRecentItemClick}
                onClear={handleClearRecentActivity}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar overlay and backdrop - only visible on small/medium screens */}
      {isRecentSidebarOpen && (
        <>
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={handleCloseRecentSidebar}
            aria-hidden="true"
          />
          {/* Sidebar sliding from right */}
          <div
            className={`
              fixed top-0 right-0 h-full w-64 min-w-[256px] bg-card border-l border-border shadow-lg z-50 lg:hidden
              transform transition-transform duration-300 ease-in-out
              ${isRecentSidebarOpen ? "translate-x-0" : "translate-x-full"}
            `}
          >
            <RecentActivity
              ref={mobileRecentRef}
              items={recentActivityItems}
              activeItemId="1"
              onItemClick={handleRecentItemClick}
              onClear={handleClearRecentActivity}
              onClose={handleCloseRecentSidebar}
              showCloseButton={true}
            />
          </div>
        </>
      )}

      {/* Hotkeys Modal */}
      <HotkeysModal open={isHotkeysOpen} onOpenChange={setIsHotkeysOpen} />
    </div>
  );
}

export default App;
