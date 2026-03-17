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
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FileText, Loader2, AlertTriangle, LogOut, Clock, WifiOff, RefreshCw } from "lucide-react";
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

function LoadingScreen() {
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

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="cw-bg flex min-h-screen items-center justify-center">
      <div className="glass-card p-8 max-w-md mx-4 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Error al cargar</h3>
          <p className="text-white/60 text-sm">
            No se pudo cargar el ERP. Verifica tu conexión a internet.
          </p>
        </div>

        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
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
  const [loadError, setLoadError] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { fetchAllData } = useUserData();
  
  useEffect(() => setMounted(true), []);

  // Timeout para cargar - si tarda más de 10 segundos, mostrar error
  useEffect(() => {
    if (authLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [authLoading]);

  useEffect(() => {
    if (user) {
      fetchAllData().catch(() => setLoadError(true));
    }
  }, [user, fetchAllData]);

  // Prevenir navegación hacia atrás - siempre redirigir al ERP
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Siempre ir al dashboard si hay un usuario
      if (user) {
        window.history.pushState(null, "", "/erp");
      }
    };

    window.history.pushState(null, "", "/erp");
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [user]);

  // Si no está logueado, redirigir al landing
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      window.location.href = '/';
    }
  }, [mounted, authLoading, user]);

  const handleRetry = useCallback(() => {
    setLoadError(false);
    setLoadingTimeout(false);
    if (user) {
      fetchAllData().catch(() => setLoadError(true));
    }
  }, [user, fetchAllData]);

  if (!mounted || authLoading) {
    if (loadingTimeout && !user) {
      return <ErrorScreen onRetry={handleRetry} />;
    }
    return <LoadingScreen />;
  }

  if (loadError) {
    return <ErrorScreen onRetry={handleRetry} />;
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
              BLAMEY ERP © {new Date().getFullYear()} — V1.6
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
