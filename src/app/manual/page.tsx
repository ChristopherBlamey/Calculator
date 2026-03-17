"use client";

import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Calendar,
  Calculator,
  Settings,
  Users,
  Truck,
  FileText,
  ChevronRight,
  CheckCircle
} from "lucide-react";

function Section({ id, icon: Icon, title, children }: { id: string, icon: any, title: string, children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-wanda-pink/20 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-wanda-pink" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="glass-card p-6 space-y-4">
        {children}
      </div>
    </section>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 bg-cosmo/20 rounded-full flex items-center justify-center shrink-0">
        <span className="text-cosmo font-bold text-sm">{number}</span>
      </div>
      <div>
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-white/60 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function ManualPage() {
  return (
    <div className="cw-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-wanda-pink mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-wanda-pink to-wanda-light rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                Manual de Usuario
              </h1>
              <p className="text-white/50">Blamey ERP v1.4</p>
            </div>
          </div>
        </div>

        {/* Índice */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-white font-bold mb-4">Contenido</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { href: '#introduccion', label: 'Introducción' },
              { href: '#primeros-pasos', label: 'Primeros Pasos' },
              { href: '#productos', label: 'Gestión de Productos' },
              { href: '#ingredientes', label: 'Ingredientes e Inventario' },
              { href: '#costos', label: 'Calculadora de Costos' },
              { href: '#eventos', label: 'Eventos y Ventas' },
              { href: '#finanzas', label: 'Finanzas' },
              { href: '#tips', label: 'Tips y Mejores Prácticas' },
            ].map((item) => (
              <a 
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-white/60 hover:text-wanda-pink transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-8">
          {/* Introducción */}
          <section id="introduccion" className="scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Introducción</h2>
            </div>
            <div className="glass-card p-6">
              <p className="text-white/70 leading-relaxed mb-4">
                <strong className="text-wanda-pink">Blamey ERP</strong> es un sistema de gestión integral 
                diseñado específicamente para negocios de comida, food trucks y emprendedores gastronómicos. 
                Te permite administrar tus productos, calcular costos, gestionar inventario y registrar 
                eventos para analizar la rentabilidad de tu negocio.
              </p>
              <p className="text-white/70 leading-relaxed">
                El sistema cuenta con una <strong>cuenta gratuita</strong> mediante autenticación con Google. 
                Cada usuario tiene su propio espacio de trabajo con datos privados, pero todos comparten 
                una base de ingredientes y productos predefinidos que pueden personalizar.
              </p>
            </div>
          </section>

          {/* Primeros Pasos */}
          <Section id="primeros-pasos" icon={Users} title="Primeros Pasos">
            <p className="text-white/60">
              Para comenzar a usar Blamey ERP, sigue estos pasos:
            </p>
            <div className="space-y-4 pt-2">
              <Step 
                number="1" 
                title="Inicia sesión" 
                description="Usa el botón 'Comenzar Gratis' y autentícate con tu cuenta de Google."
              />
              <Step 
                number="2" 
                title="Explora el menú" 
                description="La barra lateral te permite navegar entre las diferentes secciones del sistema."
              />
              <Step 
                number="3" 
                title="Personaliza precios" 
                description="Ve a 'Admin Prod.' y ajusta los precios de los ingredientes según tus proveedores."
              />
            </div>
          </Section>

          {/* Gestión de Productos */}
          <Section id="productos" icon={ShoppingCart} title="Gestión de Productos">
            <p className="text-white/60">
              La sección de productos te permite vender y calcular lo que necesitas preparar para cada pedido o evento.
            </p>
            <div className="space-y-4 pt-2">
              <Step 
                number="1" 
                title="Selecciona productos" 
                description="En la pestaña 'Productos', marca las cantidades que necesitas preparar de cada producto."
              />
              <Step 
                number="2" 
                title="Verifica ingredientes" 
                description="Automáticamente se calculan los ingredientes necesarios en la sección 'Resultados'."
              />
              <Step 
                number="3" 
                title="Genera lista de compras" 
                description="Usa la sección 'Lista' para ver exactamente qué debes comprar."
              />
            </div>
            <div className="mt-4 p-3 bg-cosmo/10 border border-cosmo/30 rounded-lg">
              <p className="text-cosmo text-sm">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Los productos se calculan automáticamente basándose en las recetas definidas.
              </p>
            </div>
          </Section>

          {/* Ingredientes */}
          <Section id="ingredientes" icon={Package} title="Ingredientes e Inventario">
            <p className="text-white/60">
              Los ingredientes son la base de tus productos. Cada ingrediente tiene un costo por unidad.
            </p>
            <div className="space-y-4 pt-2">
              <Step 
                number="1" 
                title="Ingredientes Base" 
                description="Blamey viene con una lista de ingredientes predefinidos (pan, vienesa, palta, etc.)."
              />
              <Step 
                number="2" 
                title="Personalizar Costos" 
                description="Ve a 'Admin Prod.', luego a la pestaña 'Precios Base' y ajusta cada precio según tus proveedores."
              />
              <Step 
                number="3" 
                title="Crear nuevos" 
                description="Si necesitas otros ingredientes, agrégalos en 'Admin Prod.' > 'Ingredientes'."
              />
            </div>
          </Section>

          {/* Calculadora de Costos */}
          <Section id="costos" icon={Calculator} title="Calculadora de Costos">
            <p className="text-white/60">
              Define el precio de venta de tus productos basándote en los costos de ingredientes.
            </p>
            <div className="space-y-4 pt-2">
              <Step 
                number="1" 
                title="Selecciona producto" 
                description="Elige el producto que quieres calcular en la sección 'Finanzas'."
              />
              <Step 
                number="2" 
                title="Ajusta cantidades" 
                description="Modifica las cantidades de ingredientes si usas porciones diferentes a la receta base."
              />
              <Step 
                number="3" 
                title="Define margen" 
                description="El sistema te mostrará el costo total y te ayudará a definir tu precio de venta."
              />
            </div>
          </Section>

          {/* Eventos */}
          <Section id="eventos" icon={Calendar} title="Eventos y Ventas">
            <p className="text-white/60">
              Registra tus eventos para analizar tu rentabilidad y historial de ventas.
            </p>
            <div className="space-y-4 pt-2">
              <Step 
                number="1" 
                title="Crea un evento" 
                description="En la sección 'Evento', ingresa el nombre, fecha y ubicación."
              />
              <Step 
                number="2" 
                title="Registra ventas" 
                description="Agrega los productos vendidos durante el evento."
              />
              <Step 
                number="3" 
                title="Calcula ganancias" 
                description="El sistema restará los costos para mostrarte la ganancia neta del evento."
              />
            </div>
          </Section>

          {/* Finanzas */}
          <Section id="finanzas" icon={DollarSign} title="Sección de Finanzas">
            <p className="text-white/60">
              Controla tus finanzas registrando gastos y viendo reportes de rentabilidad.
            </p>
            <ul className="space-y-2 pt-2 text-white/60">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-cosmo mt-1 shrink-0" />
                <span>Registro de costos de insumos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-cosmo mt-1 shrink-0" />
                <span>Cálculo automático de costos por producto</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-cosmo mt-1 shrink-0" />
                <span>Análisis de rentabilidad por evento</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-cosmo mt-1 shrink-0" />
                <span>Historial de ganancias</span>
              </li>
            </ul>
          </Section>

          {/* Tips */}
          <Section id="tips" icon={FileText} title="Tips y Mejores Prácticas">
            <p className="text-white/60">
              Consejos para aprovechar al máximo Blamey ERP:
            </p>
            <ul className="space-y-3 pt-2">
              <li className="p-3 bg-white/5 rounded-lg">
                <strong className="text-wanda-pink">✓ Actualiza precios regularmente</strong>
                <p className="text-white/60 text-sm">Los costos de ingredientes cambian; mantén los precios actualizados para cálculos precisos.</p>
              </li>
              <li className="p-3 bg-white/5 rounded-lg">
                <strong className="text-wanda-pink">✓ Registra cada evento</strong>
                <p className="text-white/60 text-sm">Aunque sea pequeño, registra todo para tener datos históricos y mejorar tu negocio.</p>
              </li>
              <li className="p-3 bg-white/5 rounded-lg">
                <strong className="text-wanda-pink">✓ Revisa los costos</strong>
                <p className="text-white/60 text-sm">Antes de eventos importantes, verifica que los márgenes sean los esperados.</p>
              </li>
              <li className="p-3 bg-white/5 rounded-lg">
                <strong className="text-wanda-pink">✓ Usa la lista de compras</strong>
                <p className="text-white/60 text-sm">La lista de compras te ayuda a no olvidar nada y optimizar tus compras.</p>
              </li>
            </ul>
          </Section>

          {/* Soporte */}
          <div className="glass-card p-6 bg-gradient-to-r from-[#e91e8c]/10 to-[#7fff00]/10 border border-[#e91e8c]/30">
            <h3 className="text-white font-bold mb-2">Necesitas ayuda?</h3>
            <p className="text-white/60 mb-4">
              Si tienes dudas o sugerencias, no dudes en contactarnos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/feedback" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-lg hover:bg-wanda-pink-light transition-colors"
              >
                <FileText className="w-4 h-4" />
                Enviar Comentario
              </Link>
              <Link 
                href="/privacy" 
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link 
                href="/terms" 
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Términos
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-white/20 text-sm">
          <p>© {new Date().getFullYear()} Blamey ERP - Manual de Usuario</p>
        </footer>
      </div>
    </div>
  );
}
