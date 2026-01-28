import { useState, useRef } from "react";
import { Header } from "./components/Layout";
import { RecentActivity } from "./components/RecentActivity";
import {
  EntitySection,
  type EntitySectionRef,
} from "./components/EntitySection";
import { WeightSummary } from "./components/WeightSummary";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";
import type {
  EntityData,
  RecentActivityItem,
  WeightSummaryData,
} from "./types";

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

// Mock data for recent activity
const mockRecentActivity: RecentActivityItem[] = [
  {
    id: "1",
    code: "TRK-1058",
    description: "Red...",
    value: "39.6k",
  },
  {
    id: "2",
    code: "TRK-1057",
    description: "Stee...",
    value: "37.3k",
  },
  {
    id: "3",
    code: "TRK-1056",
    description: "Mid...",
    value: "35.5k",
  },
  {
    id: "4",
    code: "TRK-1055",
    description: "Blue...",
    value: "33.2k",
  },
  {
    id: "5",
    code: "TRK-1054",
    description: "Green...",
    value: "31.8k",
  },
];

// Mock data for weight summary
const mockWeightSummary: WeightSummaryData = {
  scaleStatus: "STABLE",
  weightLbs: {
    gross: 78000,
    tare: 29320,
    net: 48680,
  },
  weightTons: {
    gross: 39.0,
    tare: 14.66,
    net: 24.34,
  },
  pricePerTon: 22.5,
  totalPrice: 547.72,
};

function App() {
  const [activeEntityLabel, setActiveEntityLabel] = useState<string | null>(
    null,
  );
  const [recentActivityItems, setRecentActivityItems] =
    useState<RecentActivityItem[]>(mockRecentActivity);
  const entityRefs = useRef<Record<string, EntitySectionRef | null>>({});

  const handleStepClick = (entityLabel: string) => {
    const ref = entityRefs.current[entityLabel];
    if (ref) {
      ref.focus();
    }
  };

  const handleEntityFocus = (entityLabel: string) => {
    setActiveEntityLabel(entityLabel);
  };

  const handleEntityChange = (label: string, value: string | null) => {
    if (value) {
      console.log(`Entity ${label} changed to ${value}`);
    }
  };

  const handleRecentItemClick = (itemId: string) => {
    console.log(`Recent item clicked: ${itemId}`);
  };

  const handleClearRecentActivity = () => {
    setRecentActivityItems([]);
  };

  const handlePrintTicket = () => {
    console.log("Print ticket clicked");
  };

  const handleHotkeysClick = () => {
    console.log("Hotkeys clicked");
    // TODO: Implement hotkeys modal/dialog
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top header - separate, full width */}
      <Header onHotkeysClick={handleHotkeysClick} />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start gap-6">
            {/* Center: Dashboard Card */}
            <Card className="flex-1 shadow-sm">
              {/* Entity sections with integrated step icons */}
              <div>
                {mockEntities.map((entity, index) => (
                  <EntitySection
                    key={entity.label}
                    ref={(ref) => {
                      entityRefs.current[entity.label] = ref;
                    }}
                    data={entity}
                    isActive={activeEntityLabel === entity.label}
                    onValueChange={(value) =>
                      handleEntityChange(entity.label, value)
                    }
                    onFocus={() => handleEntityFocus(entity.label)}
                    onStepClick={() => handleStepClick(entity.label)}
                    showStepConnector={index < mockEntities.length - 1}
                    showSeparator={index < mockEntities.length - 1}
                  />
                ))}
              </div>

              {/* Keyboard navigation hint */}
              <div className="px-6 py-3 bg-muted/50">
                <Input
                  type="text"
                  placeholder="Search • Tab next • Enter select • Esc close"
                  className="bg-background border-border text-muted-foreground placeholder:text-muted-foreground"
                  readOnly
                />
              </div>

              {/* Weight summary */}
              <WeightSummary
                data={mockWeightSummary}
                onPrintTicket={handlePrintTicket}
              />
            </Card>

            {/* Right: Recent Activity Card - detached */}
            <RecentActivity
              items={recentActivityItems}
              activeItemId="1"
              onItemClick={handleRecentItemClick}
              onClear={handleClearRecentActivity}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
