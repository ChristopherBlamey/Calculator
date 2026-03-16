// ===== Ingredient Types =====
export type UnitType = "units" | "grams" | "kilograms";

export interface Ingredient {
  id: string;
  name: string;
  emoji?: string;
  defaultUnit: UnitType;
}

export interface RecipeIngredient {
  id: string;
  units?: number;
  grams?: number;
}

export interface Recipe {
  product: ProductType;
  variant: string;
  variantLabel: string;
  ingredients: RecipeIngredient[];
}

export interface ProductSelection {
  product: ProductType;
  variant: string;
  quantity: number;
}

export interface IngredientTotal {
  id: string;
  name: string;
  units: number;
  grams: number;
  displayValue: string;
  displayUnit: string;
}

export interface IngredientPrice {
  id: string;
  pricePerUnit: number; // price per unit or per kg
  unit: "unit" | "kg";
}

export type ProductType = "completo" | "hamburguesa" | "churrasco" | "as";

export interface ProductCategory {
  type: ProductType;
  label: string;
  emoji: string;
  variants: { key: string; label: string }[];
}
