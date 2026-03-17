import { ProductCategory, ProductType, UnitType } from "./index";

export interface IngredienteDB {
  id: string;
  name: string;
  unit: UnitType;
  cost_per_unit: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductoDB {
  id: string;
  name: string;
  price: number;
  ingredients: { component_id: string; quantity: number }[];
  created_at?: string;
  updated_at?: string;
}

export interface SoldItem {
  product: ProductType;
  variant: string;
  quantity: number;
  unitPrice: number;
}

export interface EventoDB {
  id: string;
  name: string;
  event_date: string;
  location: string;
  sold_items: SoldItem[];
  fuel_cost: number;
  total_income: number;
  total_cost: number;
  net_profit: number;
  payment_status?: "pending" | "paid";
  created_at?: string;
}

export interface EventoInsert extends Omit<EventoDB, "id" | "created_at"> {}

export interface DeliveryInfo {
  distanceText: string;
  distanceValue: number; // in meters
  fuelCost: number;
  destination: string;
}

export interface DashboardMetric {
  date: string;
  income: number;
  cost: number;
  profit: number;
}
