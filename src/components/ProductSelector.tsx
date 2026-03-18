"use client";

import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useEventStore } from "@/store/useEventStore";
import { useUserData } from "@/hooks/useUserData";
import { useAuth } from "@/hooks/useAuth";
import { PartyPopper, AlertTriangle, Package, Plus, Loader2 } from "lucide-react";
import { ProductType } from "@/types";
import { calculateTotals } from "@/lib/calculator";

const CATEGORY_EMOJI: Record<string, string> = {
  hotdog: "🌭",
  churrasco: "🥩",
  hamburguesa: "🍔",
  empanada: "🥟",
  bebida: "🥤",
  producto: "📦",
};

export function ProductSelector() {
  const { user } = useAuth();
  const { productUser, ingredientBase, fetchAllData, loading: dataLoading } = useUserData();
  
  const totalItems = useCalculatorStore((s) =>
    s.selections.reduce((sum, sel) => sum + sel.quantity, 0)
  );
  const selections = useCalculatorStore((s) => s.selections);
  const resetSelections = useCalculatorStore((s) => s.resetSelections);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);
  const setEditingProduct = useCalculatorStore((s) => s.setEditingProduct);
  
  const addSoldItem = useEventStore((s) => s.addSoldItem);
  const prices = useCalculatorStore((s) => s.prices);
  const overrides = useCalculatorStore((s) => s.recipeOverrides);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof productUser> = {};
    
    productUser.forEach(prod => {
      const cat = prod.category || 'producto';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(prod);
    });
    
    return grouped;
  }, [productUser]);

  const handleAddToEvent = () => {
    if (selections.length === 0) return;
    
    const totals = calculateTotals(selections, overrides);
    const missingPrices: string[] = [];
    
    totals.forEach(t => {
      const priceVal = prices[t.id]?.price;
      if (!priceVal || priceVal <= 0) {
        missingPrices.push(t.id);
      }
    });

    if (missingPrices.length > 0) {
      setErrorMsg(`Falta asignar costo a: ${missingPrices.join(", ")}. Ve a "Finanzas".`);
      setTimeout(() => setErrorMsg(null), 5000);
      return;
    }

    selections.forEach(sel => {
      const prod = productUser.find(p => p.name.toLowerCase().includes(sel.product.toLowerCase()));
      const unitPrice = prod?.price || 2500;
                              
      addSoldItem({
        product: sel.product as ProductType,
        variant: sel.variant,
        quantity: sel.quantity,
        unitPrice
      });
    });
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      resetSelections();
    }, 2000);
  };

  if (dataLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-wanda-pink" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-36">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up bg-[var(--cosmo)] text-black px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 min-w-[280px] justify-center">
          <PartyPopper className="w-5 h-5" />
          ¡Añadido al Evento!
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up bg-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {errorMsg}
        </div>
      )}

      {/* Products Grid by Category */}
      {Object.keys(productsByCategory).length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
          <p className="text-[var(--text-muted)] mb-4">
            No hay productos creados aún.
          </p>
          <button
            onClick={() => setActiveTab("productos_admin")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl"
          >
            <Plus className="w-4 h-4" /> Crear Producto
          </button>
        </div>
      ) : (
        Object.entries(productsByCategory).map(([category, products]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="text-2xl">{CATEGORY_EMOJI[category] || "📦"}</span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="text-sm font-normal text-[var(--text-muted)]">
                ({products.length})
              </span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod.name.toLowerCase().replace(/\s+/g, "_")}
                  variant={prod.variant || prod.id.slice(0, 8)}
                  variantLabel={prod.name}
                  categoryLabel={category}
                  emoji={CATEGORY_EMOJI[category] || "📦"}
                  price={prod.price}
                  onEdit={() => {
                    setEditingProduct(`${prod.name.toLowerCase().replace(/\s+/g, "_")}_${prod.id.slice(0, 8)}`);
                    setActiveTab("recetas");
                  }}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Add to Event Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-24 left-4 right-4 md:left-64 md:right-4 z-30">
          <button
            onClick={handleAddToEvent}
            className="w-full py-4 bg-wanda-pink text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <PartyPopper className="w-6 h-6" />
            Agregar {totalItems} {totalItems === 1 ? "producto" : "productos"} al Evento
          </button>
        </div>
      )}
    </div>
  );
}
