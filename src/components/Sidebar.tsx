"use client";

import { useState } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useRouter } from "next/navigation";
import { 
  Calculator, 
  ListChecks, 
  ShoppingCart, 
  Settings2,
  DollarSign,
  BarChart3,
  CarFront,
  CalendarCheck,
  Menu,
  X,
  ChevronLeft,
  Package,
  Shield,
  Home
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
  { id: "productos_admin", label: "Admin Prod.", shortLabel: "Adm", icon: Package },
  { id: "admin", label: "Admin", shortLabel: "Sys", icon: Shield },
];

export function Sidebar() {
  const router = useRouter();
  const activeTab = useCalculatorStore((s) => s.activeTab);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const handleHomeClick = () => {
    setActiveTab("dashboard");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Higher z-index and better positioning */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-[9999] md:hidden bg-wanda-pink text-white p-2.5 rounded-lg shadow-lg active:scale-95 transition-transform"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[9998] md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className={`
        hidden md:flex flex-col fixed left-0 top-0 h-full z-50
        bg-black/80 backdrop-blur-xl border-r border-white/10
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleHomeClick}
              className="bg-wanda-pink text-white p-2 rounded-xl fab-glow transform rotate-12 shrink-0 hover:scale-110 transition-transform"
              title="Volver al Dashboard"
            >
              <span className="text-xl font-bold font-mono tracking-tighter leading-none block">BL</span>
            </button>
            {!collapsed && (
              <h1 className="text-lg font-bold tracking-tight">
                BLAMEY <span className="gradient-text-green bg-clip-text text-transparent">ERP</span>
              </h1>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 text-white/60 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Home Button (visible when collapsed) */}
        {collapsed && (
          <div className="px-3 py-2">
            <button
              onClick={handleHomeClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-wanda-pink/20 text-wanda-pink hover:bg-wanda-pink/30 transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              let colorClass = "";
              if (isActive) {
                if (tab.id === 'dashboard' || tab.id === 'logistica' || tab.id === 'evento') {
                  colorClass = "bg-[var(--cosmo)] text-black font-bold";
                } else {
                  colorClass = "bg-[var(--wanda)] text-white font-bold";
                }
              } else {
                colorClass = "text-white/70 hover:bg-white/10 hover:text-white";
              }
              
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${colorClass}
                    `}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive && ['dashboard', 'logistica', 'evento'].includes(tab.id) ? 'animate-pulse' : ''}`} />
                    {!collapsed && <span className="truncate">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              BLAMEY ERP © {new Date().getFullYear()}
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 max-w-[85vw] z-[9999]
        bg-black/95 backdrop-blur-xl border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        md:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleHomeClick}
              className="bg-wanda-pink text-white p-2 rounded-xl fab-glow transform rotate-12 shrink-0 hover:scale-110 transition-transform"
              title="Volver al Dashboard"
            >
              <span className="text-xl font-bold font-mono tracking-tighter leading-none block">BL</span>
            </button>
            <h1 className="text-lg font-bold tracking-tight">
              BLAMEY <span className="gradient-text-green bg-clip-text text-transparent">ERP</span>
            </h1>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="py-4">
          <ul className="space-y-1 px-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              let colorClass = "";
              if (isActive) {
                if (tab.id === 'dashboard' || tab.id === 'logistica' || tab.id === 'evento') {
                  colorClass = "bg-[var(--cosmo)] text-black font-bold";
                } else {
                  colorClass = "bg-[var(--wanda)] text-white font-bold";
                }
              } else {
                colorClass = "text-white/70 hover:bg-white/10 hover:text-white";
              }
              
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200
                      ${colorClass}
                    `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-current" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
