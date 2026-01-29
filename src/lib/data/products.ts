import type { Product } from "@/types";

/**
 * Mock product data matching the UI design pattern
 * Each product contains detailed information displayed in the dropdown
 * Reduced to 10 items for optimal performance
 */
export const products: Product[] = [
  {
    name: "Limestone #57",
    id: "PROD-0001",
    dot: "AASHTO #57",
    category: "Aggregate",
    stockpile: "Yard 2",
    price: "$19.12/T",
  },
  {
    name: "Limestone #67",
    id: "PROD-0002",
    dot: "AASHTO #67",
    category: "Aggregate",
    stockpile: "Quarry North",
    price: "$12.25/T",
  },
  {
    name: "Limestone #8",
    id: "PROD-0003",
    dot: "AASHTO #8",
    category: "Aggregate",
    stockpile: "Pit A",
    price: "$21.78/T",
  },
  {
    name: "Limestone #4",
    id: "PROD-0004",
    dot: "AASHTO #4",
    category: "Aggregate",
    stockpile: "Quarry South",
    price: "$15.05/T",
  },
  {
    name: "Gravel #57",
    id: "PROD-0005",
    dot: "AASHTO #57",
    category: "Aggregate",
    stockpile: "Pit B",
    price: "$8.20/T",
  },
  {
    name: "Gravel #67",
    id: "PROD-0006",
    dot: "AASHTO #67",
    category: "Aggregate",
    stockpile: "Yard 1",
    price: "$9.45/T",
  },
  {
    name: "Crushed Stone #57",
    id: "PROD-0007",
    dot: "AASHTO #57",
    category: "Aggregate",
    stockpile: "Yard 3",
    price: "$18.50/T",
  },
  {
    name: "Limestone #10",
    id: "PROD-0008",
    dot: "AASHTO #10",
    category: "Aggregate",
    stockpile: "Quarry North",
    price: "$22.30/T",
  },
  {
    name: "Gravel #4",
    id: "PROD-0009",
    dot: "AASHTO #4",
    category: "Aggregate",
    stockpile: "Pit C",
    price: "$11.75/T",
  },
  {
    name: "Limestone #89",
    id: "PROD-0010",
    dot: "AASHTO #89",
    category: "Aggregate",
    stockpile: "Quarry South",
    price: "$16.80/T",
  },
];
