"use client";

import { PRODUCT_CATEGORIES } from "@/data/recipes";
import { ProductCard } from "./ProductCard";
import { useCalculatorStore } from "@/store/useCalculatorStore";

export function ProductSelector() {
  const totalItems = useCalculatorStore((s) =>
    s.selections.reduce((sum, sel) => sum + sel.quantity, 0)
  );
  const resetSelections = useCalculatorStore((s) => s.resetSelections);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);

  return (
    <div className="space-y-8 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            ¿Qué vas a preparar? 🔥
          </h2>
          <p className="text-sm text-white/40 mt-1">
            {totalItems > 0
              ? `${totalItems} producto${totalItems === 1 ? "" : "s"} seleccionado${totalItems === 1 ? "" : "s"}`
              : "Elige la cantidad de cada producto"}
          </p>
        </div>
        {totalItems > 0 && (
          <button
            onClick={resetSelections}
            className="rounded-xl border border-[#E91E8C]/30 bg-[#E91E8C]/10 px-4 py-2 text-xs font-bold text-[#FF6EB9] transition-all hover:bg-[#E91E8C]/20 active:scale-95"
          >
            Limpiar ✕
          </button>
        )}
      </div>

      {/* Product Categories */}
      {PRODUCT_CATEGORIES.map((cat, catIdx) => (
        <div key={cat.type} className="animate-slide-up" style={{ animationDelay: `${catIdx * 80}ms` }}>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-white/30">
            <span className="text-base">{cat.emoji}</span>
            {cat.label}s
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {cat.variants.map((v) => (
              <ProductCard
                key={`${cat.type}_${v.key}`}
                product={cat.type}
                variant={v.key}
                variantLabel={v.label}
                categoryLabel={cat.label}
                emoji={cat.emoji}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Floating Action Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-slide-up">
          <button
            onClick={() => setActiveTab("resultados")}
            className="pulse-ring relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#E91E8C] to-[#FF6EB9] px-8 py-4 text-base font-bold text-white fab-glow transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Ver Ingredientes</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-sm font-black">
              {totalItems}
            </span>
            <svg className="h-5 w-5 ml-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
