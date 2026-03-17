"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              Términos y Condiciones
            </h1>
            <p className="text-white/40">Última actualización: Marzo 2026</p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-wanda-pink rounded-full" />
              Uso del Sistema
            </h2>
            <div className="text-white/70 space-y-3 leading-relaxed">
              <p>
                Al acceder y utilizar Blamey ERP, aceptas los siguientes términos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white">Acceso gratuito:</strong> El servicio se ofrece de forma gratuita a todos los usuarios con cuenta Google válida.
                </li>
                <li>
                  <strong className="text-white">Cuenta personal:</strong> Cada usuario es responsable de mantener la confidencialidad de su cuenta.
                </li>
                <li>
                  <strong className="text-white">Uso lawful:</strong> No puedes utilizar el sistema para fines ilegales o no autorizados.
                </li>
                <li>
                  <strong className="text-white">Datos precisos:</strong> Eres responsable de proporcionar información veraz en tus productos e inventarios.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-cosmo-green rounded-full" />
              Propiedad Intelectual
            </h2>
            <div className="text-white/70 space-y-3 leading-relaxed">
              <p>
                <strong className="text-cosmo-green">Blamey ERP</strong> y todos sus componentes son propiedad intelectual del administrador del sistema.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>El código fuente, diseño y arquitectura del ERP</li>
                <li>Los ingredientes y productos base compartidos</li>
                <li>El nombre "Blamey" y связанные marcas</li>
                <li>La documentación y manuales</li>
              </ul>
              <p className="mt-3">
                Los usuarios <strong className="text-white">conservan</strong> la propiedad de los datos que ingresan (sus productos personalizados, precios, eventos).
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-red-500 rounded-full" />
              Limitación de Responsabilidad
            </h2>
            <div className="text-white/70 space-y-3 leading-relaxed">
              <p>
                Blamey ERP se proporciona "tal cual" sin garantías de ningún tipo:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white">Sin garantía de disponibilidad:</strong> No garantizamos que el servicio esté siempre disponible o libre de errores.
                </li>
                <li>
                  <strong className="text-white">Responsabilidad del usuario:</strong> Eres responsable de verificar la precisión de cálculos de costos y precios.
                </li>
                <li>
                  <strong className="text-white">Pérdida de datos:</strong> Recomendamos realizar backups periódicos de tus datos importantes.
                </li>
                <li>
                  <strong className="text-white">Uso comercial:</strong> El administrador no se hace responsable de decisiones de negocio basadas en los datos del ERP.
                </li>
              </ul>
              <p className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                En ningún caso, los creadores de Blamey ERP serán responsables por daños directos, indirectos, incidentales o consecuentes derivados del uso del sistema.
              </p>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full" />
              Modificaciones
            </h2>
            <div className="text-white/70 space-y-3 leading-relaxed">
              <p>
                El administrador se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en la aplicación.
              </p>
              <p>
                El uso continuo del sistema después de modificaciones constituye aceptación de los nuevos términos.
              </p>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full" />
              Contacto
            </h2>
            <div className="text-white/70 leading-relaxed">
              <p>
                Para preguntas sobre estos términos, contacta al administrador de Blamey ERP.
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
