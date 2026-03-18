/**
 * @file Sidebar.tsx
 * @description Navegación principal del ERP con menú lateral y header
 * 
 * Proporciona:
 * - Menú de navegación entre secciones
 * - Header con título y theme switcher
 * - Diseño responsivo para móvil y desktop
 * 
 * @author BLAMEY ERP Team
 * @version 2.3.2
 * 
 * @features
 * - Theme Switcher: Botón sol/luna para cambiar entre modo claro y oscuro
 * - Navegación adaptativa: Menú lateral en desktop, drawer en móvil
 * - Indicador de sección activa
 * 
 * @example
 * // El menú incluye:
 * - Dashboard: Estadísticas y métricas
 * - Evento: Gestión de eventos de venta
 * - Logística: Ruta y costos de transporte
 * - Productos: Catálogo de productos para venta
 * - Recetas: Recetas con costos calculados
 * - Resultados: Totales de ingredientes
 * - Lista: Lista de compras
 * - Finanzas: Calculadora de costos
 * - Admin Prod: Administración de productos
 * - Admin: Panel de administración (solo cristopher0915@gmail.com)
 */

import { useState } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useUnifiedStore } from "@/store/useUnifiedStore";
import { useAuth } from "@/hooks/useAuth";
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
  ArrowLeft,
  Sun,
  Moon
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", shortLabel: "Dash", icon: BarChart3 },
  { id: "evento", label: "Evento", shortLabel: "Evt", icon: CalendarCheck },
  { id: "logistica", label: "Logística", shortLabel: "Log", icon: CarFront },
  { id: "productos", label: "Productos", shortLabel: "Prod", icon: ShoppingCart },
  { id: "recetas", label: "Recetas", shortLabel: "Rec", icon: Settings2 },
  { id: "resultados", label: "Resultados", shortLabel: "Res", icon: ListChecks },
  { id: "lista", label: "Lista", shortLabel: "Lista", icon: Package },
  { id: "costos", label: "Finanzas", shortLabel: "Fin", icon: DollarSign },
  { id: "productos_admin", label: "Admin Prod.", shortLabel: "Adm", icon: Package },
  { id: "admin", label: "Admin", shortLabel: "Sys", icon: Shield, adminOnly: true },
];

const ADMIN_EMAIL = "cristopher0915@gmail.com";

export function Sidebar() {
  const { user } = useAuth();
  const activeTab = useCalculatorStore((s) => s.activeTab);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);
  const { theme, toggleTheme } = useUnifiedStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const visibleTabs = TABS.filter(t => !t.adminOnly || isAdmin);

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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title={theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-wanda-pink" />
            )}
          </button>
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
            {visibleTabs.map((tab) => {
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
            {visibleTabs.map((tab) => {
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
