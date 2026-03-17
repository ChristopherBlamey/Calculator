"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Send, Heart, Lightbulb, Bug, Star, CheckCircle } from "lucide-react";

type FeedbackType = 'sugerencia' | 'bug' | 'mejora' | 'otro';

export default function FeedbackPage() {
  const [type, setType] = useState<FeedbackType>('sugerencia');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    
    // Simular envío - en producción esto guardaría en Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSent(true);
    setLoading(false);
  };

  const feedbackTypes = [
    { id: 'sugerencia', label: 'Sugerencia', icon: Lightbulb, color: 'bg-yellow-500' },
    { id: 'bug', label: 'Reportar error', icon: Bug, color: 'bg-red-500' },
    { id: 'mejora', label: 'Nueva función', icon: Star, color: 'bg-purple-500' },
    { id: 'otro', label: 'Otro', icon: Heart, color: 'bg-wanda-pink' },
  ];

  if (sent) {
    return (
      <div className="cw-bg min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-cosmo/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-cosmo" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Gracias!</h2>
          <p className="text-white/60 mb-6">
            Tu comentario ha sido enviado correctamente. Valoramos mucho tu opinión.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-wanda-pink text-white font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cw-bg min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-wanda-pink mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-wanda-pink/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-wanda-pink" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Envíanos tu Opinión
            </h1>
            <p className="text-white/60">
              Ayúdanos a mejorar Blamey ERP con tus comentarios y sugerencias
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de feedback */}
            <div>
              <label className="block text-white/80 mb-3 font-medium">
                ¿Qué tipo de comentario tienes?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feedbackTypes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id as FeedbackType)}
                      className={`p-3 rounded-xl border transition-all ${
                        type === item.id 
                          ? 'border-wanda-pink bg-wanda-pink/20' 
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${type === item.id ? 'text-wanda-pink' : 'text-white/40'}`} />
                      <span className={`text-xs block ${type === item.id ? 'text-wanda-pink' : 'text-white/40'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email (opcional) */}
            <div>
              <label className="block text-white/80 mb-2 font-medium">
                Tu email <span className="text-white/40">(opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="para responderte..."
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-wanda-pink"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-white/80 mb-2 font-medium">
                Tu comentario *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos qué piensas, qué mejorarías, qué errores encontraste..."
                rows={5}
                required
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-wanda-pink resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>Enviando...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar Comentario</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">
              ¿Encontraste un error grave? Contáctanos directamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
