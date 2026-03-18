// ===== Unified Item Types (Product or Recipe) =====

export type ItemType = "product" | "recipe";

export interface ItemIngredient {
  ingredient_id: string;
  ingredient_name?: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
}

export interface Item {
  id: string;
  user_id?: string;
  base_id?: string;
  name: string;
  type: ItemType; // 'product' = sin ingredientes, 'recipe' = con ingredientes
  price: number;
  cost: number; // Costo calculado automáticamente
  margin?: number; // Margen de ganancia
  ingredients: ItemIngredient[];
  category: string;
  variant: string;
  is_base: boolean;
  is_custom: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Ingredient {
  id: string;
  user_id?: string;
  base_id?: string;
  name: string;
  unit: string;
  cost_per_unit: number;
  stock?: number;
  is_base: boolean;
  is_custom: boolean;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Recipe {
  id: string;
  user_id?: string;
  base_id?: string;
  name: string;
  price: number;
  cost: number;
  margin: number;
  ingredients: ItemIngredient[];
  category: string;
  variant: string;
  is_base: boolean;
  is_custom: boolean;
}

// Tipos para sincronización en tiempo real
export interface PriceUpdate {
  ingredientId: string;
  newPrice: number;
  affectedRecipes: string[];
}
