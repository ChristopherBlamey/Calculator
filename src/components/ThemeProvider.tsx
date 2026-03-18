"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUnifiedStore } from "@/store/useUnifiedStore";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme: storeTheme, toggleTheme: storeToggleTheme } = useUnifiedStore();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  // Sync with store
  useEffect(() => {
    setTheme(storeTheme);
  }, [storeTheme]);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem("blamey-theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (!prefersDark) {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem("blamey-theme");
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("blamey-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    storeToggleTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
