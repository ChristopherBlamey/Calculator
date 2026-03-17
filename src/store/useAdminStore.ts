"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
  isAdmin: boolean;
  adminPassword: string;
  failedAttempts: number;
  lockoutUntil: number | null;
  login: (password: string) => boolean;
  logout: () => void;
  checkAdmin: () => boolean;
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Motita.1403";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      adminPassword: "",
      failedAttempts: 0,
      lockoutUntil: null,

      login: (password: string) => {
        const { failedAttempts, lockoutUntil } = get();
        
        // Verificar si está bloqueado
        if (lockoutUntil && Date.now() < lockoutUntil) {
          const remainingMinutes = Math.ceil((lockoutUntil - Date.now()) / 60000);
          console.warn(`Admin bloqueado. Intenta en ${remainingMinutes} minutos`);
          return false;
        }
        
        // Verificar contraseña
        if (password === ADMIN_PASSWORD) {
          set({ 
            isAdmin: true, 
            adminPassword: password,
            failedAttempts: 0,
            lockoutUntil: null 
          });
          return true;
        }
        
        // Incrementar intentos fallidos
        const newFailedAttempts = failedAttempts + 1;
        
        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          set({ 
            failedAttempts: newFailedAttempts, 
            lockoutUntil: Date.now() + LOCKOUT_DURATION 
          });
          console.warn("Demasiados intentos fallidos. Admin bloqueado por 15 minutos");
        } else {
          set({ failedAttempts: newFailedAttempts });
        }
        
        return false;
      },

      logout: () => {
        set({ isAdmin: false, adminPassword: "" });
      },

      checkAdmin: () => {
        const { isAdmin, adminPassword, lockoutUntil } = get();
        
        // Verificar si está bloqueado
        if (lockoutUntil && Date.now() < lockoutUntil) {
          return false;
        }
        
        return isAdmin && adminPassword === ADMIN_PASSWORD;
      },
    }),
    {
      name: "blamey-admin-storage",
      partialize: (state) => ({ 
        isAdmin: state.isAdmin, 
        adminPassword: state.adminPassword,
        failedAttempts: state.failedAttempts,
        lockoutUntil: state.lockoutUntil,
      }),
    }
  )
);
