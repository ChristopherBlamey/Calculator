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
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { useUserData } from "@/hooks/useUserData";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useCallback } from "react";
import Link from "next/link";
import { FileText, AlertTriangle, LogOut, Clock, WifiOff, RefreshCw } from "lucide-react";
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

  // Wrap each component with ErrorBoundary
  const wrapWithBoundary = (component: React.ReactNode) => (
    <ErrorBoundary>{component}</ErrorBoundary>
  );

  switch (activeTab) {
    case "dashboard":
      return wrapWithBoundary(<Dashboard />);
    case "logistica":
      return wrapWithBoundary(<Logistica />);
    case "evento":
      return wrapWithBoundary(<EventoActual />);
    case "productos":
      return wrapWithBoundary(<ProductSelector />);
    case "resultados":
      return wrapWithBoundary(<IngredientTotals />);
    case "lista":
      return wrapWithBoundary(<ShoppingList />);
    case "recetas":
      return wrapWithBoundary(<RecipeEditor />);
    case "costos":
      return wrapWithBoundary(<CostCalculator />);
    case "productos_admin":
      return wrapWithBoundary(<ProductManager />);
    case "admin":
      return wrapWithBoundary(<AdminPanel />);
    default:
      return wrapWithBoundary(<Dashboard />);
  }
}

export default function ERPPage() {
  const { user, loading: authLoading } = useAuth();
  const { fetchAllData, loading: dataLoading, error: dataError } = useUserData();

  // Cargar datos cuando el usuario está disponible
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  // Prevenir navegación hacia atrás
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/';
      return;
    }

    if (user) {
      window.history.pushState(null, "", "/erp");
    }
    
    const handlePopState = () => {
      if (user) {
        window.history.pushState(null, "", "/erp");
      } else {
        window.location.href = '/';
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [user, authLoading]);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/';
    }
  }, [authLoading, user]);

  const handleRetry = useCallback(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  // Mostrar loading solo durante autenticación
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Mostrar error si hay problema con datos
  if (dataError) {
    return <ErrorScreen onRetry={handleRetry} />;
  }

  // Mostrar nothing mientras carga datos del usuario (pero no el loading infinito)
  if (!user) {
    return null;
  }

  return (
    <div className="cw-bg min-h-screen flex flex-col pt-14 pb-20 md:pb-0">
      <InactivityModal />
      <Sidebar />
      <main className="flex-1 md:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-4xl px-3 md:px-4 pt-20 md:pt-6 pb-24 md:pb-6 relative z-10 min-h-[calc(100vh-56px)]">
          <TabContent />
        </div>
        <footer className="py-3 text-center relative z-10 border-t border-white/5 bg-black/20 fixed bottom-0 left-0 right-0 md:relative">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
            <p className="text-xs text-white/40 font-medium tracking-wide">
              BLAMEY ERP © {new Date().getFullYear()} — V2.2
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
