import type { Customer } from "@/types";

/**
 * Mock customer data matching the UI design pattern
 * Each customer contains detailed information displayed in the dropdown
 * Reduced to 10 items for optimal performance
 */
export const customers: Customer[] = [
  {
    name: "Rock Trucking",
    id: "CUST-1000",
    location: "Louisville, GA",
    status: "COD Only",
    terms: "COD",
    credit: "-",
  },
  {
    name: "Red Excavating",
    id: "CUST-1001",
    location: "Nashville, IN",
    status: "Active",
    terms: "COD",
    credit: "$57k",
  },
  {
    name: "Cedar Enterprises",
    id: "CUST-1002",
    location: "Knoxville, FL",
    status: "On Hold",
    terms: "Net 45",
    credit: "$56k",
  },
  {
    name: "Lake LLC",
    id: "CUST-1003",
    location: "Louisville, OH",
    status: "Active",
    terms: "Due on Receipt",
    credit: "$62k",
  },
  {
    name: "Hill Solutions",
    id: "CUST-1004",
    location: "Louisville, IN",
    status: "Active",
    terms: "Due on Receipt",
    credit: "$85k",
  },
  {
    name: "Quick Gravel",
    id: "CUST-1005",
    location: "Atlanta, VA",
    status: "Active",
    terms: "Due on Receipt",
    credit: "$38k",
  },
  {
    name: "Summit Gravel",
    id: "CUST-1006",
    location: "Lexington, SC",
    status: "Active",
    terms: "Net 15",
    credit: "$26k",
  },
  {
    name: "Blue Builders",
    id: "CUST-1007",
    location: "Charlotte, NC",
    status: "Active",
    terms: "Net 30",
    credit: "$72k",
  },
  {
    name: "Green Excavating",
    id: "CUST-1008",
    location: "Raleigh, NC",
    status: "COD Only",
    terms: "COD",
    credit: "-",
  },
  {
    name: "Mountain Corp",
    id: "CUST-1009",
    location: "Asheville, NC",
    status: "Active",
    terms: "Net 15",
    credit: "$45k",
  },
];
