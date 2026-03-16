"use client";

import { useState, useMemo } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { RECIPES, INGREDIENTS } from "@/data/recipes";
import { RecipeIngredient } from "@/types";

export function RecipeEditor() {
  const overrides = useCalculatorStore((s) => s.recipeOverrides);
  const setRecipeOverride = useCalculatorStore((s) => s.setRecipeOverride);
  const clearRecipeOverrides = useCalculatorStore((s) => s.clearRecipeOverrides);
  const [selectedRecipe, setSelectedRecipe] = useState<string>(
    `${RECIPES[0].product}_${RECIPES[0].variant}`
  );

  const recipe = useMemo(() => {
    const [product, variant] = selectedRecipe.split("_");
    return RECIPES.find((r) => r.product === product && r.variant === variant);
  }, [selectedRecipe]);

  const currentIngredients: RecipeIngredient[] = useMemo(() => {
    if (!recipe) return [];
    return overrides[selectedRecipe] ?? recipe.ingredients;
  }, [recipe, overrides, selectedRecipe]);

  const getIngredientName = (id: string) => {
    return INGREDIENTS.find((i) => i.id === id)?.name ?? id;
  };

  const handleChange = (idx: number, field: "units" | "grams", val: number) => {
    const updated = [...currentIngredients];
    updated[idx] = { ...updated[idx], [field]: Math.max(0, val) };
    setRecipeOverride(selectedRecipe, updated);
  };

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Editar Recetas 📝
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Personaliza las porciones de cada ingrediente
          </p>
        </div>
        {hasOverrides && (
          <button
            onClick={clearRecipeOverrides}
            className="rounded-xl border border-[#E91E8C]/30 bg-[#E91E8C]/10 px-4 py-2 text-xs font-bold text-[#FF6EB9] transition-all hover:bg-[#E91E8C]/20 active:scale-95"
          >
            Restaurar ↺
          </button>
        )}
      </div>

      {/* Recipe Selector */}
      <select
        value={selectedRecipe}
        onChange={(e) => setSelectedRecipe(e.target.value)}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-white focus:border-[#E91E8C]/50 focus:ring-2 focus:ring-[#E91E8C]/20 focus:outline-none transition-all appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {RECIPES.map((r) => (
          <option
            key={`${r.product}_${r.variant}`}
            value={`${r.product}_${r.variant}`}
            className="bg-[#1A1A2E] text-white"
          >
            {r.product.charAt(0).toUpperCase() + r.product.slice(1)} — {r.variantLabel}
          </option>
        ))}
      </select>

      {/* Ingredient Editor */}
      {recipe && (
        <div className="glass-card-solid p-4">
          <div className="space-y-2">
            {currentIngredients.map((ing, idx) => {
              const isUnit = ing.units !== undefined && ing.units > 0;
              const isGrams = ing.grams !== undefined && ing.grams > 0;
              const isOverridden = overrides[selectedRecipe] !== undefined;

              return (
                <div
                  key={ing.id}
                  className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3 transition-colors hover:bg-white/5 animate-slide-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/70">
                      {getIngredientName(ing.id)}
                    </span>
                    {isOverridden && (
                      <span className="h-2 w-2 rounded-full bg-[#FFD600] animate-pulse" title="Modificado" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isUnit && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          value={ing.units ?? 0}
                          onChange={(e) =>
                            handleChange(idx, "units", parseInt(e.target.value) || 0)
                          }
                          className="h-9 w-16 rounded-lg bg-white/5 border border-white/10 text-center text-sm font-bold text-white focus:border-[#00C853]/50 focus:ring-1 focus:ring-[#00C853]/20 focus:outline-none transition-all"
                        />
                        <span className="text-xs font-bold text-[#69F0AE]">ud</span>
                      </div>
                    )}
                    {isGrams && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          value={ing.grams ?? 0}
                          onChange={(e) =>
                            handleChange(idx, "grams", parseInt(e.target.value) || 0)
                          }
                          className="h-9 w-16 rounded-lg bg-white/5 border border-white/10 text-center text-sm font-bold text-white focus:border-[#00C853]/50 focus:ring-1 focus:ring-[#00C853]/20 focus:outline-none transition-all"
                        />
                        <span className="text-xs font-bold text-[#69F0AE]">g</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
