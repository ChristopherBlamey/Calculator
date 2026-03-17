"use client";

import { PRODUCT_CATEGORIES } from "@/data/recipes";
import { ProductCard } from "./ProductCard";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import { PartyPopper, CalendarCheck, AlertTriangle } from "lucide-react";
import { ProductType } from "@/types";
import { calculateTotals } from "@/lib/calculator";
import { INGREDIENTS } from "@/data/recipes";

export function ProductSelector() {
  const totalItems = useCalculatorStore((s) =>
    s.selections.reduce((sum, sel) => sum + sel.quantity, 0)
  );
  const selections = useCalculatorStore((s) => s.selections);
  const resetSelections = useCalculatorStore((s) => s.resetSelections);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);
  
  const addSoldItem = useEventStore((s) => s.addSoldItem);
  const prices = useCalculatorStore((s) => s.prices);
  const overrides = useCalculatorStore((s) => s.recipeOverrides);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddToEvent = () => {
    if (selections.length === 0) return;
    
    // Valiudate prices
    const totals = calculateTotals(selections, overrides);
    const missingPrices: string[] = [];
    
    totals.forEach(t => {
      const priceVal = prices[t.id]?.price;
      if (!priceVal || priceVal <= 0) {
        const ingName = INGREDIENTS.find(i => i.id === t.id)?.name || t.id;
        missingPrices.push(ingName);
      }
    });

    if (missingPrices.length > 0) {
      setErrorMsg(`Falta asignar costo a: ${missingPrices.join(", ")}. Ve a "Finanzas".`);
      setTimeout(() => setErrorMsg(null), 5000);
      return;
    }

    selections.forEach(sel => {
      // In a real app, prices would come from a DB or Store. 
      // For V1.1 ERP Demo we set a flat estimate.
      const estimatedPrice = sel.product === "completo" ? 2500 : 
                             sel.product === "hamburguesa" ? 4500 : 
                             sel.product === "churrasco" ? 5500 : 5000;
                             
      addSoldItem({
        product: sel.product as ProductType,
        variant: sel.variant,
        quantity: sel.quantity,
        unitPrice: estimatedPrice
      });
    });
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      resetSelections();
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-36">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up bg-cosmo-green text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-[#69F0AE] min-w-[300px] justify-center">
          <PartyPopper className="w-5 h-5 text-black" />
          ¡Añadido al Evento Actual!
        </div>
      )}

      {/* Error Toast */}
      {errorMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up bg-black/90 text-wanda-pink-light border border-wanda-pink px-6 py-4 rounded-2xl font-bold shadow-[0_0_30px_rgba(255,105,180,0.3)] flex items-center gap-3 backdrop-blur-xl w-[90%] md:w-auto text-sm md:text-base text-center">
          <AlertTriangle className="w-6 h-6 shrink-0 text-wanda-pink" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            ¿Qué vas a preparar? <span className="text-wanda-pink">🔥</span>
          </h2>
          <p className="text-sm opacity-60 mt-1">
            {totalItems > 0
              ? `${totalItems} producto${totalItems === 1 ? "" : "s"} seleccionado${totalItems === 1 ? "" : "s"}`
              : "Elige la cantidad de cada producto"}
          </p>
        </div>
        {totalItems > 0 && (
          <button
            onClick={resetSelections}
            className="rounded-xl border border-wanda-pink/30 bg-wanda-pink/10 px-4 py-2 text-xs font-bold text-wanda-pink transition-all hover:bg-wanda-pink/20 active:scale-95"
          >
            Limpiar ✕
          </button>
        )}
      </div>

      {/* Product Categories */}
      {PRODUCT_CATEGORIES.map((cat, catIdx) => (
        <div key={cat.type} className="animate-slide-up" style={{ animationDelay: `${catIdx * 80}ms` }}>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] opacity-40">
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

      {/* Floating Action Buttons */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-col md:flex-row justify-center gap-4 px-4 animate-slide-up">
          <button
            onClick={handleAddToEvent}
            className="pulse-ring relative flex items-center justify-center gap-3 rounded-2xl bg-[#0f0f0f] border-2 border-wanda px-8 py-4 text-base font-black text-wanda shadow-[0_0_20px_rgba(255,105,180,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-wanda-pink/20 hover:text-white hover:shadow-[0_0_40px_rgba(255,105,180,0.8)] active:scale-95 order-2 md:order-1 group"
          >
            <CalendarCheck className="w-5 h-5 group-hover:text-wanda-pink-light transition-colors" />
            <span>Registrar Venta (Evento)</span>
          </button>
          
          <button
            onClick={() => setActiveTab("resultados")}
            className="relative flex items-center justify-center gap-3 rounded-2xl bg-[#0f0f0f] border-2 border-cosmo px-8 py-4 text-base font-black text-cosmo shadow-[0_0_20px_rgba(127,255,0,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-cosmo-green/20 hover:text-white hover:shadow-[0_0_40px_rgba(127,255,0,0.8)] active:scale-95 order-1 md:order-2 group"
          >
            <span>Calcular Ingredientes</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cosmo-green/20 text-sm font-black text-white group-hover:bg-cosmo-green/40 transition-colors border border-cosmo-green/30">
              {totalItems}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

