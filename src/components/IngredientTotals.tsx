"use client";

import { useMemo } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { calculateTotals } from "@/lib/calculator";

export function IngredientTotals() {
  const selections = useCalculatorStore((s) => s.selections);
  const overrides = useCalculatorStore((s) => s.recipeOverrides);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);

  const totals = useMemo(
    () => calculateTotals(selections, overrides),
    [selections, overrides]
  );

  const totalItems = selections.reduce((sum, s) => sum + s.quantity, 0);

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-5 animate-bounce">📋</span>
        <h3 className="text-xl font-bold text-white">Sin productos seleccionados</h3>
        <p className="mt-2 text-sm text-white/40 max-w-xs">
          Vuelve a la pestaña de productos y elige lo que vas a preparar
        </p>
        <button
          onClick={() => setActiveTab("productos")}
          className="mt-6 rounded-xl bg-gradient-to-r from-[#00C853] to-[#69F0AE] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#00C853]/25 transition-all hover:scale-105 active:scale-95"
        >
          Ir a Productos →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Ingredientes Totales ✨
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Para {totalItems} producto{totalItems === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={() => setActiveTab("lista")}
          className="rounded-xl bg-gradient-to-r from-[#00C853] to-[#69F0AE] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#00C853]/20 transition-all hover:scale-105 active:scale-95"
        >
          🛒 Lista
        </button>
      </div>

      {/* Totals */}
      <div className="grid gap-2">
        {totals.map((t, idx) => (
          <div
            key={t.id}
            className="glass-card flex items-center justify-between px-5 py-3.5 transition-all duration-200 hover:bg-white/5 animate-slide-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className="text-sm font-medium text-white/70">{t.name}</span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white">
                {t.displayValue}
              </span>
              <span className="text-xs font-bold text-[#69F0AE]">
                {t.displayUnit}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
