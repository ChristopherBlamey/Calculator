"use client";

import { useCalculatorStore } from "@/store/useCalculatorStore";

const TABS = [
  { key: "productos", label: "Productos", emoji: "🌭" },
  { key: "resultados", label: "Resultados", emoji: "📋" },
  { key: "lista", label: "Lista", emoji: "🛒" },
  { key: "recetas", label: "Recetas", emoji: "📝" },
  { key: "costos", label: "Costos", emoji: "💰" },
];

export function Header() {
  const activeTab = useCalculatorStore((s) => s.activeTab);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);
  const totalItems = useCalculatorStore((s) =>
    s.selections.reduce((sum, sel) => sum + sel.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0F0F1A]/80 backdrop-blur-2xl">
      {/* Title bar */}
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E91E8C] to-[#FF6EB9] text-xl shadow-lg shadow-[#E91E8C]/25">
            🌭
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#00C853] border-2 border-[#0F0F1A]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight tracking-tight">
              Carrito Chileno
            </h1>
            <p className="text-[11px] text-white/40 font-medium">
              Calculadora de Ingredientes ✨
            </p>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[#00C853]/15 border border-[#00C853]/20 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-[#00C853] animate-pulse" />
            <span className="text-xs font-bold text-[#69F0AE]">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <nav className="mx-auto max-w-3xl px-4">
        <div className="flex gap-0.5 overflow-x-auto pb-0 scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-xs font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "text-[#FF6EB9]"
                      : "text-white/40 hover:text-white/70"
                  }
                `}
              >
                <span className="text-sm">{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-[#E91E8C] to-[#FF6EB9]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
