"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useUserData, type IngredientUser, type ProductUser } from "@/hooks/useUserData";
import { useAuth } from "@/hooks/useAuth";
import { 
  Package, Plus, Edit3, Save, X, Trash2, RefreshCw,
  ShoppingBag, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FlaskConical,
  Copy, Loader2
} from "lucide-react";

interface ProductIngredient { ingredient_id: string; quantity: number; unit: string; }

export function ProductManager() {
  const { user, loading: authLoading } = useAuth();
  const { 
    ingredientBase, 
    productBase,
    loading, 
    error,
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
  } = useUserData();

  const [activeSection, setActiveSection] = useState<"products" | "ingredients" | "precios">("products");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{type: "success" | "error", text: string} | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [newIngredient, setNewIngredient] = useState({ name: "", unit: "unidad", cost_per_unit: 0 });
  const [newProduct, setNewProduct] = useState({ name: "", type: "custom", variant: "", price: 0, ingredients: [] as ProductIngredient[] });
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>({});

  const allIngredients = useMemo(() => {
    return ingredientBase.map(base => {
      const userPrice = getIngredientPrice(base.id);
      return {
        ...base,
        cost_per_unit: userPrice || base.cost_per_unit,
        isBase: true,
        baseId: base.id,
      };
    });
  }, [ingredientBase, getIngredientPrice]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  useEffect(() => {
    const prices: Record<string, number> = {};
    ingredientBase.forEach(ing => {
      prices[ing.id] = getIngredientPrice(ing.id);
    });
    setEditingPrices(prices);
  }, [ingredientBase, getIngredientPrice]);

  const showMessage = (type: "success" | "error", text: string) => {
    setSyncMessage({ type, text });
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const handleSavePrice = async (ingredientBaseId: string) => {
    const newPrice = editingPrices[ingredientBaseId];
    if (newPrice === undefined) return;
    
    setSaving(true);
    try {
      await updatePrice(ingredientBaseId, newPrice);
      showMessage("success", "Precio actualizado");
    } catch (error) {
      showMessage("error", "Error al guardar precio");
    } finally {
      setSaving(false);
    }
  };

  const handleAddIngredient = async () => {
    if (!newIngredient.name.trim()) return;
    setSaving(true);
    try {
      const result = await addIngredientUser({
        name: newIngredient.name,
        unit: newIngredient.unit,
        cost_per_unit: newIngredient.cost_per_unit,
        stock: 0,
      });
      if (result) {
        setNewIngredient({ name: "", unit: "unidad", cost_per_unit: 0 });
        setShowAddForm(false);
        showMessage("success", "Ingrediente agregado");
      }
    } catch (error) {
      showMessage("error", "Error al agregar");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!confirm("¿Eliminar este ingrediente?")) return;
    try {
      await deleteIngredientUser(id);
      showMessage("success", "Ingrediente eliminado");
    } catch (error) {
      showMessage("error", "No se puede eliminar");
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) return;
    setSaving(true);
    try {
      const result = await addProductUser({
        name: newProduct.name,
        price: newProduct.price,
        ingredients: newProduct.ingredients,
        category: newProduct.type,
        variant: newProduct.variant,
      });
      if (result) {
        setNewProduct({ name: "", type: "custom", variant: "", price: 0, ingredients: [] });
        setShowProductForm(false);
        showMessage("success", "Producto agregado");
      }
    } catch (error) {
      showMessage("error", "Error al agregar");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProductUser(id);
      showMessage("success", "Producto eliminado");
    } catch (error) {
      showMessage("error", "No se puede eliminar");
    }
  };

  const addIngredientToProduct = () => {
    if (!selectedIngredient) return;
    const ing = allIngredients.find(i => i.baseId === selectedIngredient || i.id === selectedIngredient);
    if (!ing) return;
    setNewProduct(prev => ({ 
      ...prev, 
      ingredients: [...prev.ingredients, { 
        ingredient_id: ing.baseId || ing.id, 
        quantity: 1, 
        unit: ing.unit 
      }] 
    }));
    setSelectedIngredient("");
  };

  const removeIngredientFromProduct = (idx: number) => {
    setNewProduct(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== idx) }));
  };

  const handleCopyProductBase = async (baseId: string) => {
    setSaving(true);
    try {
      await copyProductBaseToUser(baseId);
      showMessage("success", "Producto copiado a tu cuenta");
    } catch (error) {
      showMessage("error", "Error al copiar");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wanda-pink/20 border-t-wanda-pink" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-cosmo-green" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-wanda-pink mb-4" />
        <p className="text-white/60">Debes iniciar sesión para gestionar productos</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wanda-pink/20 border-t-wanda-pink" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-cosmo-green" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {syncMessage && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg ${
          syncMessage.type === "success" ? "bg-cosmo-green text-black" : "bg-red-500 text-white"
        }`}>
          {syncMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {syncMessage.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Administración <span className="gradient-text-pink">Integral</span>
          </h2>
          <p className="text-sm text-white/40 mt-1">Gestiona tus productos, ingredientes y precios</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-black/40 rounded-xl w-fit">
        <button onClick={() => setActiveSection("products")} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${activeSection === "products" ? "bg-wanda-pink text-white" : "text-white/60 hover:text-white"}`}>
          <ShoppingBag className="w-4 h-4" /> Productos
        </button>
        <button onClick={() => setActiveSection("ingredients")} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${activeSection === "ingredients" ? "bg-wanda-pink text-white" : "text-white/60 hover:text-white"}`}>
          <Package className="w-4 h-4" /> Ingredientes
        </button>
        <button onClick={() => setActiveSection("precios")} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${activeSection === "precios" ? "bg-wanda-pink text-white" : "text-white/60 hover:text-white"}`}>
          <DollarSign className="w-4 h-4" /> Precios Base
        </button>
      </div>

      {activeSection === "precios" && (
        <div className="space-y-4">
          <p className="text-white/60 text-sm">Personaliza los precios de los ingredientes base para tu negocio</p>
          <div className="grid gap-3">
            {allIngredients.map((ing) => (
              <div key={ing.baseId} className="glass-card p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-bold text-white">{ing.name}</p>
                  <p className="text-xs text-white/40">{ing.unit} • Precio base: ${ing.cost_per_unit?.toLocaleString("es-CL")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40">$</span>
                  <input 
                    type="number" 
                    value={editingPrices[ing.baseId] ?? ing.cost_per_unit} 
                    onChange={(e) => setEditingPrices(prev => ({ ...prev, [ing.baseId]: parseFloat(e.target.value) || 0 }))}
                    className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white w-28"
                  />
                  <button 
                    onClick={() => handleSavePrice(ing.baseId)} 
                    disabled={saving}
                    className="p-2 bg-cosmo-green text-black rounded-xl hover:bg-[#69F0AE] disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "ingredients" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light">
              <Plus className="w-4 h-4" /> Nuevo Ingrediente
            </button>
          </div>

          {showAddForm && (
            <div className="glass-card p-4 space-y-4 border border-wanda-pink/50">
              <h3 className="font-bold text-white">Nuevo Ingrediente Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Nombre" value={newIngredient.name} onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white" />
                <select value={newIngredient.unit} onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white">
                  <option value="unidad">Unidad</option>
                  <option value="kg">Kilogramo</option>
                  <option value="gr">Gramo</option>
                  <option value="lt">Litro</option>
                  <option value="ml">Mililitro</option>
                </select>
                <input type="number" placeholder="Costo" value={newIngredient.cost_per_unit || ""} onChange={(e) => setNewIngredient({...newIngredient, cost_per_unit: parseFloat(e.target.value) || 0})} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white" />
                <div className="flex gap-2">
                  <button onClick={handleAddIngredient} disabled={saving || !newIngredient.name.trim()} className="flex-1 flex items-center justify-center gap-2 bg-cosmo-green text-black font-bold py-2 rounded-xl disabled:opacity-50">
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                  <button onClick={() => { setShowAddForm(false); setNewIngredient({ name: "", unit: "unidad", cost_per_unit: 0 }); }} className="px-4 py-2 bg-white/10 text-white rounded-xl">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3">
            {allIngredients.length === 0 ? (
              <div className="glass-card p-8 text-center text-white/40">
                No hay ingredientes disponibles
              </div>
            ) : (
              allIngredients.map((ing) => (
                <div key={ing.baseId || ing.id} className="glass-card p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-white">{ing.name}</p>
                    <p className="text-xs text-white/40">{ing.unit} • ${ing.cost_per_unit?.toLocaleString("es-CL")}</p>
                  </div>
                  {ing.isBase && (
                    <span className="text-xs bg-wanda-pink/20 text-wanda-pink px-2 py-1 rounded-lg">Base</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSection === "products" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowProductForm(true)} className="flex items-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light">
              <Plus className="w-4 h-4" /> Nuevo Producto
            </button>
          </div>

          {showProductForm && (
            <div className="glass-card p-4 space-y-4 border border-wanda-pink/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-wanda-pink" /> Nuevo Producto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input type="text" placeholder="Nombre (ej: Empanada)" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white lg:col-span-2" />
                <input type="number" placeholder="Precio" value={newProduct.price || ""} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white" />
                <div className="flex gap-2">
                  <button onClick={handleAddProduct} disabled={saving || !newProduct.name.trim()} className="flex-1 flex items-center justify-center gap-1 bg-cosmo-green text-black font-bold py-2 rounded-xl disabled:opacity-50">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setShowProductForm(false); setNewProduct({ name: "", type: "custom", variant: "", price: 0, ingredients: [] }); }} className="px-3 py-2 bg-white/10 text-white rounded-xl">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm font-bold text-white/70 mb-2">Ingredientes:</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {newProduct.ingredients.map((ing, idx) => {
                    const ingData = allIngredients.find(i => (i.baseId || i.id) === ing.ingredient_id);
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                        <span className="text-sm text-white">{ingData?.name}</span>
                        <input type="number" value={ing.quantity} onChange={(e) => {
                          const qty = parseFloat(e.target.value) || 0;
                          setNewProduct(prev => ({ ...prev, ingredients: prev.ingredients.map((i, iidx) => iidx === idx ? { ...i, quantity: qty } : i) }));
                        }} className="w-16 bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-sm" />
                        <span className="text-xs text-white/50">{ing.unit}</span>
                        <button onClick={() => removeIngredientFromProduct(idx)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3" /></button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <select value={selectedIngredient} onChange={(e) => setSelectedIngredient(e.target.value)} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white flex-1">
                    <option value="">Seleccionar...</option>
                    {allIngredients.map(ing => (<option key={ing.baseId || ing.id} value={ing.baseId || ing.id}>{ing.name} ({ing.unit})</option>))}
                  </select>
                  <button onClick={addIngredientToProduct} disabled={!selectedIngredient} className="px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl disabled:opacity-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Base - para copiar */}
          <div className="space-y-2">
            <h3 className="font-bold text-white/70 text-sm">Productos Base (haz clic para copiar a tu cuenta)</h3>
            <div className="grid gap-2">
              {productBase.map((prod) => (
                <div key={prod.id} className="glass-card p-3 flex items-center justify-between bg-wanda-pink/5 border border-wanda-pink/20">
                  <div className="flex-1">
                    <p className="font-bold text-white">{prod.name}</p>
                    <p className="text-xs text-white/40">${prod.price?.toLocaleString("es-CL")} • {prod.ingredients?.length || 0} ingredientes</p>
                  </div>
                  <button 
                    onClick={() => handleCopyProductBase(prod.id)} 
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 bg-wanda-pink/20 text-wanda-pink rounded-lg text-sm hover:bg-wanda-pink/30 disabled:opacity-50"
                  >
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DollarSign(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
