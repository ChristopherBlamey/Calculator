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
import { AdminPanel } from "@/components/AdminPanel";
import { AuthButton } from "@/components/AuthButton";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useUserData } from "@/hooks/useUserData";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Loader2, AlertTriangle, LogOut, Clock } from "lucide-react";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";

function InactivityModal() {
  const { showWarning, remainingTime, handleStayLoggedIn, handleLogout } = useInactivityTimeout();

  if (!showWarning) return null;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card p-6 max-w-sm mx-4 text-center space-y-6 border-2 border-wanda-pink/50">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-wanda-pink/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-wanda-pink animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Sesión por expirar</h3>
          <p className="text-white/60 text-sm">
            Has estado inactivo por mucho tiempo. ¿Deseas mantener la sesión abierta?
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-cosmo-green">
          <Clock className="w-5 h-5" />
          <span className="text-2xl font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar
          </button>
          <button
            onClick={handleStayLoggedIn}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cosmo-green text-black font-bold rounded-xl hover:bg-cosmo-green-light transition-colors"
          >
            Mantener
          </button>
        </div>
      </div>
    </div>
  );
}

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
    case "admin":
      return <AdminPanel />;
    default:
      return <Dashboard />;
  }
}

export default function ERPPage() {
  const [mounted, setMounted] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { fetchAllData } = useUserData();
  
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  // Si no está logueado, redirigir al landing
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      window.location.href = '/';
    }
  }, [mounted, authLoading, user]);

  if (!mounted || authLoading) {
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

  if (!user) {
    return null;
  }

  return (
    <div className="cw-bg min-h-screen">
      <InactivityModal />
      <Sidebar />
      <main className="md:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-4xl px-4 py-8 relative z-10 min-h-screen">
          <TabContent />
        </div>
        <footer className="py-4 text-center relative z-10 border-t border-white/5 bg-black/20 mt-12 mb-20 md:mb-0">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
            <Link href="/" className="text-xs text-wanda-pink hover:underline">
              ← Volver al Inicio
            </Link>
            <p className="text-xs text-white/40 font-medium tracking-wide">
              BLAMEY ERP © {new Date().getFullYear()} — V1.4
            </p>
            <Link 
              href="/manual"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-wanda-pink transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manual</span>
            </Link>
            <AuthButton />
          </div>
        </footer>
      </main>
    </div>
  );
}
