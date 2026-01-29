import type { Order } from "@/types";

/**
 * Mock order data matching the UI design pattern
 * Each order contains detailed information displayed in the dropdown
 * Reduced to 10 items for optimal performance
 */
export const orders: Order[] = [
  {
    order: "ORD-10000",
    po: "PO-64537",
    project: "Restaurant Pad Site",
    customer: "Coastal Corp",
    jobSite: "1899 Oak Ln",
    remaining: "984T",
  },
  {
    order: "ORD-10001",
    po: "PO-14661",
    project: "Church Parking Lot",
    customer: "Maple Gravel",
    jobSite: "5801 Oak Ave",
    remaining: "3,356T",
  },
  {
    order: "ORD-10002",
    po: "PO-41899",
    project: "Solar Farm Access",
    customer: "Forest Trucking",
    jobSite: "5980 Industrial Dr",
    remaining: "5,803T",
  },
  {
    order: "ORD-10003",
    po: "PO-58570",
    project: "Oak Street Bridge",
    customer: "Central Corp",
    jobSite: "7722 Industrial Ln",
    remaining: "8,787T",
  },
  {
    order: "ORD-10004",
    po: "PO-94389",
    project: "School Parking Lot",
    customer: "Delta Excavating",
    jobSite: "5319 Main Ln",
    remaining: "2,870T",
  },
  {
    order: "ORD-10005",
    po: "PO-27341",
    project: "Warehouse Foundation",
    customer: "Rock Trucking",
    jobSite: "4421 Commerce St",
    remaining: "1,245T",
  },
  {
    order: "ORD-10006",
    po: "PO-89256",
    project: "Hospital Driveway",
    customer: "Red Excavating",
    jobSite: "6678 Park Blvd",
    remaining: "4,521T",
  },
  {
    order: "ORD-10007",
    po: "PO-15678",
    project: "Apartment Complex Road",
    customer: "Cedar Enterprises",
    jobSite: "3345 Elm Ave",
    remaining: "6,234T",
  },
  {
    order: "ORD-10008",
    po: "PO-78923",
    project: "Shopping Center Pad",
    customer: "Lake LLC",
    jobSite: "8890 Pine Dr",
    remaining: "3,987T",
  },
  {
    order: "ORD-10009",
    po: "PO-45612",
    project: "Factory Loading Dock",
    customer: "Hill Solutions",
    jobSite: "2234 Maple St",
    remaining: "7,156T",
  },
];
