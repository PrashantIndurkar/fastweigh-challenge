import type { Truck } from "@/types";

/**
 * Mock truck data matching the UI design pattern
 * Each truck contains detailed information displayed in the dropdown
 * Reduced to 10 items for optimal performance
 */
export const trucks: Truck[] = [
  {
    id: "TRK-1000",
    license: "VA-2657-ZQ",
    driver: "Matt Moore",
    type: "Tri-Axle",
    carrier: "Stone Transport",
    tare: "34.2k",
  },
  {
    id: "TRK-1001",
    license: "NC-8923-XP",
    driver: "Sarah Johnson",
    type: "Transfer",
    carrier: "Coastal Hauling",
    tare: "29.3k",
  },
  {
    id: "TRK-1002",
    license: "SC-4456-MN",
    driver: "Robert Chen",
    type: "Tri-Axle",
    carrier: "Mountain Logistics",
    tare: "36.8k",
  },
  {
    id: "TRK-1003",
    license: "GA-7789-KL",
    driver: "Emily Davis",
    type: "Transfer",
    carrier: "Owner Operator",
    tare: "28.5k",
  },
  {
    id: "TRK-1004",
    license: "FL-1122-BC",
    driver: "Michael Brown",
    type: "Tri-Axle",
    carrier: "Sunshine Transport",
    tare: "35.1k",
  },
  {
    id: "TRK-1005",
    license: "TN-3344-DE",
    driver: "Jennifer Wilson",
    type: "Transfer",
    carrier: "River Valley Logistics",
    tare: "30.7k",
  },
  {
    id: "TRK-1006",
    license: "AL-5566-FG",
    driver: "David Martinez",
    type: "Tri-Axle",
    carrier: "Stone Transport",
    tare: "37.4k",
  },
  {
    id: "TRK-1007",
    license: "MS-7788-HI",
    driver: "Lisa Anderson",
    type: "Transfer",
    carrier: "Coastal Hauling",
    tare: "31.2k",
  },
  {
    id: "TRK-1008",
    license: "KY-9900-JK",
    driver: "James Taylor",
    type: "Tri-Axle",
    carrier: "Mountain Logistics",
    tare: "33.9k",
  },
  {
    id: "TRK-1009",
    license: "WV-2233-LM",
    driver: "Patricia White",
    type: "Transfer",
    carrier: "Owner Operator",
    tare: "29.8k",
  },
];
