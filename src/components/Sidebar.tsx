"use client";

import { useState } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import Link from "next/link";
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
  Home,
  ArrowLeft
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

  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <>
      {/* Global Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-black/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-3 md:px-4">
        {/* Mobile: Menu button + Title | Desktop: Just logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-2 text-white hover:bg-white/10 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Logo */}
          <button 
            onClick={handleHomeClick}
            className="flex items-center gap-2"
          >
            <div className="bg-wanda-pink text-white p-1.5 rounded-lg">
              <span className="text-sm font-bold font-mono">BL</span>
            </div>
            <span className="text-white font-bold text-sm md:text-base hidden sm:inline">
              BLAMEY <span className="text-[var(--cosmo)]">ERP</span>
            </span>
          </button>
        </div>

        {/* Current section title */}
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm hidden md:inline">{currentTab?.label}</span>
          <Link 
            href="/"
            className="flex items-center gap-1 text-xs text-white/50 hover:text-wanda-pink transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Salir</span>
          </Link>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className={`
        hidden md:flex flex-col fixed left-0 top-14 h-[calc(100vh-56px)] z-30
        bg-black/80 backdrop-blur-xl border-r border-white/10
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              let colorClass = "";
              if (isActive) {
                if (['dashboard', 'logistica', 'evento'].includes(tab.id)) {
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${colorClass}`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                    {!collapsed && <span className="truncate">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse button */}
        <div className="p-3 border-t border-white/10">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span className="text-sm">Colapsar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50
        bg-black/95 backdrop-blur-xl border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        md:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <button 
            onClick={handleHomeClick}
            className="flex items-center gap-2"
          >
            <div className="bg-wanda-pink text-white p-1.5 rounded-lg">
              <span className="text-sm font-bold font-mono">BL</span>
            </div>
            <h1 className="text-lg font-bold text-white">
              BLAMEY <span className="text-[var(--cosmo)]">ERP</span>
            </h1>
          </button>
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
                if (['dashboard', 'logistica', 'evento'].includes(tab.id)) {
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
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 ${colorClass}`}
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
