"use client";

import { supabase } from "@/lib/supabase";
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@supabase/supabase-js";

export interface IngredientBase {
  id: string;
  name: string;
  unit: string;
  cost_per_unit: number;
}

export interface ProductBase {
  id: string;
  name: string;
  price: number;
  ingredients: any[];
  category: string;
  variant: string;
}

export interface IngredientUser {
  id: string;
  user_id: string;
  ingredient_base_id: string | null;
  name: string;
  unit: string;
  cost_per_unit: number;
  stock: number;
  is_custom: boolean;
}

export interface ProductUser {
  id: string;
  user_id: string;
  product_base_id: string | null;
  name: string;
  price: number;
  ingredients: any[];
  category: string;
  variant: string;
  is_custom: boolean;
}

export interface UserPrices {
  ingredient_base_id: string;
  cost_per_unit: number;
}

interface UseUserDataReturn {
  loading: boolean;
  error: string | null;
  ingredientBase: IngredientBase[];
  productBase: ProductBase[];
  ingredientUser: IngredientUser[];
  productUser: ProductUser[];
  userPrices: UserPrices[];
  fetchBaseData: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  addIngredientUser: (ingredient: Partial<IngredientUser>) => Promise<IngredientUser | null>;
  updateIngredientUser: (id: string, data: Partial<IngredientUser>) => Promise<void>;
  deleteIngredientUser: (id: string) => Promise<void>;
  addProductUser: (product: Partial<ProductUser>) => Promise<ProductUser | null>;
  updateProductUser: (id: string, data: Partial<ProductUser>) => Promise<void>;
  deleteProductUser: (id: string) => Promise<void>;
  copyProductBaseToUser: (productBaseId: string) => Promise<void>;
  updatePrice: (ingredientBaseId: string, costPerUnit: number) => Promise<void>;
  getIngredientPrice: (ingredientBaseId: string) => number;
}

export function useUserData(): UseUserDataReturn {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ingredientBase, setIngredientBase] = useState<IngredientBase[]>([]);
  const [productBase, setProductBase] = useState<ProductBase[]>([]);
  const [ingredientUser, setIngredientUser] = useState<IngredientUser[]>([]);
  const [productUser, setProductUser] = useState<ProductUser[]>([]);
  const [userPrices, setUserPrices] = useState<UserPrices[]>([]);

  const fetchBaseData = useCallback(async () => {
    try {
      const [ingRes, prodRes] = await Promise.all([
        supabase.from("ingredientes_base").select("*").order("name"),
        supabase.from("productos_base").select("*").order("name"),
      ]);

      if (ingRes.data) setIngredientBase(ingRes.data);
      if (prodRes.data) setProductBase(prodRes.data);
    } catch (err) {
      console.error("Error fetching base data:", err);
      setError("Error al cargar datos base");
    }
  }, [supabase]);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [ingRes, prodRes, pricesRes] = await Promise.all([
        supabase.from("ingredientes_usuario").select("*").eq("user_id", user.id).order("name"),
        supabase.from("productos_usuario").select("*").eq("user_id", user.id).order("name"),
        supabase.from("precios_usuario").select("*").eq("user_id", user.id),
      ]);

      if (ingRes.data) setIngredientUser(ingRes.data);
      if (prodRes.data) setProductUser(prodRes.data);
      if (pricesRes.data) setUserPrices(pricesRes.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error al cargar tus datos");
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchBaseData(), fetchUserData()]);
    setLoading(false);
  }, [fetchBaseData, fetchUserData]);

  const addIngredientUser = useCallback(async (ingredient: Partial<IngredientUser>): Promise<IngredientUser | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("ingredientes_usuario")
        .insert([{
          user_id: user.id,
          name: ingredient.name,
          unit: ingredient.unit,
          cost_per_unit: ingredient.cost_per_unit || 0,
          stock: ingredient.stock || 0,
          ingredient_base_id: ingredient.ingredient_base_id,
          is_custom: !ingredient.ingredient_base_id,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setIngredientUser(prev => [...prev, data]);
      }
      return data;
    } catch (err) {
      console.error("Error adding ingredient:", err);
      setError("Error al agregar ingrediente");
      return null;
    }
  }, [supabase, user]);

  const updateIngredientUser = useCallback(async (id: string, data: Partial<IngredientUser>) => {
    try {
      const { error } = await supabase
        .from("ingredientes_usuario")
        .update(data as any)
        .eq("id", id);

      if (error) throw error;
      setIngredientUser(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    } catch (err) {
      console.error("Error updating ingredient:", err);
      setError("Error al actualizar ingrediente");
    }
  }, [supabase]);

  const deleteIngredientUser = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("ingredientes_usuario")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setIngredientUser(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error("Error deleting ingredient:", err);
      setError("Error al eliminar ingrediente");
    }
  }, [supabase]);

  const addProductUser = useCallback(async (product: Partial<ProductUser>): Promise<ProductUser | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("productos_usuario")
        .insert([{
          user_id: user.id,
          name: product.name,
          price: product.price || 0,
          ingredients: product.ingredients || [],
          category: product.category || 'custom',
          variant: product.variant || '',
          product_base_id: product.product_base_id,
          is_custom: !product.product_base_id,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProductUser(prev => [...prev, data]);
      }
      return data;
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Error al agregar producto");
      return null;
    }
  }, [supabase, user]);

  const updateProductUser = useCallback(async (id: string, data: Partial<ProductUser>) => {
    try {
      const { error } = await supabase
        .from("productos_usuario")
        .update(data)
        .eq("id", id);

      if (error) throw error;
      setProductUser(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Error al actualizar producto");
    }
  }, [supabase]);

  const deleteProductUser = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("productos_usuario")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setProductUser(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Error al eliminar producto");
    }
  }, [supabase]);

  const copyProductBaseToUser = useCallback(async (productBaseId: string) => {
    if (!user) return;
    
    try {
      const baseProduct = productBase.find(p => p.id === productBaseId);
      if (!baseProduct) return;

      await addProductUser({
        name: baseProduct.name,
        price: baseProduct.price,
        ingredients: baseProduct.ingredients,
        category: baseProduct.category,
        variant: baseProduct.variant,
        product_base_id: baseProduct.id,
      });
    } catch (err) {
      console.error("Error copying product:", err);
      setError("Error al copiar producto");
    }
  }, [supabase, user, productBase, addProductUser]);

  const updatePrice = useCallback(async (ingredientBaseId: string, costPerUnit: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("precios_usuario")
        .upsert({
          user_id: user.id,
          ingredient_base_id: ingredientBaseId,
          cost_per_unit: costPerUnit,
        }, {
          onConflict: 'user_id,ingredient_base_id'
        });

      if (error) throw error;
      
      setUserPrices(prev => {
        const exists = prev.find(p => p.ingredient_base_id === ingredientBaseId);
        if (exists) {
          return prev.map(p => p.ingredient_base_id === ingredientBaseId ? { ...p, cost_per_unit: costPerUnit } : p);
        }
        return [...prev, { ingredient_base_id: ingredientBaseId, cost_per_unit: costPerUnit }];
      });
    } catch (err) {
      console.error("Error updating price:", err);
      setError("Error al actualizar precio");
    }
  }, [supabase, user]);

  const getIngredientPrice = useCallback((ingredientBaseId: string): number => {
    const userPrice = userPrices.find(p => p.ingredient_base_id === ingredientBaseId);
    if (userPrice) return userPrice.cost_per_unit;
    
    const baseIngredient = ingredientBase.find(i => i.id === ingredientBaseId);
    return baseIngredient?.cost_per_unit || 0;
  }, [userPrices, ingredientBase]);

  return {
    loading,
    error,
    ingredientBase,
    productBase,
    ingredientUser,
    productUser,
    userPrices,
    fetchBaseData,
    fetchUserData,
    fetchAllData,
    addIngredientUser,
    updateIngredientUser,
    deleteIngredientUser,
    addProductUser,
    updateProductUser,
    deleteProductUser,
    copyProductBaseToUser,
    updatePrice,
    getIngredientPrice,
  };
}
