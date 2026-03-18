"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductSelection, RecipeIngredient } from "@/types";

type RecipeOverrides = Record<string, RecipeIngredient[]>;
type PriceMap = Record<string, { price: number; perUnit: "unit" | "kg" }>;

interface CalculatorState {
  selections: ProductSelection[];
  recipeOverrides: RecipeOverrides;
  prices: PriceMap;
  activeTab: string;
  editingProduct: string | null;

  // Actions
  setQuantity: (product: string, variant: string, quantity: number) => void;
  resetSelections: () => void;
  setRecipeOverride: (key: string, ingredients: RecipeIngredient[]) => void;
  clearRecipeOverrides: () => void;
  setPrice: (ingredientId: string, price: number, perUnit: "unit" | "kg") => void;
  setActiveTab: (tab: string) => void;
  setEditingProduct: (productKey: string | null) => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      selections: [],
      recipeOverrides: {},
      prices: {
        "pan_completo": { price: 250, perUnit: "unit" },
        "vienesa": { price: 300, perUnit: "unit" },
        "palta": { price: 7500, perUnit: "kg" },
        "tomate": { price: 1800, perUnit: "kg" },
        "mayonesa": { price: 4500, perUnit: "kg" },
      },
      activeTab: "productos",
      editingProduct: null,

      setQuantity: (product, variant, quantity) =>
        set((state) => {
          const idx = state.selections.findIndex(
            (s) => s.product === product && s.variant === variant
          );
          const q = Math.max(0, quantity);
          if (idx >= 0) {
            const newSelections = [...state.selections];
            if (q === 0) {
              newSelections.splice(idx, 1);
            } else {
              newSelections[idx] = { ...newSelections[idx], quantity: q };
            }
            return { selections: newSelections };
          } else if (q > 0) {
            return {
              selections: [
                ...state.selections,
                { product: product as ProductSelection["product"], variant, quantity: q },
              ],
            };
          }
          return state;
        }),

      resetSelections: () => set({ selections: [] }),

      setRecipeOverride: (key, ingredients) =>
        set((state) => ({
          recipeOverrides: { ...state.recipeOverrides, [key]: ingredients },
        })),

      clearRecipeOverrides: () => set({ recipeOverrides: {} }),

      setPrice: (ingredientId, price, perUnit) =>
        set((state) => ({
          prices: { ...state.prices, [ingredientId]: { price, perUnit } },
        })),

      setActiveTab: (tab) => set({ activeTab: tab }),

      setEditingProduct: (productKey) => set({ editingProduct: productKey }),
    }),
    {
      name: "carrito-chileno-storage",
    }
  )
);
