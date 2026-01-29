import type { TruckDetail, EntityDetail } from "@/types";

/**
 * Maps TruckDetail to EntityDetail[] format for display in UI
 * Includes LOADS field which is only available in detail view
 */
export function mapTruckDetailToEntityDetails(
  truck: TruckDetail,
): EntityDetail[] {
  return [
    { key: "LICENSE", value: truck.license },
    { key: "DRIVER", value: truck.driver },
    { key: "TYPE", value: truck.type },
    { key: "CARRIER", value: truck.carrier },
    { key: "TARE", value: truck.tare },
    { key: "LOADS", value: truck.loads },
  ];
}
