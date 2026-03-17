"use client";

import { supabase } from "@/lib/supabase";
import { useCallback, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  avatar_url: string;
  created_at: string;
}

export interface UserIngredient {
  id: string;
  name: string;
  unit: string;
  cost_per_unit: number;
  stock: number;
  is_custom: boolean;
}

export interface UserProduct {
  id: string;
  name: string;
  price: number;
  ingredients: any[];
  category: string;
  is_custom: boolean;
}

export interface UserEvent {
  id: string;
  name: string;
  event_date: string;
  location: string;
  total_income: number;
  total_cost: number;
  net_profit: number;
}

export interface UserData {
  profile: UserProfile;
  ingredients: UserIngredient[];
  products: UserProduct[];
  events: UserEvent[];
}

interface UseAdminDataReturn {
  loading: boolean;
  error: string | null;
  users: UserData[];
  fetchAllUsers: () => Promise<void>;
  baseIngredients: any[];
  baseProducts: any[];
  fetchBaseData: () => Promise<void>;
  addBaseIngredient: (name: string, unit: string, costPerUnit: number) => Promise<void>;
  addBaseProduct: (name: string, price: number, ingredients: any[]) => Promise<void>;
  deleteBaseIngredient: (id: string) => Promise<void>;
  deleteBaseProduct: (id: string) => Promise<void>;
}

export function useAdminData(): UseAdminDataReturn {
  const isAdmin = useAdminStore((s) => s.isAdmin);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [baseIngredients, setBaseIngredients] = useState<any[]>([]);
  const [baseProducts, setBaseProducts] = useState<any[]>([]);

  const fetchAllUsers = useCallback(async () => {
    if (!isAdmin) {
      setError("Acceso denegado: solo admin");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: profiles, error: profileError } = await supabase
        .from("perfiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profileError) throw profileError;

      const usersData: UserData[] = [];

      const profilesList = (profiles || []) as any[];

      for (const profile of profilesList) {
        const [ingRes, prodRes, evtRes] = await Promise.all([
          supabase.from("ingredientes_usuario").select("*").eq("user_id", profile.id),
          supabase.from("productos_usuario").select("*").eq("user_id", profile.id),
          supabase.from("eventos").select("*").eq("user_id", profile.id).order("event_date", { ascending: false }),
        ]);

        usersData.push({
          profile,
          ingredients: (ingRes.data || []).map((i: any) => ({
            id: i.id,
            name: i.name,
            unit: i.unit,
            cost_per_unit: i.cost_per_unit,
            stock: i.stock,
            is_custom: i.is_custom,
          })),
          products: (prodRes.data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            ingredients: p.ingredients,
            category: p.category,
            is_custom: p.is_custom,
          })),
          events: (evtRes.data || []).map((e: any) => ({
            id: e.id,
            name: e.name,
            event_date: e.event_date,
            location: e.location,
            total_income: e.total_income,
            total_cost: e.total_cost,
            net_profit: e.net_profit,
          })),
        });
      }

      setUsers(usersData);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, [supabase, isAdmin]);

  const fetchBaseData = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const [ingRes, prodRes] = await Promise.all([
        supabase.from("ingredientes_base").select("*").order("name"),
        supabase.from("productos_base").select("*").order("name"),
      ]);

      if (ingRes.data) setBaseIngredients(ingRes.data);
      if (prodRes.data) setBaseProducts(prodRes.data);
    } catch (err) {
      console.error("Error fetching base data:", err);
    }
  }, [supabase, isAdmin]);

  const addBaseIngredient = useCallback(async (name: string, unit: string, costPerUnit: number) => {
    try {
      const { error } = await supabase
        .from("ingredientes_base")
        .insert([{ name, unit, cost_per_unit: costPerUnit }] as any);

      if (error) throw error;
      await fetchBaseData();
    } catch (err) {
      console.error("Error adding base ingredient:", err);
      setError("Error al agregar ingrediente base");
    }
  }, [supabase, fetchBaseData]);

  const addBaseProduct = useCallback(async (name: string, price: number, ingredients: any[]) => {
    try {
      const { error } = await supabase
        .from("productos_base")
        .insert([{ name, price, ingredients }] as any);

      if (error) throw error;
      await fetchBaseData();
    } catch (err) {
      console.error("Error adding base product:", err);
      setError("Error al agregar producto base");
    }
  }, [supabase, fetchBaseData]);

  const deleteBaseIngredient = useCallback(async (id: string) => {
    if (!confirm("¿Eliminar este ingrediente base?")) return;
    try {
      const { error } = await supabase
        .from("ingredientes_base")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchBaseData();
    } catch (err) {
      console.error("Error deleting base ingredient:", err);
      setError("Error al eliminar");
    }
  }, [supabase, fetchBaseData]);

  const deleteBaseProduct = useCallback(async (id: string) => {
    if (!confirm("¿Eliminar este producto base?")) return;
    try {
      const { error } = await supabase
        .from("productos_base")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchBaseData();
    } catch (err) {
      console.error("Error deleting base product:", err);
      setError("Error al eliminar");
    }
  }, [supabase, fetchBaseData]);

  return {
    loading,
    error,
    users,
    fetchAllUsers,
    baseIngredients,
    baseProducts,
    fetchBaseData,
    addBaseIngredient,
    addBaseProduct,
    deleteBaseIngredient,
    deleteBaseProduct,
  };
}
