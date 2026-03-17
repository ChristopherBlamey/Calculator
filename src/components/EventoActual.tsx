"use client";

import { useState, useMemo } from "react";
import { useEventStore } from "@/store/useEventStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { calculateTotals, calculateCosts } from "@/lib/calculator";
import { Calendar, Receipt, Trash2, PartyPopper, Play, CheckCircle2, DollarSign, FileText, Save } from "lucide-react";
import { generateBudgetPDF } from "@/lib/export";

export function EventoActual() {
  const event = useEventStore();
  const decrementStock = useInventoryStore((s) => s.decrementStock);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [success, setSuccess] = useState(false);

  const prices = useCalculatorStore((s) => s.prices);
  const overrides = useCalculatorStore((s) => s.recipeOverrides);

  // Calculate totals
  const totalIncome = event.soldItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  
  const realIngredientCost = useMemo(() => {
    const productSelections = event.soldItems.map(item => ({
      product: item.product as "completo" | "hamburguesa" | "churrasco" | "as",
      variant: item.variant,
      quantity: item.quantity
    }));
    const totals = calculateTotals(productSelections, overrides);
    const costs = calculateCosts(totals, prices);
    return costs.reduce((sum, item) => sum + item.cost, 0);
  }, [event.soldItems, overrides, prices]);

  const netProfit = totalIncome - realIngredientCost - event.fuelCost;

  const handleSaveEvent = async () => {
    setIsFinalizing(true);
    event.setEventStatus("pending");
    event.setPaymentStatus("pending");
    const result = await event.finalizeEvent(realIngredientCost);
    setIsFinalizing(false);
    if (result.success) {
      setSuccess(true);
      event.clearEvent();
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Error al guardar el evento. Revisa la consola.");
    }
  };

  const handleGenerateBudget = async () => {
    if (event.soldItems.length === 0) {
      alert("No hay productos agregados para generar el presupuesto.");
      return;
    }
    await generateBudgetPDF(event.eventName || "Presupuesto", event.soldItems);
  };

  const handleFinalize = async () => {
    setIsFinalizing(true);
    
    // Simulate updating inventory
    // In a real app we'd map products to recipe ingredients here and call decrementStock
    
    // Finalize to Supabase via store
    const result = await event.finalizeEvent(realIngredientCost);
    
    setIsFinalizing(false);
    
    if (result.success) {
      setSuccess(true);
      event.clearEvent();
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Error al guardar el evento. Revisa la consola.");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 animate-slide-up">
        <div className="w-24 h-24 rounded-full bg-cosmo-green/20 flex items-center justify-center pulse-ring relative">
          <PartyPopper className="w-12 h-12 text-cosmo-green relative z-10" />
        </div>
        <h2 className="text-2xl font-bold gradient-text-green mt-4">¡Evento Finalizado!</h2>
        <p className="text-white/60">Los datos se han guardado exitosamente en el Dashboard.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
        >
          Nuevo Evento
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Sesión de <span className="gradient-text-pink">Ventas</span>
          {event.status === "draft" && (
            <span className="ml-3 text-xs uppercase tracking-widest bg-white/20 text-white px-2 py-1 rounded-md font-bold">Borrador</span>
          )}
          {event.status === "pending" && (
            <span className="ml-3 text-xs uppercase tracking-widest bg-wanda-pink/30 text-wanda-pink-light px-2 py-1 rounded-md border border-wanda-pink/50 font-bold">En Curso</span>
          )}
        </h2>
        {event.status === "pending" && (
          <button
            onClick={() => event.setPaymentStatus(event.paymentStatus === "paid" ? "pending" : "paid")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              event.paymentStatus === "paid" 
                ? "bg-cosmo-green/20 text-cosmo-green border border-cosmo-green/30" 
                : "bg-wanda-pink/20 text-wanda-pink border border-wanda-pink/30"
            }`}
          >
            <DollarSign className="w-3 h-3" />
            {event.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
          </button>
        )}
      </div>

      {/* Details Form */}
      <div className="glass-card p-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-bold mb-1.5 text-white/90">Nombre del Evento</label>
          <input
            type="text"
            placeholder="Ej: Cumpleaños Juanita"
            value={event.eventName}
            onChange={(e) => event.setEventDetails({ eventName: e.target.value })}
            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wanda-pink/70 transition-all font-medium text-white placeholder:text-white/40"
          />
        </div>
        <div>
          <label className="flex text-sm font-bold mb-1.5 text-white/90 items-center gap-1">
              <Calendar className="w-4 h-4 text-cosmo-green" /> Fecha
            </label>
          <input
            type="date"
            value={event.eventDate}
            onChange={(e) => event.setEventDetails({ eventDate: e.target.value })}
            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cosmo-green/70 transition-all font-medium text-white"
          />
        </div>
        {event.status === "draft" && (
          <div className="md:col-span-2 pt-2">
            <button
              onClick={() => event.setEventStatus("pending")}
              className="w-full bg-cosmo-green text-black font-bold py-3.5 rounded-xl fab-glow green hover:bg-[#69F0AE] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!event.eventName}
            >
              <Play className="w-5 h-5" />
              Cargar Evento (Iniciar)
            </button>
          </div>
        )}
      </div>

      {event.status === "pending" && (
        <>
          {/* Sales List */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-cosmo-green" /> Productos Vendidos
          </h3>
          <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{event.soldItems.length} items</span>
        </div>
        
        {event.soldItems.length === 0 ? (
          <div className="p-8 text-center text-white/40 text-sm">
            No hay ventas registradas. Añade productos desde la pestaña "Productos" y marca "Vendido".
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto">
            {event.soldItems.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div>
                  <p className="font-bold capitalize text-white">{item.product} {item.variant} <span className="text-white/70 text-sm ml-2 font-medium">x{item.quantity}</span></p>
                  <p className="text-xs text-cosmo-green mt-0.5 font-bold">${item.unitPrice.toLocaleString('es-CL')} c/u</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">${(item.quantity * item.unitPrice).toLocaleString('es-CL')}</p>
                  <button 
                    onClick={() => event.removeSoldItem(idx)}
                    className="p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Totals */}
      <div className="glass-card neon-border-wanda p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="opacity-70">Ingresos brutos</span>
          <span className="font-medium">${totalIncome.toLocaleString('es-CL')}</span>
        </div>
        <div className="flex justify-between text-sm text-red-400">
          <span className="opacity-70">Costo combustibles (Logística)</span>
          <span>-${event.fuelCost.toLocaleString('es-CL')}</span>
        </div>
        <div className="flex justify-between text-sm text-red-400 pb-4 border-b border-white/10">
          <span className="opacity-70">Costo ingredientes (Calculado Real)</span>
          <span>-${realIngredientCost.toLocaleString('es-CL')}</span>
        </div>
        <div className="flex justify-between items-end pt-2">
          <span className="font-semibold">Ganancia Neta</span>
          <span className="text-3xl font-black gradient-text-green">
            ${netProfit.toLocaleString('es-CL')}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={handleSaveEvent}
          disabled={isFinalizing || event.soldItems.length === 0}
          className="flex-1 bg-cosmo-green text-black font-bold py-4 rounded-xl fab-glow green hover:bg-[#69F0AE] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFinalizing ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Evento
            </>
          )}
        </button>
        <button
          onClick={handleGenerateBudget}
          disabled={event.soldItems.length === 0}
          className="flex-1 bg-wanda-pink text-white font-bold py-4 rounded-xl fab-glow hover:bg-wanda-pink-light transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-5 h-5" />
          Generar Presupuesto
        </button>
      </div>
      </>
      )}
    </div>
  );
}
