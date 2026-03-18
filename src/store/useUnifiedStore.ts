"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Item, Ingredient, ItemIngredient } from "@/types/items";

type Theme = "dark" | "light";

interface UnifiedStore {
  // Items (unified: products + recipes)
  items: Item[];
  ingredients: Ingredient[];
  
  // Theme
  theme: Theme;
  
  // UI State
  editingItem: Item | null;
  activeSection: string;
  activeSubsection: string;
  
  // Actions - Items
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  updateItem: (id: string, data: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  setEditingItem: (item: Item | null) => void;
  
  // Actions - Ingredients
  setIngredients: (ingredients: Ingredient[]) => void;
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (id: string, data: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  
  // Actions - Cascade Update (real-time)
  updateIngredientPrice: (ingredientId: string, newPrice: number) => void;
  recalculateAllCosts: () => void;
  
  // Actions - UI
  setActiveSection: (section: string) => void;
  setActiveSubsection: (subsection: string) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Helpers
  getItemsByType: (type: "product" | "recipe") => Item[];
  getRecipeCost: (item: Item) => number;
  getRecipeMargin: (item: Item) => number;
}

export const useUnifiedStore = create<UnifiedStore>()(
  persist(
    (set, get) => ({
      items: [],
      ingredients: [],
      theme: "dark",
      editingItem: null,
      activeSection: "suministros",
      activeSubsection: "ingredientes",

      // Items Actions
      setItems: (items) => set({ items }),
      
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      
      updateItem: (id, data) => set((state) => ({
        items: state.items.map(item => {
          if (item.id === id) {
            const updated = { ...item, ...data };
            // Recalcular costo si es receta
            if (updated.type === "recipe" && updated.ingredients.length > 0) {
              updated.cost = get().getRecipeCost(updated);
              updated.margin = updated.price > 0 
                ? ((updated.price - updated.cost) / updated.price * 100) 
                : 0;
            }
            return updated;
          }
          return item;
        })
      })),
      
      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      setEditingItem: (item) => set({ editingItem: item }),

      // Ingredients Actions
      setIngredients: (ingredients) => set({ ingredients }),
      
      addIngredient: (ingredient) => set((state) => ({
        ingredients: [...state.ingredients, ingredient]
      })),
      
      updateIngredient: (id, data) => set((state) => ({
        ingredients: state.ingredients.map(ing => 
          ing.id === id ? { ...ing, ...data } : ing
        )
      })),
      
      deleteIngredient: (id) => set((state) => ({
        ingredients: state.ingredients.filter(ing => ing.id !== id)
      })),

      // CASCADE UPDATE - Real-time recalculation
      updateIngredientPrice: (ingredientId, newPrice) => {
        const state = get();
        
        // 1. Update ingredient price
        const updatedIngredients = state.ingredients.map(ing => 
          ing.id === ingredientId || ing.base_id === ingredientId
            ? { ...ing, cost_per_unit: newPrice }
            : ing
        );
        
        // 2. Find all recipes that use this ingredient
        const affectedRecipeIds = state.items
          .filter(item => item.type === "recipe")
          .filter(item => 
            item.ingredients.some(ing => 
              ing.ingredient_id === ingredientId || ing.ingredient_id === state.ingredients.find(e => e.base_id === ingredientId)?.id
            )
          )
          .map(item => item.id);
        
        // 3. Recalculate costs for affected recipes
        const updatedItems = state.items.map(item => {
          if (item.type === "recipe" && affectedRecipeIds.includes(item.id)) {
            const newCost = get().getRecipeCost({
              ...item,
              ingredients: item.ingredients.map(ing => {
                const ingData = updatedIngredients.find(e => 
                  e.id === ing.ingredient_id || e.base_id === ing.ingredient_id
                );
                return ingData 
                  ? { ...ing, cost_per_unit: ingData.cost_per_unit }
                  : ing;
              })
            });
            return {
              ...item,
              cost: newCost,
              margin: item.price > 0 ? ((item.price - newCost) / item.price * 100) : 0
            };
          }
          return item;
        });
        
        set({
          ingredients: updatedIngredients,
          items: updatedItems
        });
      },
      
      recalculateAllCosts: () => {
        const state = get();
        const updatedItems = state.items.map(item => {
          if (item.type === "recipe" && item.ingredients.length > 0) {
            const newCost = get().getRecipeCost(item);
            return {
              ...item,
              cost: newCost,
              margin: item.price > 0 ? ((item.price - newCost) / item.price * 100) : 0
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      // UI Actions
      setActiveSection: (section) => set({ activeSection: section }),
      setActiveSubsection: (subsection) => set({ activeSubsection: subsection }),
      
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === "dark" ? "light" : "dark" 
      })),

      // Helpers
      getItemsByType: (type) => get().items.filter(item => item.type === type),
      
      getRecipeCost: (item) => {
        if (item.type !== "recipe" || !item.ingredients.length) return 0;
        
        const state = get();
        let totalCost = 0;
        
        for (const ing of item.ingredients) {
          const ingData = state.ingredients.find(e => 
            e.id === ing.ingredient_id || e.base_id === ing.ingredient_id
          );
          if (ingData) {
            totalCost += (ingData.cost_per_unit || 0) * ing.quantity;
          }
        }
        return totalCost;
      },
      
      getRecipeMargin: (item) => {
        if (item.price <= 0) return 0;
        const cost = get().getRecipeCost(item);
        return ((item.price - cost) / item.price * 100);
      }
    }),
    {
      name: "blamey-unified-storage",
      partialize: (state) => ({ 
        theme: state.theme,
        activeSection: state.activeSection,
        activeSubsection: state.activeSubsection,
      }),
    }
  )
);
