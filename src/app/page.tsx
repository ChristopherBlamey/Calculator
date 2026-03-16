"use client";

import { Header } from "@/components/Header";
import { ProductSelector } from "@/components/ProductSelector";
import { IngredientTotals } from "@/components/IngredientTotals";
import { ShoppingList } from "@/components/ShoppingList";
import { RecipeEditor } from "@/components/RecipeEditor";
import { CostCalculator } from "@/components/CostCalculator";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useEffect, useState } from "react";

function TabContent() {
  const activeTab = useCalculatorStore((s) => s.activeTab);

  switch (activeTab) {
    case "productos":
      return <ProductSelector />;
    case "resultados":
      return <IngredientTotals />;
    case "lista":
      return <ShoppingList />;
    case "recetas":
      return <RecipeEditor />;
    case "costos":
      return <CostCalculator />;
    default:
      return <ProductSelector />;
  }
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="cw-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#E91E8C]" />
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-[#00C853]" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <span className="text-sm font-semibold text-white/40">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cw-bg">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <TabContent />
      </main>
      <footer className="py-8 text-center">
        <p className="text-xs text-white/20 font-medium">
          Carrito Chileno © {new Date().getFullYear()} — Hecho con 🌭 y ✨
        </p>
      </footer>
    </div>
  );
}
