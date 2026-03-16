"use client";

import { useMemo } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { calculateTotals } from "@/lib/calculator";
import { generateShoppingListText, generateCSV, downloadFile, downloadPDF } from "@/lib/export";

export function ShoppingList() {
  const selections = useCalculatorStore((s) => s.selections);
  const overrides = useCalculatorStore((s) => s.recipeOverrides);
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);

  const totals = useMemo(
    () => calculateTotals(selections, overrides),
    [selections, overrides]
  );

  const totalItems = selections.reduce((sum, s) => sum + s.quantity, 0);

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-5">🛒</span>
        <h3 className="text-xl font-bold text-white">Lista vacía</h3>
        <p className="mt-2 text-sm text-white/40 max-w-xs">
          Selecciona productos para generar tu lista de compras
        </p>
        <button
          onClick={() => setActiveTab("productos")}
          className="mt-6 rounded-xl bg-gradient-to-r from-[#E91E8C] to-[#FF6EB9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#E91E8C]/25 transition-all hover:scale-105 active:scale-95"
        >
          Seleccionar Productos →
        </button>
      </div>
    );
  }

  const handleCopyText = () => {
    const text = generateShoppingListText(totals);
    navigator.clipboard.writeText(text);
  };

  const handleDownloadCSV = () => {
    const csv = generateCSV(totals);
    downloadFile(csv, "lista-de-compras.csv", "text/csv");
  };

  const handleDownloadPDF = () => {
    downloadPDF(totals);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Lista de Compras 🛒
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Todo lo que necesitas comprar
        </p>
      </div>

      {/* Shopping List Card */}
      <div className="glass-card-solid p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#FF6EB9]">
          ✨ Comprar
        </h3>
        <ul className="space-y-3">
          {totals.map((t, idx) => (
            <li
              key={t.id}
              className="flex items-center gap-3 text-sm animate-slide-up"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00C853]/15 border border-[#00C853]/25 text-[#69F0AE]">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-bold text-white">
                {t.displayValue} {t.displayUnit}
              </span>
              <span className="text-white/50">{t.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopyText}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
        >
          📋 Copiar
        </button>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-1.5 rounded-xl border border-[#00C853]/20 bg-[#00C853]/10 px-4 py-2.5 text-sm font-semibold text-[#69F0AE] transition-all hover:bg-[#00C853]/20 active:scale-95"
        >
          📊 CSV
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E91E8C] to-[#FF6EB9] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#E91E8C]/20 transition-all hover:scale-105 active:scale-95"
        >
          📄 Descargar PDF
        </button>
      </div>
    </div>
  );
}
