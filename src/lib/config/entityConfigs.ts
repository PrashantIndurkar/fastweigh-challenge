import { trucks } from "@/lib/data/trucks";
import { customers } from "@/lib/data/customers";
import { orders } from "@/lib/data/orders";
import { products } from "@/lib/data/products";
import type {
  Truck,
  Customer,
  Order,
  Product,
  EntitySelectConfig,
} from "@/types";

type EntityConfigMap = {
  TRUCK: {
    items: Truck[];
    config: EntitySelectConfig<Truck>;
  };
  CUSTOMER: {
    items: Customer[];
    config: EntitySelectConfig<Customer>;
  };
  ORDER: {
    items: Order[];
    config: EntitySelectConfig<Order>;
  };
  PRODUCT: {
    items: Product[];
    config: EntitySelectConfig<Product>;
  };
};

export const entityConfigs: EntityConfigMap = {
  TRUCK: {
    items: trucks,
    config: {
      valueField: "id",
      displayField: "id",
      fields: [
        { label: "ID", field: "id", minWidth: "80px" },
        { label: "LICENSE", field: "license", minWidth: "120px" },
        { label: "DRIVER", field: "driver", minWidth: "120px" },
        { label: "TYPE", field: "type", minWidth: "90px" },
        { label: "CARRIER", field: "carrier", minWidth: "140px" },
        { label: "TARE", field: "tare", minWidth: "70px" },
      ],
      filterFields: ["id", "license", "driver", "type", "carrier", "tare"],
      placeholder: "Search truck...",
      emptyMessage: "No trucks found",
    },
  },
  CUSTOMER: {
    items: customers,
    config: {
      valueField: "name",
      displayField: "name",
      fields: [
        { label: "NAME", field: "name", minWidth: "140px" },
        { label: "ID", field: "id", minWidth: "100px" },
        { label: "LOCATION", field: "location", minWidth: "140px" },
        { label: "STATUS", field: "status", minWidth: "90px" },
        { label: "TERMS", field: "terms", minWidth: "110px" },
        { label: "CREDIT", field: "credit", minWidth: "80px" },
      ],
      filterFields: ["name", "id", "location", "status", "terms"],
      placeholder: "Search customer...",
      emptyMessage: "No customers found",
    },
  },
  ORDER: {
    items: orders,
    config: {
      valueField: "order",
      displayField: "order",
      fields: [
        { label: "ORDER", field: "order", minWidth: "100px" },
        { label: "PO", field: "po", minWidth: "100px" },
        { label: "PROJECT", field: "project", minWidth: "160px" },
        { label: "CUSTOMER", field: "customer", minWidth: "140px" },
        { label: "JOB SITE", field: "jobSite", minWidth: "140px" },
        { label: "REMAINING", field: "remaining", minWidth: "100px" },
      ],
      filterFields: ["order", "po", "project", "customer", "jobSite"],
      placeholder: "Search order...",
      emptyMessage: "No orders found",
    },
  },
  PRODUCT: {
    items: products,
    config: {
      valueField: "name",
      displayField: "name",
      fields: [
        { label: "PRODUCT", field: "name", minWidth: "140px" },
        { label: "ID", field: "id", minWidth: "100px" },
        { label: "DOT", field: "dot", minWidth: "120px" },
        { label: "CATEGORY", field: "category", minWidth: "100px" },
        { label: "STOCKPILE", field: "stockpile", minWidth: "120px" },
        { label: "PRICE", field: "price", minWidth: "90px" },
      ],
      filterFields: ["name", "id", "dot", "category", "stockpile"],
      placeholder: "Search product...",
      emptyMessage: "No products found",
    },
  },
};
