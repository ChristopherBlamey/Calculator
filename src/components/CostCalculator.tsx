"use client";

import { useMemo } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { INGREDIENTS } from "@/data/recipes";
import { calculateTotals, calculateCosts } from "@/lib/calculator";

export function CostCalculator() {
  const selections = useCalculatorStore((s) => s.selections);
  const overrides = useCalculatorStore((s) => s.recipeOverrides);
  const prices = useCalculatorStore((s) => s.prices);
  const setPrice = useCalculatorStore((s) => s.setPrice);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);

  const totals = useMemo(
    () => calculateTotals(selections, overrides),
    [selections, overrides]
  );

  const costs = useMemo(
    () => calculateCosts(totals, prices),
    [totals, prices]
  );

  const totalCost = costs.reduce((sum, c) => sum + c.cost, 0);
  const totalItems = selections.reduce((sum, s) => sum + s.quantity, 0);

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-5">💰</span>
        <h3 className="text-xl font-bold text-white">Sin productos</h3>
        <p className="mt-2 text-sm text-white/40 max-w-xs">
          Selecciona productos y agrega precios para calcular costos
        </p>
        <button
          onClick={() => setActiveTab("productos")}
          className="mt-6 rounded-xl bg-gradient-to-r from-[#E91E8C] to-[#FF6EB9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#E91E8C]/25 transition-all hover:scale-105 active:scale-95"
        >
          Seleccionar Productos →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Estimación de Costos 💰
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Ingresa los precios de los ingredientes
        </p>
      </div>

      {/* Price Inputs */}
      <div className="glass-card-solid p-4">
        <div className="space-y-2">
          {totals.map((t, idx) => {
            const ingredient = INGREDIENTS.find((i) => i.id === t.id);
            const isUnitBased = t.units > 0 && t.grams === 0;
            const priceInfo = prices[t.id];
            const cost = costs.find((c) => c.ingredientId === t.id)?.cost ?? 0;

            return (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/3 px-4 py-3 transition-colors hover:bg-white/5 animate-slide-up"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white/70 truncate block">
                    {ingredient?.name ?? t.id}
                  </span>
                  <span className="text-xs text-white/30">
                    {t.displayValue} {t.displayUnit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FFD600]">$</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={priceInfo?.price ?? ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setPrice(t.id, val, isUnitBased ? "unit" : "kg");
                    }}
                    className="h-9 w-20 rounded-lg bg-white/5 border border-white/10 text-center text-sm font-bold text-white focus:border-[#FFD600]/50 focus:ring-1 focus:ring-[#FFD600]/20 focus:outline-none transition-all"
                  />
                  <span className="text-xs text-white/30 w-8">
                    /{isUnitBased ? "ud" : "kg"}
                  </span>
                  {cost > 0 && (
                    <span className="text-sm font-bold text-[#69F0AE] min-w-[65px] text-right">
                      ${cost.toLocaleString("es-CL", { maximumFractionDigits: 0 })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Cost */}
      {totalCost > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-[#00C853]/30 bg-gradient-to-br from-[#00C853]/10 to-[#69F0AE]/5 p-6 animate-slide-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C853]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white/60">Costo Total</p>
              <p className="text-xs text-white/30 mt-0.5">
                Para {totalItems} producto{totalItems === 1 ? "" : "s"}
              </p>
            </div>
            <p className="text-4xl font-black gradient-text-green">
              ${totalCost.toLocaleString("es-CL", { maximumFractionDigits: 0 })}
            </p>
          </div>
          {totalItems > 0 && (
            <div className="relative mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/40">Costo por producto</span>
              <span className="text-base font-bold text-white">
                ${(totalCost / totalItems).toLocaleString("es-CL", { maximumFractionDigits: 0 })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
