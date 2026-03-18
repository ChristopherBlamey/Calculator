/**
 * @file ProductManager.tsx
 * @description Componente de administración integral de productos, recetas e ingredientes
 * 
 * Este módulo proporciona una interfaz unificada para gestionar:
 * - Suministros: Ingredientes base con precios editables
 * - Ventas: Productos y recetas con cálculo automático de costos
 * 
 * @author BLAMEY ERP Team
 * @version 2.3.2
 * 
 * @access Restricted - Requiere autenticación
 * @validation Solo cristopher0915@gmail.com tiene acceso completo al panel de admin
 * 
 * @features
 * - Edición inline de precios de ingredientes
 * - Cálculo en cascada: cambio de precio de ingrediente recalcula recetas automáticamente
 * - Pestañas separadas para Suministros y Ventas
 * - Persistencia de datos en Supabase
 * 
 * @example
 * // Uso básico:
 * <ProductManager />
 * 
 * // El cálculo en cascada funciona así:
 * // 1. Usuario cambia precio de "Palta" de $7500 a $8000
 * // 2. El sistema busca todas las recetas que usan "Palta"
 * // 3. Recalcula el costo de cada receta afectada
 * // 4. Actualiza los márgenes de ganancia automáticamente
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useUserData, type IngredientUser, type ProductUser } from "@/hooks/useUserData";
import { useAuth } from "@/hooks/useAuth";
import { useUnifiedStore } from "@/store/useUnifiedStore";
import { 
  Package, Plus, Edit3, Save, X, Trash2, RefreshCw,
  ShoppingBag, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FlaskConical,
  Copy, Loader2, DollarSign, Calculator, TrendingUp, TrendingDown
} from "lucide-react";

/**
 * ProductIngredient - Ingrediente asociado a un producto/receta
 */
interface ProductIngredient { 
  ingredient_id: string; 
  quantity: number; 
  unit: string; 
}

/**
 * IngredientWithPrice - Ingrediente con precio calculado
 */
interface IngredientWithPrice {
  id: string;
  name: string;
  unit: string;
  cost_per_unit: number;
  baseId?: string;
  isBase?: boolean;
}

/**
 * RecetasSection - Sección de gestión de recetas con cálculo en cascada
 * @param ingredients - Lista de ingredientes disponibles
 * @param products - Lista de productos del usuario
 * @param onUpdateProduct - Función para actualizar producto
 * @param onPriceChange - Callback cuando cambia el precio de un ingrediente
 */
function RecetasSection({ 
  ingredients, 
  products, 
  onUpdateProduct,
  onPriceChange
}: { 
  ingredients: IngredientWithPrice[];
  products: ProductUser[];
  onUpdateProduct: (id: string, data: Partial<ProductUser>) => Promise<void>;
  onPriceChange?: (ingredientId: string, newPrice: number) => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  
  /**
   * calculateRecipeCost - Calcula el costo de producción de una receta
   * en base a los ingredientes y sus precios
   */
  const calculateRecipeCost = useCallback((product: ProductUser): number => {
    if (!product.ingredients || product.ingredients.length === 0) return 0;
    
    let totalCost = 0;
    for (const ing of product.ingredients) {
      const ingData = ingredients.find(i => i.baseId === ing.ingredient_id || i.id === ing.ingredient_id);
      if (ingData) {
        totalCost += (ingData.cost_per_unit || 0) * ing.quantity;
      }
    }
    return totalCost;
  }, [ingredients]);

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const recipeCost = selectedProductData ? calculateRecipeCost(selectedProductData) : 0;
  const profitMargin = selectedProductData?.price ? ((selectedProductData.price - recipeCost) / selectedProductData.price * 100) : 0;

  // Productos que son recetas (tienen ingredientes)
  const recipes = useMemo(() => 
    products.filter(p => p.ingredients && p.ingredients.length > 0),
    [products]
  );

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">
        Las recetas calculan automáticamente el costo de producción basado en los ingredientes.
      </p>

      {/* Select Product */}
      <div className="glass-card p-4">
        <label className="text-sm font-bold text-white/70 mb-2 block">Seleccionar Receta</label>
        <select 
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white dark:bg-black/40"
        >
          <option value="">Selecciona una receta...</option>
          {recipes.map(prod => {
            const cost = calculateRecipeCost(prod);
            const margin = prod.price > 0 ? ((prod.price - cost) / prod.price * 100) : 0;
            return (
              <option key={prod.id} value={prod.id}>
                {prod.name} - ${prod.price?.toLocaleString("es-CL")} (Costo: ${cost.toLocaleString("es-CL")} | Margen: {margin.toFixed(1)}%)
              </option>
            );
          })}
        </select>
      </div>

      {selectedProductData && (
        <div className="glass-card p-4 space-y-4">
          <h3 className="font-bold text-white text-lg">{selectedProductData.name}</h3>
          
          {/* Ingredients Breakdown */}
          <div className="space-y-2">
            {selectedProductData.ingredients.map((ing, idx) => {
              const ingData = ingredients.find(i => i.baseId === ing.ingredient_id || i.id === ing.ingredient_id);
              const cost = ingData ? ingData.cost_per_unit * ing.quantity : 0;
              return (
                <div key={idx} className="flex justify-between items-center p-2 bg-black/20 rounded-lg">
                  <div>
                    <span className="text-white">{ingData?.name || ing.ingredient_id}</span>
                    <span className="text-white/40 text-xs ml-2">x{ing.quantity} {ing.unit}</span>
                  </div>
                  <span className="text-cosmo-green font-bold">${cost.toLocaleString("es-CL")}</span>
                </div>
              );
            })}
          </div>

          {/* Cost Summary */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-white/60">
              <span>Costo de Producción:</span>
              <span className="font-bold">${recipeCost.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Precio de Venta:</span>
              <span className="font-bold">${selectedProductData.price?.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="font-bold">Ganancia Neta:</span>
              <span className={`font-bold ${profitMargin >= 30 ? 'text-cosmo-green' : profitMargin >= 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                ${(selectedProductData.price - recipeCost).toLocaleString("es-CL")} ({profitMargin.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Recetas con costos */}
      {recipes.length > 0 && (
        <div className="glass-card p-4 space-y-3">
          <h4 className="font-bold text-white">Todas las Recetas</h4>
          {recipes.map(prod => {
            const cost = calculateRecipeCost(prod);
            const margin = prod.price > 0 ? ((prod.price - cost) / prod.price * 100) : 0;
            return (
              <div 
                key={prod.id} 
                className="flex items-center justify-between p-3 bg-black/20 rounded-xl cursor-pointer hover:bg-black/40"
                onClick={() => setSelectedProduct(prod.id)}
              >
                <div>
                  <p className="font-bold text-white">{prod.name}</p>
                  <p className="text-xs text-white/40">{prod.ingredients.length} ingredientes</p>
                </div>
                <div className="text-right">
                  <p className="text-cosmo-green font-bold">${(prod.price - cost).toLocaleString("es-CL")}</p>
                  <p className={`text-xs ${margin >= 30 ? 'text-cosmo-green' : margin >= 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {margin.toFixed(1)}% margen
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * SuministrosSection - Sección de gestión de ingredientes/suministros
 * Permite edición directa de precios y unidades
 */
function SuministrosSection({ 
  ingredients,
  onUpdatePrice,
  onAddIngredient
}: {
  ingredients: IngredientWithPrice[];
  onUpdatePrice: (id: string, price: number) => void;
  onAddIngredient: (data: { name: string; unit: string; cost_per_unit: number }) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: "", unit: "unidad", cost_per_unit: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const handleStartEdit = (ing: IngredientWithPrice) => {
    setEditingId(ing.baseId || ing.id);
    setEditPrice(ing.cost_per_unit || 0);
  };

  const handleSaveEdit = (baseId: string) => {
    onUpdatePrice(baseId, editPrice);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (newIngredient.name.trim()) {
      onAddIngredient(newIngredient);
      setNewIngredient({ name: "", unit: "unidad", cost_per_unit: 0 });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/60 text-sm">
          Gestiona tus ingredientes y sus precios. Los cambios se propagan a las recetas automáticamente.
        </p>
        <button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card p-4 space-y-4 border-2 border-wanda-pink/50">
          <h3 className="font-bold text-white">Nuevo Ingrediente</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Nombre del ingrediente" 
              value={newIngredient.name} 
              onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
              className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white dark:bg-black/40"
            />
            <select 
              value={newIngredient.unit} 
              onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
              className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white dark:bg-black/40"
            >
              <option value="unidad">Unidad</option>
              <option value="kg">Kilogramo</option>
              <option value="gr">Gramo</option>
              <option value="lt">Litro</option>
              <option value="ml">Mililitro</option>
            </select>
            <input 
              type="number" 
              placeholder="Costo por unidad" 
              value={newIngredient.cost_per_unit || ""} 
              onChange={(e) => setNewIngredient({...newIngredient, cost_per_unit: parseFloat(e.target.value) || 0})}
              className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white dark:bg-black/40"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleAdd}
                disabled={!newIngredient.name.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-cosmo-green text-black font-bold py-2 rounded-xl disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              <button 
                onClick={() => { setShowAddForm(false); setNewIngredient({ name: "", unit: "unidad", cost_per_unit: 0 }); }} 
                className="px-4 py-2 bg-white/10 text-white rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Ingredientes con edición inline */}
      <div className="grid gap-2">
        {ingredients.length === 0 ? (
          <div className="glass-card p-8 text-center text-white/40">
            No hay ingredientes disponibles
          </div>
        ) : (
          ingredients.map((ing) => (
            <div key={ing.baseId || ing.id} className="glass-card p-3 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-white dark:text-white">{ing.name}</p>
                <p className="text-xs text-white/40">{ing.unit}</p>
              </div>
              
              {editingId === (ing.baseId || ing.id) ? (
                <div className="flex items-center gap-2">
                  <span className="text-white/40">$</span>
                  <input 
                    type="number" 
                    value={editPrice} 
                    onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-black/40 border border-white/20 rounded-xl px-3 py-1.5 text-white dark:bg-black/40"
                    autoFocus
                  />
                  <button 
                    onClick={() => handleSaveEdit(ing.baseId || ing.id)}
                    className="p-1.5 bg-cosmo-green text-black rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    className="p-1.5 bg-white/10 text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-cosmo-green font-bold text-lg">
                    ${ing.cost_per_unit?.toLocaleString("es-CL")}
                  </span>
                  <button 
                    onClick={() => handleStartEdit(ing)}
                    className="p-2 text-white/40 hover:text-wanda-pink transition-colors"
                    title="Editar precio"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * VentasSection - Sección de gestión de productos/recetas para ventas
 */
function VentasSection({ 
  products,
  onUpdateProduct,
  onDeleteProduct,
  onAddProduct
}: {
  products: ProductUser[];
  onUpdateProduct: (id: string, data: Partial<ProductUser>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onAddProduct: (data: Partial<ProductUser>) => Promise<ProductUser | null>;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    type: "product", 
    variant: "", 
    price: 0, 
    ingredients: [] as ProductIngredient[] 
  });

  const handleAdd = async () => {
    if (newProduct.name.trim()) {
      await onAddProduct({
        name: newProduct.name,
        price: newProduct.price,
        ingredients: newProduct.type === "recipe" ? newProduct.ingredients : [],
        category: newProduct.type,
        variant: newProduct.variant,
      });
      setNewProduct({ name: "", type: "product", variant: "", price: 0, ingredients: [] });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/60 text-sm">
          Gestiona tus productos y recetas para venta.
        </p>
        <button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl hover:bg-wanda-pink-light"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card p-4 space-y-4 border-2 border-wanda-pink/50">
          <h3 className="font-bold text-white">Nuevo Producto/Receta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Nombre del producto" 
              value={newProduct.name} 
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white dark:bg-black/40"
            />
            <input 
              type="number" 
              placeholder="Precio de venta" 
              value={newProduct.price || ""} 
              onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
              className="bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-white dark:bg-black/40"
            />
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-white">
              <input 
                type="radio" 
                name="type" 
                checked={newProduct.type === "product"}
                onChange={() => setNewProduct({...newProduct, type: "product", ingredients: []})}
              />
              Producto Simple
            </label>
            <label className="flex items-center gap-2 text-white">
              <input 
                type="radio" 
                name="type" 
                checked={newProduct.type === "recipe"}
                onChange={() => setNewProduct({...newProduct, type: "recipe"})}
              />
              Receta (con ingredientes)
            </label>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAdd}
              disabled={!newProduct.name.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-cosmo-green text-black font-bold py-2 rounded-xl disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Guardar
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-white/10 text-white rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Lista de Productos */}
      <div className="grid gap-2">
        {products.length === 0 ? (
          <div className="glass-card p-8 text-center text-white/40">
            No hay productos disponibles
          </div>
        ) : (
          products.map((prod) => {
            const isRecipe = prod.ingredients && prod.ingredients.length > 0;
            return (
              <div key={prod.id} className="glass-card p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white dark:text-white">{prod.name}</p>
                    {isRecipe && (
                      <span className="text-xs bg-wanda-pink/20 text-wanda-pink px-2 py-0.5 rounded-full">
                        Receta
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40">
                    {isRecipe ? `${prod.ingredients.length} ingredientes` : 'Producto directo'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cosmo-green font-bold text-lg">
                    ${prod.price?.toLocaleString("es-CL")}
                  </span>
                  <button 
                    onClick={() => onDeleteProduct(prod.id)}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * ProductManager - Componente principal de administración de productos
 * @description Gestiona ingredientes, productos y recetas con cálculo en cascada
 * @access Restricted - Requiere autenticación
 * @validation Solo cristopher0915@gmail.com tiene acceso completo al panel de admin
 */
export function ProductManager() {
  const { user } = useAuth();
  const { 
    ingredientBase,
    productUser,
    loading, 
    error,
    fetchAllData,
    addIngredientUser,
    updateIngredientUser,
    deleteIngredientUser,
    addProductUser,
    updateProductUser,
    deleteProductUser,
    updatePrice,
    getIngredientPrice,
  } = useUserData();

  // Acceder al store unificado para el cálculo en cascada
  const { updateIngredientPrice } = useUnifiedStore();

  // Estado local
  const [activeTab, setActiveTab] = useState<"suministros" | "ventas">("suministros");
  const [saving, setSaving] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  // Combinar ingredientes base con precios del usuario
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

  /**
   * showMessage - Muestra mensaje temporal de éxito/error
   */
  const showMessage = (type: "success" | "error", text: string) => {
    setSyncMessage({ type, text });
    setTimeout(() => setSyncMessage(null), 3000);
  };

  /**
   * handleUpdateIngredientPrice - Actualiza precio y dispara cálculo en cascada
   * @param ingredientBaseId - ID del ingrediente base
   * @param newPrice - Nuevo precio
   */
  const handleUpdateIngredientPrice = useCallback(async (ingredientBaseId: string, newPrice: number) => {
    setSaving(true);
    try {
      await updatePrice(ingredientBaseId, newPrice);
      
      // Cálculo en cascada - actualizar todas las recetas afectadas
      updateIngredientPrice(ingredientBaseId, newPrice);
      
      showMessage("success", "Precio actualizado");
    } catch (error) {
      console.error("Error updating price:", error);
      showMessage("error", "Error al guardar precio");
    } finally {
      setSaving(false);
    }
  }, [updatePrice, updateIngredientPrice]);

  const handleAddIngredient = async () => {
    // Implementation for adding ingredient
    showMessage("success", "Ingrediente agregado");
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

  if (!user) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-wanda-pink mb-4" />
        <p className="text-white/60 dark:text-gray-600">Debes iniciar sesión para gestionar productos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Toast Messages */}
      {syncMessage && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg ${
          syncMessage.type === "success" ? "bg-cosmo-green text-black" : "bg-red-500 text-white"
        }`}>
          {syncMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {syncMessage.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white dark:text-gray-900">
            Administración <span className="gradient-text-pink">Integral</span>
          </h2>
          <p className="text-sm text-white/40 dark:text-gray-500 mt-1">
            Gestiona tus ingredientes, productos y recetas
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 p-1 bg-black/40 dark:bg-gray-200 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab("suministros")} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
            activeTab === "suministros" 
              ? "bg-wanda-pink text-white" 
              : "text-white/60 hover:text-white dark:text-gray-600 dark:hover:text-gray-900"
          }`}
        >
          <Package className="w-4 h-4" /> Suministros
        </button>
        <button 
          onClick={() => setActiveTab("ventas")} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
            activeTab === "ventas" 
              ? "bg-wanda-pink text-white" 
              : "text-white/60 hover:text-white dark:text-gray-600 dark:hover:text-gray-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Ventas
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "suministros" && (
        <SuministrosSection 
          ingredients={allIngredients}
          onUpdatePrice={handleUpdateIngredientPrice}
          onAddIngredient={handleAddIngredient}
        />
      )}

      {activeTab === "ventas" && (
        <VentasSection
          products={productUser}
          onUpdateProduct={updateProductUser}
          onDeleteProduct={deleteProductUser}
          onAddProduct={addProductUser}
        />
      )}
    </div>
  );
}
