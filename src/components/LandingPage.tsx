"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowRight, 
  Star, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Calendar,
  Users,
  Heart,
  ChevronDown,
  Gamepad2,
  Zap,
  Shield
} from "lucide-react";
import { useState } from "react";

function FeatureCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-transform">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  );
}

function PixelDivider() {
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className={`w-2 h-2 ${i % 2 === 0 ? 'bg-wanda-pink' : 'bg-cosmo-green'} opacity-60`}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="cw-bg min-h-screen">
      {/* Header flotante si está logueado */}
      {user && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-wanda-pink text-white p-2 rounded-lg">
                <span className="text-lg font-bold font-mono">BL</span>
              </div>
              <span className="text-white font-bold">BLAMEY ERP</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/erp"
                className="px-4 py-2 bg-wanda-pink text-white font-bold rounded-lg hover:bg-wanda-pink-light transition-colors"
              >
                Ir a mi ERP
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${user ? 'pt-20' : ''}`}>
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          {/* Logo grande estilo 8 bits */}
          <div className="mb-8">
            <div className="inline-block relative">
              <div className="bg-gradient-to-br from-wanda-pink to-wanda-light p-6 rounded-3xl fab-glow transform -rotate-6">
                <div className="grid grid-cols-4 gap-1">
                  {[
                    [1,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,1,0],
                    [1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],
                  ].map((row, i) => (
                    <div key={i} className="flex gap-1">
                      {row.map((pixel, j) => (
                        <div key={j} className={`w-2 h-2 ${pixel ? 'bg-white' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            BLAMEY <span className="gradient-text-green">ERP</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-4 font-light">
            Tu sistema de gestión integral
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cosmo/20 border border-cosmo rounded-full mb-8">
            <Zap className="w-4 h-4 text-cosmo" />
            <span className="text-cosmo font-bold">100% Gratuito</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {user ? (
              <Link
                href="/erp"
                className="group flex items-center gap-3 px-8 py-4 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light transition-all hover:scale-105"
              >
                <span>Entrar a mi ERP</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-md">
                <button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 disabled:opacity-50"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>{loading ? 'Cargando...' : 'Iniciar Sesión'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="text-white/40 text-sm">o</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>
                
                <button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="group flex items-center justify-center gap-3 px-8 py-4 glass-card border-wanda-pink/50 text-white font-bold rounded-xl hover:border-wanda-pink transition-all hover:scale-105 disabled:opacity-50"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Crear Cuenta Nueva</span>
                </button>
                
                <p className="text-white/50 text-xs text-center">
                  Ambos requieren cuenta Google. Si es tu primera vez, crea una cuenta.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 text-white/40 text-sm mb-8">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              No requiere tarjeta
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Multi-usuario
            </span>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Código abierto
            </span>
          </div>

          <button 
            onClick={() => setShowFeatures(!showFeatures)}
            className="text-white/50 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>Descubre todas las funciones</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${showFeatures ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {showFeatures && (
        <>
          <PixelDivider />

          {/* Features Section */}
          <section className="py-20 section-gradient">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  <Gamepad2 className="inline w-8 h-8 text-wanda-pink mr-2" />
                  Funciones del Sistema
                </h2>
                <p className="text-white/60 text-lg">Todo lo que necesitas para gestionar tu negocio</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard 
                  icon={ShoppingCart}
                  title="Gestión de Productos"
                  description="Crea y administra tus productos con recetas detalladas y costos automátizados"
                  color="bg-gradient-to-br from-wanda-pink to-wanda-light"
                />
                <FeatureCard 
                  icon={Package}
                  title="Control de Inventario"
                  description="Mantén el control de tus ingredientes y stock en tiempo real"
                  color="bg-gradient-to-br from-cosmo to-cosmo-light"
                />
                <FeatureCard 
                  icon={DollarSign}
                  title="Calculadora de Costos"
                  description="Calcula el costo real de cada producto y define tus márgenes de ganancia"
                  color="bg-gradient-to-br from-blue-500 to-blue-400"
                />
                <FeatureCard 
                  icon={Calendar}
                  title="Gestión de Eventos"
                  description="Registra tus eventos, ventas y ganancias para analizar tu rentabilidad"
                  color="bg-gradient-to-br from-purple-500 to-purple-400"
                />
                <FeatureCard 
                  icon={Users}
                  title="Multi-Usuario"
                  description="Cada usuario tiene su propio espacio con datos privados y seguros"
                  color="bg-gradient-to-br from-orange-500 to-orange-400"
                />
                <FeatureCard 
                  icon={Shield}
                  title="Datos Seguros"
                  description="Tu información está protegida con autenticación Google y políticas de seguridad"
                  color="bg-gradient-to-br from-teal-500 to-teal-400"
                />
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  ¿Cómo funciona?
                </h2>
                <p className="text-white/60">En 3 simples pasos</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-wanda-pink/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-black text-wanda-pink">1</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">Inicia sesión</h3>
                  <p className="text-white/50 text-sm">Usa tu cuenta de Google para acceder al sistema</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-cosmo/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-black text-cosmo">2</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">Configura</h3>
                  <p className="text-white/50 text-sm">Personaliza precios de ingredientes y crea tus productos</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-black text-blue-400">3</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">¡Listo!</h3>
                  <p className="text-white/50 text-sm">Gestiona tu negocio y registra tus eventos</p>
                </div>
              </div>
            </div>
          </section>

          {/* Free section */}
          <section className="py-20 section-dark">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <div className="glass-card p-8 md:p-12">
                <div className="w-20 h-20 bg-cosmo/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-cosmo" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Totalmente Gratis
                </h2>
                <p className="text-white/60 text-lg mb-6">
                  Blamey ERP es un proyecto abierto y gratuito. Creado para ayudar a emprendedores 
                  del food truck y negocios de comida a gestionar sus operaciones.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/40">
                  <span>✓ Sin costos</span>
                  <span>✓ Sin suscripciones</span>
                  <span>✓ Sin límites</span>
                  <span>✓ Actualizaciones gratuitas</span>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback section */}
          <section className="py-20">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Tienes sugerencias?
              </h2>
              <p className="text-white/60 mb-8">
                Tu opinión es importante para mejorar. Comparte tus ideas y comentarios.
              </p>
              <Link 
                href="/feedback"
                className="inline-flex items-center gap-2 px-6 py-3 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>Enviar Comentarios</span>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-wanda-pink text-white p-2 rounded-lg">
                    <span className="text-lg font-bold font-mono">BL</span>
                  </div>
                  <span className="text-white font-bold">BLAMEY ERP</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-white/40">
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
                  <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
                  <Link href="/manual" className="hover:text-white transition-colors">Manual</Link>
                </div>
              </div>
              <div className="text-center mt-8 text-white/20 text-sm">
                <p>© {new Date().getFullYear()} Blamey ERP - Hecho con ❤️ para emprendedores</p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
