"use client";

import { Sidebar } from "@/components/Sidebar";
import LandingPage from "@/components/LandingPage";
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
import { FileText, Loader2 } from "lucide-react";
import { downloadManual } from "@/lib/manual";

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

function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();

  if (loading) {
    return (
      <div className="cw-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wanda-pink/20 border-t-wanda-pink" />
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-cosmo-green" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <span className="text-sm font-semibold text-white/40">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cw-bg min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-wanda-pink text-white p-4 rounded-2xl fab-glow transform rotate-12">
              <span className="text-3xl font-bold font-mono tracking-tighter leading-none block">BL</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            BLAMEY <span className="gradient-text-green bg-clip-text text-transparent">ERP</span>
          </h1>
          <p className="text-white/40">Gestión integral para tu negocio de comida</p>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white">Bienvenido</h2>
            <p className="text-white/60 text-sm">Inicia sesión con tu cuenta de Google para acceder a tu panel personal</p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-[1.02]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          <div className="pt-4 border-t border-white/10">
            <div className="space-y-3 text-sm text-white/40">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cosmo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Tus datos son privados y seguros</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cosmo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ingredientes y productos base compartidos</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cosmo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Gestiona tu propio inventario y precios</span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <p className="text-white/30 text-xs mb-2">
              Al iniciar sesión, aceptas nuestros
            </p>
            <div className="flex items-center justify-center gap-3 text-xs">
              <Link href="/privacy" className="text-wanda-pink hover:underline">
                Política de Privacidad
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/terms" className="text-wanda-pink hover:underline">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          BLAMEY ERP © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { fetchAllData } = useUserData();
  
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

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

  // Siempre mostrar Landing primero, con opción de entrar al ERP
  if (!user) {
    return <LandingPage />;
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
              BLAMEY ERP © {new Date().getFullYear()} — V1.4
            </p>
            <Link 
              href="/manual"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-wanda-pink transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manual de Usuario</span>
            </Link>
            <AuthButton />
          </div>
        </footer>
      </main>
    </div>
  );
}

// Componente para el ERP con acceso desde Landing
function ERPAccess() {
  const { user, loading: authLoading } = useAuth();
  
  if (authLoading) return null;
  
  if (user) {
    return (
      <Link 
        href="/erp"
        className="inline-flex items-center gap-2 px-6 py-3 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light transition-colors"
      >
        <span>Entrar a mi ERP</span>
      </Link>
    );
  }
  
  return null;
}
