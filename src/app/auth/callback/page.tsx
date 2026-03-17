"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          setStatus("error");
          setTimeout(() => router.push("/?error=auth_failed"), 2000);
          return;
        }

        setStatus("success");
        setTimeout(() => router.push("/"), 1000);
      } catch (err) {
        console.error("Callback error:", err);
        setStatus("error");
        setTimeout(() => router.push("/?error=callback_failed"), 2000);
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

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
            <span className="text-sm font-semibold text-cosmo-green">¡Sesión iniciada!</span>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-red-400">Error al iniciar sesión</span>
          </>
        )}
      </div>
    </div>
  );
}
