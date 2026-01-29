import type { Customer, EntityDetail } from "@/types";

/**
 * Maps Customer to EntityDetail[] format for display in UI
 */
export function mapCustomerToEntityDetails(customer: Customer): EntityDetail[] {
  return [
    { key: "ID", value: customer.id },
    { key: "LOCATION", value: customer.location },
    { key: "STATUS", value: customer.status },
    { key: "TERMS", value: customer.terms },
    { key: "CREDIT", value: customer.credit },
  ];
}
