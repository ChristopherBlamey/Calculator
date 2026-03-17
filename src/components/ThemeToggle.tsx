"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        fixed bottom-6 left-6 z-50 p-4 rounded-full
        backdrop-blur-xl border transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-black/40 border-[#FF69B4]/50 shadow-[0_0_20px_rgba(255,105,180,0.3)] hover:shadow-[0_0_30px_rgba(255,105,180,0.5)]' 
          : 'bg-white/80 border-[#00C853]/50 shadow-[0_0_20px_rgba(0,200,83,0.3)] hover:shadow-[0_0_30px_rgba(0,200,83,0.5)]'}
        hover:scale-110 active:scale-95
      `}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-[#FF69B4] drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]" />
      ) : (
        <Moon className="w-6 h-6 text-[#00C853] drop-shadow-[0_0_8px_rgba(0,200,83,0.8)]" />
      )}
    </button>
  );
}
