"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="cw-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-wanda-pink mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>

        <article className="glass-card p-8 space-y-8">
          <header className="text-center pb-6 border-b border-white/10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Política de Privacidad
            </h1>
            <p className="text-white/40">Última actualización: Marzo 2026</p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-wanda-pink rounded-full" />
              Datos Recolectados
            </h2>
            <div className="text-white/70 space-y-3 leading-relaxed">
              <p>
                Blamey ERP únicamente recolecta los datos proporcionados por Google Auth durante el proceso de autenticación:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Nombre completo (de tu cuenta Google)</li>
                <li>Dirección de correo electrónico</li>
                <li>Foto de perfil (si está disponible)</li>
              </ul>
              <p className="mt-2">
                <strong className="text-wanda-pink">No solicitamos</strong> información adicional como números de teléfono, dirección física o datos de pago.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-cosmo-green rounded-full" />
              Uso de la Información
            </h2>
            <div className="text-white/70 space-y-3 leading-relaxed">
              <p>
                Los datos recolectados se utilizan exclusivamente para:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Autenticación y acceso al sistema</li>
                <li>Personalizar tu experiencia dentro del ERP</li>
                <li>Identificar tu cuenta de usuario</li>
                <li>Gestionar tus productos, ingredientes y eventos</li>
              </ul>
              <p className="mt-2">
                <strong className="text-cosmo-green">No compartilhemos</strong> tus datos con terceros con fines comerciales o publicitarios.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full" />
              Seguridad de los Datos
            </h2>
            <div className="text-white/70 space-y-3 leading-relaxed">
              <p>
                Implementamos medidas de seguridad para proteger tu información:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Conexión segura mediante SSL/HTTPS</li>
                <li>Autenticación via Google OAuth 2.0</li>
                <li>Políticas de Row Level Security (RLS) en base de datos</li>
                <li>Almacenamiento en infraestructura segura de Supabase</li>
              </ul>
              <p className="mt-2">
                Tú eres responsable de mantener segura tu sesión. Recomendamos cerrar sesión al usar dispositivos compartidos.
              </p>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full" />
              Contacto
            </h2>
            <div className="text-white/70 leading-relaxed">
              <p>
                Si tienes preguntas sobre esta política de privacidad, contacta al administrador de Blamey ERP.
              </p>
            </div>
          </section>
        </article>

        <footer className="text-center py-8 text-white/20 text-sm">
          <p>© {new Date().getFullYear()} Blamey ERP. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
