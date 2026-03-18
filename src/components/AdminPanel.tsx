/**
 * @file AdminPanel.tsx
 * @description Panel de administración del sistema para el super administrador
 * 
 * Este componente proporciona acceso completo a:
 * - Gestión de usuarios registrados
 * - Datos base del sistema (ingredientes y productos)
 * - Estadísticas globales
 * 
 * @author BLAMEY ERP Team
 * @version 2.3.2
 * 
 * @access RESTRINGIDO - Solo para administrador
 * @validation 
 * - Frontend: Verifica que el email sea cristopher0915@gmail.com
 * - Backend (Supabase): Políticas RLS que permiten acceso solo al admin
 * 
 * @security
 * La validación de acceso se realiza en dos niveles:
 * 1. Frontend: Comparación de email del usuario con ADMIN_EMAIL
 * 2. Supabase RLS: Políticas de base de datos que restrict access
 * 
 * @example
 * // Verificación de acceso:
 * const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
 * // ADMIN_EMAIL = "cristopher0915@gmail.com"
 * 
 * // Políticas Supabase RLS relacionadas:
 * -- Admin puede leer todos los perfiles
  * CREATE POLICY "Admin can read all profiles"
  * ON public.perfiles FOR SELECT
  * USING (auth.uid() = id);
  */

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAdminStore } from "@/store/useAdminStore";
import { useAdminData, type UserData } from "@/hooks/useAdminData";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, Package, ShoppingBag, Calendar, Lock, LogOut,
  ChevronDown, ChevronUp, Trash2, Plus, Loader2, AlertCircle,
  Database, ChefHat, Shield
} from "lucide-react";

const ADMIN_EMAIL = "cristopher0915@gmail.com";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdminStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      onLogin();
    } else {
      setError("Contraseña incorrecta");
      setPassword("");
    }
  };

  return (
    <div className="cw-bg min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass-card p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-wanda-pink/20 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-wanda-pink" />
            </div>
            <h1 className="text-2xl font-bold text-white">Panel de Administrador</h1>
            <p className="text-white/40 text-sm mt-2">Ingresa la contraseña de admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-wanda-pink"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-wanda-pink text-white font-bold py-3 rounded-xl hover:bg-wanda-pink-light transition-colors"
            >
              Ingresar
            </button>
          </form>

          <p className="text-center text-white/20 text-xs">
            BLAMEY ERP - Panel de Administración
          </p>
        </div>
      </div>
    </div>
  );
}

function UserCard({ user, expanded, onToggle }: { user: UserData; expanded: boolean; onToggle: () => void }) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalRevenue = user.events.reduce((sum, e) => sum + (e.net_profit || 0), 0);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-wanda-pink/20 flex items-center justify-center overflow-hidden">
                {user.profile.avatar_url ? (
                  <Image src={user.profile.avatar_url} alt="" width={40} height={40} className="w-full h-full object-cover" />
                ) : (
              <span className="text-wanda-pink font-bold">
                {user.profile.nombre?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="font-bold text-white">{user.profile.nombre || "Sin nombre"}</p>
            <p className="text-sm text-white/40">{user.profile.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-white/60">
              <Package className="w-4 h-4" />
              {user.ingredients.length}
            </span>
            <span className="flex items-center gap-1 text-white/60">
              <ShoppingBag className="w-4 h-4" />
              {user.products.length}
            </span>
            <span className="flex items-center gap-1 text-white/60">
              <Calendar className="w-4 h-4" />
              {user.events.length}
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-white/40" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/40" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="p-4 bg-black/20 border-t border-white/5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-3 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Registrado</p>
              <p className="text-white font-medium">{formatDate(user.profile.created_at)}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Ingredientes</p>
              <p className="text-white font-medium">{user.ingredients.length}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Productos</p>
              <p className="text-white font-medium">{user.products.length}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Ganancias Totales</p>
              <p className="text-cosmo-green font-medium">${totalRevenue.toLocaleString("es-CL")}</p>
            </div>
          </div>

          {user.ingredients.length > 0 && (
            <div>
              <p className="text-sm font-bold text-white/70 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" /> Ingredientes Personalizados
              </p>
              <div className="flex flex-wrap gap-2">
                {user.ingredients.map((ing) => (
                  <span key={ing.id} className="px-3 py-1 bg-wanda-pink/20 text-wanda-pink rounded-lg text-sm">
                    {ing.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.products.length > 0 && (
            <div>
              <p className="text-sm font-bold text-white/70 mb-2 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Productos Personalizados
              </p>
              <div className="flex flex-wrap gap-2">
                {user.products.map((prod) => (
                  <span key={prod.id} className="px-3 py-1 bg-cosmo-green/20 text-cosmo-green rounded-lg text-sm">
                    {prod.name} (${prod.price?.toLocaleString("es-CL")})
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.events.length > 0 && (
            <div>
              <p className="text-sm font-bold text-white/70 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Eventos Recientes
              </p>
              <div className="space-y-2">
                {user.events.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <div>
                      <p className="text-white text-sm">{evt.name}</p>
                      <p className="text-white/40 text-xs">{formatDate(evt.event_date)}</p>
                    </div>
                    <p className={`text-sm font-medium ${evt.net_profit >= 0 ? 'text-cosmo-green' : 'text-red-400'}`}>
                      ${evt.net_profit?.toLocaleString("es-CL") || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BaseDataManager() {
  const { 
    baseIngredients, 
    baseProducts, 
    fetchBaseData,
    addBaseIngredient,
    addBaseProduct,
    deleteBaseIngredient,
    deleteBaseProduct 
  } = useAdminData();

  const [showAddIng, setShowAddIng] = useState(false);
  const [showAddProd, setShowAddProd] = useState(false);
  const [newIng, setNewIng] = useState({ name: "", unit: "unidad", cost_per_unit: 0 });
  const [newProd, setNewProd] = useState({ name: "", price: 0, ingredients: "[]" });

  useEffect(() => {
    fetchBaseData();
  }, [fetchBaseData]);

  const handleAddIng = async () => {
    if (!newIng.name.trim()) return;
    await addBaseIngredient(newIng.name, newIng.unit, newIng.cost_per_unit);
    setNewIng({ name: "", unit: "unidad", cost_per_unit: 0 });
    setShowAddIng(false);
  };

  const handleAddProd = async () => {
    if (!newProd.name.trim()) return;
    try {
      const ingredients = JSON.parse(newProd.ingredients || "[]");
      await addBaseProduct(newProd.name, newProd.price, ingredients);
      setNewProd({ name: "", price: 0, ingredients: "[]" });
      setShowAddProd(false);
    } catch {
      alert("JSON de ingredientes inválido");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-wanda-pink" />
          Gestión de Datos Base
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4" /> Ingredientes Base
            </h3>
            <button 
              onClick={() => setShowAddIng(!showAddIng)}
              className="p-2 bg-wanda-pink/20 text-wanda-pink rounded-lg hover:bg-wanda-pink/30"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddIng && (
            <div className="space-y-2 p-3 bg-black/20 rounded-lg">
              <input
                type="text"
                placeholder="Nombre"
                value={newIng.name}
                onChange={(e) => setNewIng({ ...newIng, name: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              />
              <div className="flex gap-2">
                <select
                  value={newIng.unit}
                  onChange={(e) => setNewIng({ ...newIng, unit: e.target.value })}
                  className="bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="unidad">Unidad</option>
                  <option value="kg">Kilogramo</option>
                  <option value="gr">Gramo</option>
                  <option value="lt">Litro</option>
                </select>
                <input
                  type="number"
                  placeholder="Costo"
                  value={newIng.cost_per_unit || ""}
                  onChange={(e) => setNewIng({ ...newIng, cost_per_unit: parseFloat(e.target.value) || 0 })}
                  className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                />
                <button onClick={handleAddIng} className="px-3 bg-cosmo-green text-black rounded-lg text-sm font-bold">
                  +
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {baseIngredients.map((ing) => (
              <div key={ing.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white text-sm">{ing.name}</p>
                  <p className="text-white/40 text-xs">${ing.cost_per_unit} / {ing.unit}</p>
                </div>
                <button
                  onClick={() => deleteBaseIngredient(ing.id)}
                  className="p-1 text-white/40 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ChefHat className="w-4 h-4" /> Productos Base
            </h3>
            <button 
              onClick={() => setShowAddProd(!showAddProd)}
              className="p-2 bg-wanda-pink/20 text-wanda-pink rounded-lg hover:bg-wanda-pink/30"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddProd && (
            <div className="space-y-2 p-3 bg-black/20 rounded-lg">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Precio"
                value={newProd.price || ""}
                onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              />
              <textarea
                placeholder='Ingredientes JSON: [{"ingredient_id": "id", "quantity": 1, "unit": "unidad"}]'
                value={newProd.ingredients}
                onChange={(e) => setNewProd({ ...newProd, ingredients: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm h-20 font-mono"
              />
              <button onClick={handleAddProd} className="w-full bg-cosmo-green text-black font-bold py-2 rounded-lg text-sm">
                Agregar Producto
              </button>
            </div>
          )}

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {baseProducts.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white text-sm">{prod.name}</p>
                  <p className="text-white/40 text-xs">${prod.price?.toLocaleString("es-CL")}</p>
                </div>
                <button
                  onClick={() => deleteBaseProduct(prod.id)}
                  className="p-1 text-white/40 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPanel() {
  const { user } = useAuth();
  const { isAdmin, logout } = useAdminStore();
  const { users, loading, error, fetchAllUsers } = useAdminData();
  const [activeSection, setActiveSection] = useState<"users" | "base">("users");
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  
  // Verificar si el email del usuario es el admin
  const isAuthorizedAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (isAdmin && isAuthorizedAdmin) {
      fetchAllUsers();
    }
  }, [isAdmin, isAuthorizedAdmin, fetchAllUsers]);

  // Si el usuario no está autorizado, mostrar mensaje
  if (!isAuthorizedAdmin) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-2xl">
          <Shield className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Acceso Restringido</h2>
        <p className="text-white/60">
          No tienes permisos para acceder al panel de administración. 
          Solo el administrador principal puede acceder a esta sección.
        </p>
      </div>
    );
  }

  const toggleUser = (userId: string) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  if (!isAdmin) {
    return <AdminLogin onLogin={fetchAllUsers} />;
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-wanda-pink" />
            Panel de Administrador
          </h2>
          <p className="text-sm text-white/40 mt-1">
            {users.length} usuario(s) registrado(s)
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/20 text-red-400 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2 p-1 bg-black/40 rounded-xl w-fit">
        <button 
          onClick={() => setActiveSection("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${activeSection === "users" ? "bg-wanda-pink text-white" : "text-white/60 hover:text-white"}`}
        >
          <Users className="w-4 h-4" /> Usuarios
        </button>
        <button 
          onClick={() => setActiveSection("base")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${activeSection === "base" ? "bg-wanda-pink text-white" : "text-white/60 hover:text-white"}`}
        >
          <Database className="w-4 h-4" /> Datos Base
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-wanda-pink" />
        </div>
      ) : activeSection === "users" ? (
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-white/20 mb-4" />
              <p className="text-white/40">No hay usuarios registrados</p>
            </div>
          ) : (
            users.map((user) => (
              <UserCard
                key={user.profile.id}
                user={user}
                expanded={expandedUsers.has(user.profile.id)}
                onToggle={() => toggleUser(user.profile.id)}
              />
            ))
          )}
        </div>
      ) : (
        <BaseDataManager />
      )}
    </div>
  );
}
