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
  // Storage fields for restoring transaction
  truckId: string;
  customerId: string;
  netWeight: number; // Numeric value in pounds
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

export interface Truck {
  id: string;
  license: string;
  driver: string;
  type: string;
  carrier: string;
  tare: string;
}

// Lightweight truck data for search results (no loads field)
export interface TruckSearchResult {
  id: string;
  license: string;
  driver: string;
  type: string;
  carrier: string;
  tare: string;
}

// Full truck detail with loads field
export interface TruckDetail extends Truck {
  loads: string;
}

export interface Customer {
  name: string;
  id: string;
  location: string;
  status: string;
  terms: string;
  credit: string;
}

export interface Order {
  order: string;
  po: string;
  project: string;
  customer: string;
  jobSite: string;
  remaining: string;
}

export interface Product {
  name: string;
  id: string;
  dot: string;
  category: string;
  stockpile: string;
  price: string;
}

export interface EntityFieldConfig {
  label: string;
  field: string;
  minWidth?: string;
}

export interface EntitySelectConfig<T extends Record<string, any>> {
  valueField: keyof T;
  displayField: keyof T;
  fields: EntityFieldConfig[];
  filterFields: (keyof T)[];
  placeholder: string;
  emptyMessage: string;
}
