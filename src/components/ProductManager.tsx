"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useUserData, type IngredientUser, type ProductUser } from "@/hooks/useUserData";
import { useAuth } from "@/hooks/useAuth";
import { useUnifiedStore } from "@/store/useUnifiedStore";
import { 
  Package, Plus, Edit3, Save, X, Trash2,
  ShoppingBag, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft,
  FlaskConical, Scale, DollarSign, Calculator, ArrowRight, Check
} from "lucide-react";

interface ProductIngredient {
  ingredient_id: string;
  ingredient_name?: string;
  quantity: number;
  unit: string;
}

interface IngredientWithPrice {
  id: string;
  name: string;
  unit: string;
  cost_per_unit: number;
  baseId?: string;
  isBase?: boolean;
}

// Categorías predefinidas
const CATEGORIES = [
  { id: "hotdog", label: "Completo", icon: "🌭" },
  { id: "churrasco", label: "Churrasco", icon: "🥩" },
  { id: "hamburguesa", label: "Hamburguesa", icon: "🍔" },
  { id: "empanada", label: "Empanada", icon: "🥟" },
  { id: "bebida", label: "Bebida", icon: "🥤" },
  { id: "producto", label: "Otro producto", icon: "📦" },
];

// Unidades disponibles
const UNITS = [
  { value: "unidad", label: "Unidad" },
  { value: "kg", label: "Kilogramo (kg)" },
  { value: "gr", label: "Gramo (gr)" },
  { value: "lt", label: "Litro (lt)" },
  { value: "ml", label: "Mililitro (ml)" },
];

/**
 * ProductWizard - Wizard para crear productos/recetas
 * Paso 1: Elegir tipo (con ingredientes o sin)
 * Paso 2: Nombre y categoría
 * Paso 3: Seleccionar ingredientes (si aplica)
 * Paso 4: Establecer precio de venta
 */
function ProductWizard({
  ingredients,
  onComplete,
  onCancel
}: {
  ingredients: IngredientWithPrice[];
  onComplete: (data: {
    name: string;
    category: string;
    price: number;
    ingredients: ProductIngredient[];
  }) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(1);
  const [hasIngredients, setHasIngredients] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<ProductIngredient[]>([]);
  const [price, setPrice] = useState(0);
  const [newIngredient, setNewIngredient] = useState({ quantity: 0, unit: "gr", ingredient_id: "" });

  const canProceed = () => {
    switch (step) {
      case 1:
        return hasIngredients !== null;
      case 2:
        return name.trim() && category;
      case 3:
        return !hasIngredients || selectedIngredients.length >= 2;
      case 4:
        return price > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        name,
        category,
        price,
        ingredients: selectedIngredients,
      });
    }
  };

  const addIngredient = () => {
    if (!newIngredient.ingredient_id || newIngredient.quantity <= 0) return;
    
    const ing = ingredients.find(i => i.id === newIngredient.ingredient_id || i.baseId === newIngredient.ingredient_id);
    if (!ing) return;

    setSelectedIngredients([
      ...selectedIngredients,
      {
        ingredient_id: ing.baseId || ing.id,
        ingredient_name: ing.name,
        quantity: newIngredient.quantity,
        unit: newIngredient.unit,
      }
    ]);
    setNewIngredient({ quantity: 0, unit: "gr", ingredient_id: "" });
  };

  const removeIngredient = (idx: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== idx));
  };

  const calculateCost = useCallback(() => {
    let total = 0;
    for (const ing of selectedIngredients) {
      const ingData = ingredients.find(i => i.baseId === ing.ingredient_id || i.id === ing.ingredient_id);
      if (ingData) {
        let qty = ing.quantity;
        // Convertir a la unidad del ingrediente
        if (ing.unit === "gr" && ingData.unit === "kg") qty = qty / 1000;
        if (ing.unit === "kg" && ingData.unit === "gr") qty = qty * 1000;
        if (ing.unit === "ml" && ingData.unit === "lt") qty = qty / 1000;
        if (ing.unit === "lt" && ingData.unit === "ml") qty = qty * 1000;
        total += (ingData.cost_per_unit || 0) * qty;
      }
    }
    return total;
  }, [selectedIngredients, ingredients]);

  const cost = calculateCost();
  const margin = price > 0 ? ((price - cost) / price * 100) : 0;

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= s 
                ? "bg-wanda-pink text-white" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
            }`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && (
              <div className={`w-8 h-0.5 ${step > s ? "bg-wanda-pink" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Paso 1: Tipo de producto */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">¿Qué tipo de producto es?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setHasIngredients(true)}
              className={`p-6 rounded-xl border-2 transition-all ${
                hasIngredients === true
                  ? "border-wanda-pink bg-wanda-pink/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-wanda-pink"
              }`}
            >
              <FlaskConical className="w-10 h-10 mx-auto mb-2 text-wanda-pink" />
              <p className="font-bold text-[var(--text-primary)]">Con ingredientes</p>
              <p className="text-sm text-[var(--text-muted)]">Ej: Completos, churrascos, hamburguesas</p>
            </button>
            <button
              onClick={() => setHasIngredients(false)}
              className={`p-6 rounded-xl border-2 transition-all ${
                hasIngredients === false
                  ? "border-cosmo bg-cosmo/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-cosmo"
              }`}
            >
              <Package className="w-10 h-10 mx-auto mb-2 text-cosmo" />
              <p className="font-bold text-[var(--text-primary)]">Sin ingredientes</p>
              <p className="text-sm text-[var(--text-muted)]">Ej: Bebidas, snacks, productos directos</p>
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Nombre y categoría */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Datos del producto</h3>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Nombre del producto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Completo Italiano"
              className="w-full rounded-xl px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Categoría
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    category === cat.id
                      ? "border-wanda-pink bg-wanda-pink/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{cat.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paso 3: Ingredientes (solo si tiene ingredientes) */}
      {step === 3 && hasIngredients && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Selecciona los ingredientes (mínimo 2)
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            Seleccionados: {selectedIngredients.length}
          </p>

          {/* Agregar ingrediente */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={newIngredient.ingredient_id}
              onChange={(e) => setNewIngredient({...newIngredient, ingredient_id: e.target.value})}
              className="flex-1 min-w-[150px] rounded-xl px-3 py-2"
            >
              <option value="">Seleccionar ingrediente...</option>
              {ingredients.map((ing) => (
                <option key={ing.baseId || ing.id} value={ing.baseId || ing.id}>
                  {ing.name} (${ing.cost_per_unit?.toLocaleString("es-CL")}/{ing.unit})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={newIngredient.quantity || ""}
              onChange={(e) => setNewIngredient({...newIngredient, quantity: parseFloat(e.target.value) || 0})}
              placeholder="Cantidad"
              className="w-24 rounded-xl px-3 py-2"
            />
            <select
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
              className="w-28 rounded-xl px-3 py-2"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
            <button
              onClick={addIngredient}
              disabled={!newIngredient.ingredient_id || newIngredient.quantity <= 0}
              className="px-4 py-2 bg-wanda-pink text-white rounded-xl font-bold disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de ingredientes seleccionados */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedIngredients.map((ing, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[var(--input-bg)] rounded-xl">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{ing.ingredient_name}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {ing.quantity} {ing.unit}
                  </p>
                </div>
                <button
                  onClick={() => removeIngredient(idx)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paso 4: Precio de venta */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Establecer precio de venta</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Precio de venta ($)
              </label>
              <input
                type="number"
                value={price || ""}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full rounded-xl px-4 py-3 text-lg"
              />
            </div>
            
            {hasIngredients && (
              <div className="space-y-2">
                <div className="p-4 bg-[var(--input-bg)] rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Costo de producción:</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      ${cost.toLocaleString("es-CL")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-[var(--text-muted)]">Ganancia:</span>
                    <span className={`font-bold ${margin >= 30 ? "text-cosmo" : margin >= 15 ? "text-yellow-500" : "text-red-500"}`}>
                      ${(price - cost).toLocaleString("es-CL")} ({margin.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={step === 1 ? onCancel : () => setStep(step - 1)}
          className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <ChevronLeft className="w-5 h-5" />
          {step === 1 ? "Cancelar" : "Atrás"}
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 px-6 py-2 bg-wanda-pink text-white font-bold rounded-xl disabled:opacity-50"
        >
          {step === 4 ? "Crear producto" : "Continuar"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * ProductList - Lista de productos con edición inline
 */
function ProductList({
  products,
  onEdit,
  onDelete,
}: {
  products: ProductUser[];
  onEdit: (product: ProductUser) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {products.length === 0 ? (
        <div className="glass-card p-8 text-center text-[var(--text-muted)]">
          No hay productos creados
        </div>
      ) : (
        products.map((prod) => {
          const isRecipe = prod.ingredients && prod.ingredients.length > 0;
          return (
            <div key={prod.id} className="glass-card p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[var(--text-primary)]">{prod.name}</p>
                  {isRecipe && (
                    <span className="text-xs bg-wanda-pink/20 text-wanda-pink px-2 py-0.5 rounded-full">
                      Receta
                    </span>
                  )}
                  {!isRecipe && (
                    <span className="text-xs bg-cosmo/20 text-cosmo px-2 py-0.5 rounded-full">
                      Producto
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {isRecipe 
                    ? `${prod.ingredients.length} ingredientes`
                    : 'Sin ingredientes'
                  } • {CATEGORIES.find(c => c.id === prod.category)?.label || prod.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cosmo font-bold text-lg">
                  ${prod.price?.toLocaleString("es-CL")}
                </span>
                <button
                  onClick={() => onDelete(prod.id)}
                  className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/**
 * ProductManager - Componente principal
 */
export function ProductManager() {
  const { user } = useAuth();
  const { 
    ingredientBase,
    productUser,
    loading, 
    fetchAllData,
    addProductUser,
    deleteProductUser,
    updatePrice,
    getIngredientPrice,
  } = useUserData();

  const { updateIngredientPrice } = useUnifiedStore();

  const [activeTab, setActiveTab] = useState<"productos" | "ingredientes">("productos");
  const [showWizard, setShowWizard] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{type: "success" | "error", text: string} | null>(null);

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

  const showMessage = (type: "success" | "error", text: string) => {
    setSyncMessage({ type, text });
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const handleCreateProduct = async (data: {
    name: string;
    category: string;
    price: number;
    ingredients: ProductIngredient[];
  }) => {
    try {
      await addProductUser({
        name: data.name,
        category: data.category,
        price: data.price,
        ingredients: data.ingredients,
      });
      showMessage("success", "Producto creado exitosamente");
      setShowWizard(false);
    } catch (error) {
      showMessage("error", "Error al crear producto");
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

  const handleUpdateIngredientPrice = useCallback(async (ingredientBaseId: string, newPrice: number) => {
    try {
      await updatePrice(ingredientBaseId, newPrice);
      updateIngredientPrice(ingredientBaseId, newPrice);
      showMessage("success", "Precio actualizado");
    } catch (error) {
      showMessage("error", "Error al guardar");
    }
  }, [updatePrice, updateIngredientPrice]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wanda-pink/20 border-t-wanda-pink" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-b-cosmo" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-wanda-pink mb-4" />
        <p className="text-[var(--text-muted)]">Debes iniciar sesión para gestionar productos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {syncMessage && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg ${
          syncMessage.type === "success" ? "bg-cosmo text-black" : "bg-red-500 text-white"
        }`}>
          {syncMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {syncMessage.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Administración <span className="text-wanda-pink">Integral</span>
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Gestiona tus productos, recetas e ingredientes
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-wanda-pink text-white font-bold rounded-xl"
        >
          <Plus className="w-5 h-5" /> Nuevo Producto
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[var(--glass-bg)] rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("productos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
            activeTab === "productos"
              ? "bg-wanda-pink text-white"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Productos
        </button>
        <button
          onClick={() => setActiveTab("ingredientes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
            activeTab === "ingredientes"
              ? "bg-wanda-pink text-white"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Package className="w-4 h-4" /> Ingredientes
        </button>
      </div>

      {/* Content */}
      {showWizard ? (
        <ProductWizard
          ingredients={allIngredients}
          onComplete={handleCreateProduct}
          onCancel={() => setShowWizard(false)}
        />
      ) : (
        <>
          {activeTab === "productos" && (
            <ProductList
              products={productUser}
              onEdit={() => {}}
              onDelete={handleDeleteProduct}
            />
          )}

          {activeTab === "ingredientes" && (
            <div className="space-y-3">
              {allIngredients.map((ing) => (
                <div key={ing.baseId || ing.id} className="glass-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{ing.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{ing.unit}</p>
                  </div>
                  <span className="text-cosmo font-bold text-lg">
                    ${ing.cost_per_unit?.toLocaleString("es-CL")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
