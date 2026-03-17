"use client";

import { Sidebar } from "@/components/Sidebar";
import { ProductSelector } from "@/components/ProductSelector";
import { IngredientTotals } from "@/components/IngredientTotals";
import { ShoppingList } from "@/components/ShoppingList";
import { RecipeEditor } from "@/components/RecipeEditor";
import { CostCalculator } from "@/components/CostCalculator";
import { Dashboard } from "@/components/Dashboard";
import { Logistica } from "@/components/Logistica";
import { EventoActual } from "@/components/EventoActual";
import { ProductManager } from "@/components/ProductManager";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useEffect, useState } from "react";
import { downloadManual } from "@/lib/manual";
import { FileText, Download } from "lucide-react";

function TabContent() {
  const activeTab = useCalculatorStore((s) => s.activeTab);

  switch (activeTab) {
    case "dashboard":
      return <Dashboard />;
    case "logistica":
      return <Logistica />;
    case "evento":
      return <EventoActual />;
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
    case "productos_admin":
      return <ProductManager />;
    default:
      return <Dashboard />;
  }
}

export const dynamic = 'force-dynamic';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="cw-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wanda-pink/20 border-t-wanda-pink" />
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-cosmo-green" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <span className="text-sm font-semibold text-white/40">Cargando ERP...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cw-bg min-h-screen">
      <Sidebar />
      <main className="md:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-4xl px-4 py-8 relative z-10 min-h-screen">
          <TabContent />
        </div>
        <footer className="py-4 text-center relative z-10 border-t border-white/5 bg-black/20 mt-12 mb-20 md:mb-0">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
            <p className="text-xs text-white/40 font-medium tracking-wide">
              BLAMEY ERP © {new Date().getFullYear()} — V1.3
            </p>
            <button 
              onClick={() => downloadManual()}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-wanda-pink transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manual de Usuario</span>
              <Download className="w-3 h-3" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
