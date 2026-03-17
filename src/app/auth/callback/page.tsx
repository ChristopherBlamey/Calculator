"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "new_user">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Auth error:", sessionError);
          setStatus("error");
          setErrorMsg("Error de autenticación");
          setTimeout(() => router.push("/?error=auth_failed"), 3000);
          return;
        }

        if (!session?.user) {
          setStatus("error");
          setErrorMsg("No se pudo obtener la sesión");
          setTimeout(() => router.push("/?error=no_session"), 3000);
          return;
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("perfiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profile) {
          // Create new profile for user
          const { error: insertError } = await supabase
            .from("perfiles")
            .insert({
              id: session.user.id,
              email: session.user.email,
              nombre: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "Usuario",
              avatar_url: session.user.user_metadata?.avatar_url || "",
            });

          if (insertError) {
            console.error("Error creating profile:", insertError);
            // Still allow access, profile can be created later
          }
        }

        // Check for error in URL (e.g., email not confirmed)
        const errorParam = searchParams.get("error");
        if (errorParam === "email_not_confirmed") {
          setStatus("error");
          setErrorMsg("Debes confirmar tu correo de Google primero");
          setTimeout(() => router.push("/?error=email_not_confirmed"), 3000);
          return;
        }

        setStatus("success");
        setTimeout(() => router.push("/erp"), 1500);
      } catch (err) {
        console.error("Callback error:", err);
        setStatus("error");
        setErrorMsg("Error al procesar la autenticación");
        setTimeout(() => router.push("/?error=callback_failed"), 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams, supabase]);

  return (
    <div className="cw-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {status === "loading" && (
          <>
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-wanda-pink/20 border-t-wanda-pink" />
              <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-cosmo-green" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <span className="text-sm font-semibold text-white/40">Verificando sesión...</span>
          </>
        )}
        
        {status === "success" && (
          <>
            <div className="h-12 w-12 rounded-full bg-cosmo-green flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-cosmo-green">¡Sesión iniciada! Cargando ERP...</span>
          </>
        )}

        {status === "new_user" && (
          <>
            <div className="h-12 w-12 rounded-full bg-wanda-pink flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-wanda-pink">Creando tu cuenta...</span>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-red-400">{errorMsg || "Error al iniciar sesión"}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="cw-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wanda-pink/20 border-t-wanda-pink" />
          </div>
          <span className="text-sm font-semibold text-white/40">Cargando...</span>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
