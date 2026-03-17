"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { INGREDIENTS as LOCAL_INGREDIENTS, PRODUCT_CATEGORIES, RECIPES } from "@/data/recipes";
import { 
  Package, Plus, Edit3, Save, X, Trash2, RefreshCw,
  ShoppingBag, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FlaskConical
} from "lucide-react";

interface IngredientDB { id: string; name: string; unit: string; cost_per_unit: number; stock: number; }
interface ProductIngredient { ingredient_id: string; quantity: number; unit: string; }
interface ProductDB { id: string; name: string; type: string; variant: string; price: number; ingredients: ProductIngredient[]; }

export function ProductManager() {
  const [activeSection, setActiveSection] = useState<"products" | "ingredients">("products");
  const [ingredients, setIngredients] = useState<IngredientDB[]>([]);
  const [products, setProducts] = useState<ProductDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{type: "success" | "error", text: string} | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [newIngredient, setNewIngredient] = useState({ name: "", unit: "unit", cost_per_unit: 0 });
  const [newProduct, setNewProduct] = useState({ name: "", type: "custom", variant: "", price: 0, ingredients: [] as ProductIngredient[] });
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ingRes, prodRes] = await Promise.all([
        supabase.from("ingredientes").select("*").order("name"),
        supabase.from("productos").select("*").order("name")
      ]);

      if (ingRes.data) setIngredients(ingRes.data);
      if (prodRes.data) {
        const formatted = prodRes.data.map((p: any) => {
          const ingArr = Array.isArray(p.ingredients) ? p.ingredients : [];
          const converted = ingArr.map((ing: any) => {
            if (ing.unit === 'kg') {
              return { ...ing, unit: 'grams', quantity: ing.quantity * 1000 };
            }
            return ing;
          });
          return { ...p, ingredients: converted };
        });
        setProducts(formatted);
        
        // Save converted to DB
        for (const p of formatted) {
          const original = prodRes.data.find((o: any) => o.id === p.id);
          if (original && JSON.stringify((original as any).ingredients) !== JSON.stringify(p.ingredients)) {
            await (supabase.from("productos") as any).update({ ingredients: p.ingredients }).eq("id", p.id);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showMessage = (type: "success" | "error", text: string) => {
    setSyncMessage({ type, text });
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const handleSaveIngredient = async (ing: IngredientDB) => {
    setSaving(true);
    try {
      const { error } = await (supabase.from("ingredientes") as any)
        .update({ name: ing.name, unit: ing.unit, cost_per_unit: ing.cost_per_unit, stock: ing.stock })
        .eq("id", ing.id);
      if (error) throw error;
      setIngredients(prev => prev.map(i => i.id === ing.id ? ing : i));
      setEditingId(null);
      showMessage("success", "Ingrediente actualizado");
    } catch (error) { showMessage("error", "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleAddIngredient = async () => {
    if (!newIngredient.name.trim()) return;
    setSaving(true);
    try {
      const { data, error } = await (supabase.from("ingredientes") as any)
        .insert([{ name: newIngredient.name, unit: newIngredient.unit, cost_per_unit: newIngredient.cost_per_unit, stock: 0 }])
        .select().single();
      if (error) throw error;
      if (data) setIngredients(prev => [...prev, data]);
      setNewIngredient({ name: "", unit: "unit", cost_per_unit: 0 });
      setShowAddForm(false);
      showMessage("success", "Ingrediente agregado");
    } catch (error) { showMessage("error", "Error al agregar"); }
    finally { setSaving(false); }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!confirm("¿Eliminar este ingrediente?")) return;
    try {
      const { error } = await (supabase.from("ingredientes") as any).delete().eq("id", id);
      if (error) throw error;
      setIngredients(prev => prev.filter(i => i.id !== id));
      showMessage("success", "Ingrediente eliminado");
    } catch (error) { showMessage("error", "No se puede eliminar"); }
  };

  const handleSaveProduct = async (prod: ProductDB) => {
    setSaving(true);
    try {
      const { error } = await (supabase.from("productos") as any)
        .update({ name: prod.name, price: prod.price, ingredients: prod.ingredients })
        .eq("id", prod.id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === prod.id ? prod : p));
      setEditingId(null);
      showMessage("success", "Producto actualizado");
    } catch (error) { showMessage("error", "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) return;
    setSaving(true);
    try {
      const { data, error } = await (supabase.from("productos") as any)
        .insert([{ name: newProduct.name, type: newProduct.type, variant: newProduct.variant, price: newProduct.price, ingredients: newProduct.ingredients }])
        .select().single();
      if (error) throw error;
      if (data) setProducts(prev => [...prev, { ...data, ingredients: newProduct.ingredients }]);
      setNewProduct({ name: "", type: "custom", variant: "", price: 0, ingredients: [] });
      setShowProductForm(false);
      showMessage("success", "Producto agregado");
    } catch (error) { showMessage("error", "Error al agregar"); }
    finally { setSaving(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      const { error } = await (supabase.from("productos") as any).delete().eq("id", id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      showMessage("success", "Producto eliminado");
    } catch (error) { showMessage("error", "No se puede eliminar"); }
  };

  const addIngredientToProduct = () => {
    if (!selectedIngredient) return;
    const ing = ingredients.find(i => i.id === selectedIngredient);
    if (!ing) return;
    setNewProduct(prev => ({ ...prev, ingredients: [...prev.ingredients, { ingredient_id: ing.id, quantity: 1, unit: ing.unit === 'kg' ? 'grams' : ing.unit }] }));
    setSelectedIngredient("");
  };

  const removeIngredientFromProduct = (idx: number) => {
    setNewProduct(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== idx) }));
  };

  const addIngredientToEditingProduct = (prodId: string) => {
    if (!selectedIngredient) return;
    const ing = ingredients.find(i => i.id === selectedIngredient);
    if (!ing) return;
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        return { ...p, ingredients: [...p.ingredients, { ingredient_id: ing.id, quantity: 1, unit: ing.unit === 'kg' ? 'grams' : ing.unit }] };
      }
      return p;
    }));
    setSelectedIngredient("");
  };

  const removeIngredientFromEditingProduct = (prodId: string, idx: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) return { ...p, ingredients: p.ingredients.filter((_, i) => i !== idx) };
      return p;
    }));
  };

  const updateIngredientInProduct = (prodId: string, idx: number, field: string, value: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        const newIngredients = [...p.ingredients];
        newIngredients[idx] = { ...newIngredients[idx], [field]: value };
        return { ...p, ingredients: newIngredients };
      }
      return p;
    }));
  };

  const syncFromRecipes = async () => {
    setSaving(true);
    try {
      for (const ing of LOCAL_INGREDIENTS) {
        const existing = ingredients.find(i => i.name === ing.name);
        if (!existing) {
          await (supabase.from("ingredientes") as any).insert([{
            name: ing.name, unit: ing.defaultUnit === 'units' ? 'unit' : 'grams', cost_per_unit: 0, stock: 0
          }]);
        }
      }

      const { data: ingData } = await supabase.from("ingredientes").select("*");
      if (ingData) setIngredients(ingData);

      let productsCreated = 0;
      for (const cat of PRODUCT_CATEGORIES) {
        for (const variant of cat.variants) {
          const prodName = `${cat.label} ${variant.label}`;
          const existingProd = products.find(p => p.name === prodName);
          if (!existingProd) {
            const recipe = RECIPES.find(r => r.product === cat.type && r.variant === variant.key);
            const ingredientsArray: ProductIngredient[] = [];
            if (recipe) {
              recipe.ingredients.forEach(ing => {
                const localIng = LOCAL_INGREDIENTS.find(li => li.id === ing.id);
                ingredientsArray.push({
                  ingredient_id: ing.id,
                  quantity: ing.units || ing.grams || 1,
                  unit: localIng?.defaultUnit === 'units' ? 'unit' : 'grams'
                });
              });
            }
            const { error } = await (supabase.from("productos") as any).insert([{
              name: prodName, type: cat.type, variant: variant.key, price: 0, ingredients: ingredientsArray
            }]);
            if (!error) productsCreated++;
          }
        }
      }
      await loadData();
      showMessage("success", `Sincronizado: ${productsCreated} productos`);
    } catch (error) { showMessage("error", "Error al sincronizar"); }
    finally { setSaving(false); }
  };

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
          <p className="text-sm text-white/40 mt-1">Gestiona productos, ingredientes y recetas</p>
        </div>
        <button onClick={syncFromRecipes} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-cosmo-green text-black font-bold rounded-xl hover:bg-[#69F0AE] disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
          Sincronizar
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-black/40 rounded-xl w-fit">
        <button onClick={() => setActiveSection("products")} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${activeSection === "products" ? "bg-wanda-pink text-white" : "text-white/60 hover:text-white"}`}>
          <ShoppingBag className="w-4 h-4" /> Productos
        </button>
        <button onClick={() => setActiveSection("ingredients")} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${activeSection === "ingredients" ? "bg-wanda-pink text-white" : "text-white/60 hover:text-white"}`}>
          <Package className="w-4 h-4" /> Ingredientes
        </button>
      </div>

      {activeSection === "ingredients" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light">
              <Plus className="w-4 h-4" /> Nuevo Ingrediente
            </button>
          </div>

          {showAddForm && (
            <div className="glass-card p-4 space-y-4 border border-wanda-pink/50">
              <h3 className="font-bold text-white">Nuevo Ingrediente</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Nombre" value={newIngredient.name} onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white" />
                <select value={newIngredient.unit} onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white">
                  <option value="unit">Unidad</option>
                  <option value="grams">Gramos</option>
                  <option value="lt">Litro</option>
                </select>
                <input type="number" placeholder="Costo" value={newIngredient.cost_per_unit || ""} onChange={(e) => setNewIngredient({...newIngredient, cost_per_unit: parseFloat(e.target.value) || 0})} className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white" />
                <div className="flex gap-2">
                  <button onClick={handleAddIngredient} disabled={saving || !newIngredient.name.trim()} className="flex-1 flex items-center justify-center gap-2 bg-cosmo-green text-black font-bold py-2 rounded-xl disabled:opacity-50">
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                  <button onClick={() => { setShowAddForm(false); setNewIngredient({ name: "", unit: "unit", cost_per_unit: 0 }); }} className="px-4 py-2 bg-white/10 text-white rounded-xl">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3">
            {ingredients.map((ing) => (
              <div key={ing.id} className="glass-card p-4 flex items-center justify-between gap-4">
                {editingId === ing.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input type="text" value={ing.name} onChange={(e) => setIngredients(prev => prev.map(i => i.id === ing.id ? {...i, name: e.target.value} : i))} className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white" />
                    <select value={ing.unit} onChange={(e) => setIngredients(prev => prev.map(i => i.id === ing.id ? {...i, unit: e.target.value} : i))} className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white">
                      <option value="unit">Unidad</option>
                      <option value="grams">Gramos</option>
                      <option value="lt">Litro</option>
                    </select>
                    <input type="number" value={ing.cost_per_unit} onChange={(e) => setIngredients(prev => prev.map(i => i.id === ing.id ? {...i, cost_per_unit: parseFloat(e.target.value) || 0} : i))} className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white" />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveIngredient(ing)} disabled={saving} className="flex-1 flex items-center justify-center gap-1 bg-cosmo-green text-black font-bold py-2 rounded-xl">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-2 bg-white/10 text-white rounded-xl">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-bold text-white">{ing.name}</p>
                      <p className="text-xs text-white/40">{ing.unit} • ${ing.cost_per_unit?.toLocaleString("es-CL")} • Stock: {ing.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(ing.id)} className="p-2 text-white/60 hover:text-wanda-pink"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteIngredient(ing.id)} className="p-2 text-white/60 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
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
                    const ingData = ingredients.find(i => i.id === ing.ingredient_id);
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
                    {ingredients.map(ing => (<option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>))}
                  </select>
                  <button onClick={addIngredientToProduct} disabled={!selectedIngredient} className="px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl disabled:opacity-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto text-white/20 mb-4" />
              <p className="text-white/60 mb-4">No hay productos</p>
              <button onClick={syncFromRecipes} className="px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl">Sincronizar</button>
            </div>
          ) : (
            <div className="grid gap-3">
              {products.map((prod) => (
                <div key={prod.id} className="glass-card overflow-hidden">
                  <div className="p-4 flex items-center justify-between gap-4">
                    {editingId === prod.id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" value={prod.name} onChange={(e) => setProducts(prev => prev.map(p => p.id === prod.id ? {...p, name: e.target.value} : p))} className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white" />
                        <input type="number" value={prod.price} onChange={(e) => setProducts(prev => prev.map(p => p.id === prod.id ? {...p, price: parseFloat(e.target.value) || 0} : p))} className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white" />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveProduct(prod)} disabled={saving} className="flex-1 flex items-center justify-center gap-1 bg-cosmo-green text-black font-bold py-2 rounded-xl">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="px-3 py-2 bg-white/10 text-white rounded-xl"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="font-bold text-white">{prod.name}</p>
                          <p className="text-xs text-white/40">${prod.price?.toLocaleString("es-CL")} • {prod.ingredients?.length || 0} ingrediente(s)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setExpandedProduct(expandedProduct === prod.id ? null : prod.id)} className="p-2 text-white/60 hover:text-wanda-pink">
                            {expandedProduct === prod.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setEditingId(prod.id)} className="p-2 text-white/60 hover:text-wanda-pink"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 text-white/60 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </>
                    )}
                  </div>

                  {expandedProduct === prod.id && !editingId && (
                    <div className="p-4 bg-black/20 border-t border-white/5">
                      <p className="text-sm font-bold text-white/70 mb-2">Ingredientes:</p>
                      {prod.ingredients && prod.ingredients.length > 0 ? (
                        <div className="space-y-2">
                          {prod.ingredients.map((ing, idx) => {
                            const ingData = ingredients.find(i => i.id === ing.ingredient_id);
                            return (
                              <div key={idx} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
                                <span className="text-sm text-white">{ingData?.name || ing.ingredient_id}</span>
                                <span className="text-sm text-cosmo-green">{ing.quantity} {ing.unit}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (<p className="text-sm text-white/40">Sin ingredientes</p>)}
                    </div>
                  )}

                  {editingId === prod.id && (
                    <div className="p-4 bg-black/20 border-t border-white/5">
                      <p className="text-sm font-bold text-white/70 mb-2">Ingredientes:</p>
                      {prod.ingredients && prod.ingredients.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {prod.ingredients.map((ing, idx) => {
                            const ingData = ingredients.find(i => i.id === ing.ingredient_id);
                            return (
                              <div key={idx} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                                <span className="text-sm text-white flex-1">{ingData?.name || ing.ingredient_id}</span>
                                <input type="number" value={ing.quantity} onChange={(e) => updateIngredientInProduct(prod.id, idx, 'quantity', parseFloat(e.target.value) || 0)} className="w-16 bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-sm" />
                                <span className="text-xs text-white/50">{ing.unit}</span>
                                <button onClick={() => removeIngredientFromEditingProduct(prod.id, idx)} className="text-red-400"><X className="w-3 h-3" /></button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (<p className="text-sm text-white/40 mb-3">Sin ingredientes</p>)}
                      <div className="flex gap-2">
                        <select value={selectedIngredient} onChange={(e) => setSelectedIngredient(e.target.value)} className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white text-sm flex-1">
                          <option value="">Agregar...</option>
                          {ingredients.map(ing => (<option key={ing.id} value={ing.id}>{ing.name}</option>))}
                        </select>
                        <button onClick={() => addIngredientToEditingProduct(prod.id)} disabled={!selectedIngredient} className="px-3 py-2 bg-wanda-pink text-white rounded-lg disabled:opacity-50">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
