import type { Order, EntityDetail } from "@/types";

/**
 * Maps Order to EntityDetail[] format for display in UI
 */
export function mapOrderToEntityDetails(order: Order): EntityDetail[] {
  return [
    { key: "PO", value: order.po },
    { key: "PROJECT", value: order.project },
    { key: "CUSTOMER", value: order.customer },
    { key: "JOB SITE", value: order.jobSite },
    { key: "REMAINING", value: order.remaining },
  ];
}
