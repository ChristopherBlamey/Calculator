"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

interface InventoryState {
  stock: Record<string, number>;
  lastSynced: string | null;
  
  // Actions
  setStock: (ingredientId: string, amount: number) => void;
  decrementStock: (ingredientId: string, amount: number) => void;
  syncFromSupabase: () => Promise<void>;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      stock: {},
      lastSynced: null,

      setStock: (ingredientId, amount) =>
        set((state) => ({
          stock: { ...state.stock, [ingredientId]: Math.max(0, amount) },
        })),

      decrementStock: (ingredientId, amount) =>
        set((state) => {
          const current = state.stock[ingredientId] || 0;
          return {
            stock: { ...state.stock, [ingredientId]: Math.max(0, current - amount) },
          };
        }),
        
      syncFromSupabase: async () => {
        try {
          const { data, error } = await supabase.from('ingredientes').select('id, stock');
          if (error) throw error;
          
          if (data) {
            const newStock: Record<string, number> = {};
            data.forEach((item: any) => {
              newStock[item.id] = item.stock;
            });
            set({ stock: newStock, lastSynced: new Date().toISOString() });
          }
        } catch (error) {
          console.error("Error syncing inventory:", error);
        }
      }
    }),
    {
      name: "carrito-inventory-storage",
    }
  )
);
