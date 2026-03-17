"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useCalculatorStore } from "@/store/useCalculatorStore";

export function useIngredientPrices() {
  const setPrice = useCalculatorStore((s) => s.setPrice);
  const prices = useCalculatorStore((s) => s.prices);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const { data, error } = await supabase
          .from("ingredientes")
          .select("id, name, unit, cost_per_unit");

        if (error) {
          console.error("Error loading prices:", error);
          return;
        }

        if (data) {
          data.forEach((ing: any) => {
            const unit = ing.unit === "units" ? "unit" : 
                        ing.unit === "kg" ? "kg" : 
                        ing.unit === "liters" ? "unit" : "kg";
            setPrice(ing.id, ing.cost_per_unit || 0, unit);
          });
        }
      } catch (error) {
        console.error("Error loading prices:", error);
      }
    };

    loadPrices();
  }, [setPrice]);

  return prices;
}
