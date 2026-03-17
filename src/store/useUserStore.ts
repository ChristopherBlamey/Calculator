"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string;
  nombre: string;
  avatar_url: string;
}

interface UserState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setProfile: (profile) =>
        set({ profile }),

      logout: () =>
        set({ user: null, profile: null, isAuthenticated: false }),
    }),
    {
      name: "blamey-user-storage",
      partialize: (state) => ({ user: state.user, profile: state.profile, isAuthenticated: state.isAuthenticated }),
    }
  )
);
