export interface EntityDetail {
  key: string;
  value: string;
  highlight?: boolean;
}

export interface EntityData {
  label: string;
  value: string;
  details: EntityDetail[];
}

export interface RecentActivityItem {
  id: string;
  code: string;
  description: string;
  value: string;
}

export interface WeightSummaryData {
  scaleStatus: string;
  weightLbs: {
    gross: number;
    tare: number;
    net: number;
  };
  weightTons: {
    gross: number;
    tare: number;
    net: number;
  };
  pricePerTon: number;
  totalPrice: number;
}
