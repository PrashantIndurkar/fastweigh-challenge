import type { Product, EntityDetail } from "@/types";

/**
 * Maps Product to EntityDetail[] format for display in UI
 */
export function mapProductToEntityDetails(product: Product): EntityDetail[] {
  return [
    { key: "DOT", value: product.dot },
    { key: "CATEGORY", value: product.category },
    { key: "STOCKPILE", value: product.stockpile },
    { key: "PRICE", value: product.price },
  ];
}
