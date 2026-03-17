"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductType } from "@/types";
import { EventoInsert, SoldItem } from "@/types/erp";
import { supabase } from "@/lib/supabase";

interface EventState {
  eventName: string;
  eventDate: string;
  fuelCost: number;
  soldItems: SoldItem[];
  status: "draft" | "pending";
  paymentStatus: "pending" | "paid";
  
  // Actions
  setEventDetails: (details: Partial<{eventName: string, eventDate: string}>) => void;
  setEventStatus: (status: "draft" | "pending") => void;
  setPaymentStatus: (status: "pending" | "paid") => void;
  setFuelCost: (cost: number) => void;
  addSoldItem: (item: SoldItem) => void;
  removeSoldItem: (index: number) => void;
  clearEvent: () => void;
  finalizeEvent: (totalCost: number) => Promise<{success: boolean; error?: any}>;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      eventName: "",
      eventDate: new Date().toISOString().split("T")[0],
      fuelCost: 0,
      soldItems: [],
      status: "draft",
      paymentStatus: "pending",

      setEventDetails: (details) => set((state) => ({ ...state, ...details })),
      
      setEventStatus: (status) => set({ status }),

      setPaymentStatus: (status) => set({ paymentStatus: status }),
      
      setFuelCost: (cost) => set({ fuelCost: Math.max(0, cost) }),
      
      addSoldItem: (item) => set((state) => {
        // Find if we already have this exact product/variant
        const existingIdx = state.soldItems.findIndex(
          i => i.product === item.product && i.variant === item.variant && i.unitPrice === item.unitPrice
        );
        
        if (existingIdx >= 0) {
          const newItems = [...state.soldItems];
          newItems[existingIdx].quantity += item.quantity;
          return { soldItems: newItems };
        }
        
        return { soldItems: [...state.soldItems, item] };
      }),
      
      removeSoldItem: (index) => set((state) => {
        const newItems = [...state.soldItems];
        newItems.splice(index, 1);
        return { soldItems: newItems };
      }),
      
      clearEvent: () => set({
        eventName: "",
        fuelCost: 0,
        soldItems: [],
        eventDate: new Date().toISOString().split("T")[0],
        status: "draft",
        paymentStatus: "pending"
      }),
      
      finalizeEvent: async (totalCost: number) => {
        const state = get();
        
        // Calculate totals
        const totalIncome = state.soldItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        const totalExpense = totalCost + state.fuelCost;
        const netProfit = totalIncome - totalExpense;
        
        const eventData: EventoInsert = {
          name: state.eventName || "Evento sin nombre",
          event_date: state.eventDate,
          location: "", // Dirección se maneja en Logística
          sold_items: state.soldItems,
          fuel_cost: state.fuelCost,
          total_income: totalIncome,
          total_cost: totalExpense,
          net_profit: netProfit,
          payment_status: state.paymentStatus
        };
        
        try {
          const { error } = await (supabase.from('eventos') as any).insert([eventData]);
          if (error) throw error;
          
          return { success: true };
        } catch (error) {
          console.error("Error saving event:", error);
          return { success: false, error };
        }
      }
    }),
    {
      name: "carrito-event-storage",
    }
  )
);
