"use client";

import { useCalculatorStore } from "@/store/useCalculatorStore";
import { 
  Calculator, 
  ListChecks, 
  ShoppingCart, 
  Settings2,
  DollarSign,
  BarChart3,
  CarFront,
  CalendarCheck
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", shortLabel: "Dash", icon: BarChart3 },
  { id: "logistica", label: "Logística", shortLabel: "Rut", icon: CarFront },
  { id: "evento", label: "Evento", shortLabel: "Evt", icon: CalendarCheck },
  { id: "productos", label: "Productos", shortLabel: "Prod", icon: Calculator },
  { id: "resultados", label: "Resultados", shortLabel: "Res", icon: ListChecks },
  { id: "lista", label: "Lista", shortLabel: "Com", icon: ShoppingCart },
  { id: "costos", label: "Finanzas", shortLabel: "Fin", icon: DollarSign },
  { id: "recetas", label: "Recetas", shortLabel: "Rec", icon: Settings2 },
];

export function Header() {
  const activeTab = useCalculatorStore((s) => s.activeTab);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="mx-auto max-w-5xl px-4 pb-2">
        {/* Deskop/Mobile header */}
        <div className="flex flex-col md:flex-row h-auto md:h-20 items-center justify-between py-4 gap-4 md:gap-0">
          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            <div className="bg-wanda-pink text-white p-2.5 rounded-xl fab-glow transform rotate-12 hover:rotate-0 transition-transform cursor-pointer shadow-lg relative overflow-hidden shrink-0 mt-1">
              <span className="text-xl font-bold font-mono tracking-tighter leading-none block">BL</span>
              <div className="absolute inset-0 bg-white/20 blur-sm pointer-events-none w-full h-full animate-[spin_4s_linear_infinite]" />
            </div>
            
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight">
                BLAMEY <span className="gradient-text-green bg-clip-text text-transparent">ERP</span>
              </h1>
            </div>
          </div>
          
          <nav className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              // Give priority colors to our 3 new main ERP modules
              let colorClass = "";
              if (isActive) {
                if (tab.id === 'dashboard' || tab.id === 'logistica' || tab.id === 'evento') {
                  colorClass = "bg-[var(--cosmo)] text-black font-bold border-transparent";
                } else {
                  colorClass = "bg-[var(--wanda)] text-white font-bold border-transparent";
                }
              } else {
                colorClass = "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:bg-[var(--glass-bg-solid)] text-foreground";
              }
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    shrink-0 flex items-center justify-center gap-2 
                    px-4 py-2 text-sm rounded-full transition-all duration-300
                    border ${colorClass}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive && ['dashboard', 'logistica', 'evento'].includes(tab.id) ? 'animate-pulse' : ''}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="inline md:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
            {/* Spacer for mobile scroll cutoff fix */}
            <div className="md:hidden shrink-0 w-2"></div>
          </nav>
        </div>
      </div>
    </header>
  );
}
