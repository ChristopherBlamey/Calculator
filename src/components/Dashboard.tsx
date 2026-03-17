"use client";

import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { supabase } from "@/lib/supabase";
import { TrendingUp, DollarSign, CalendarCheck, Truck, Percent, BarChart3, ShoppingBag } from "lucide-react";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEventos: 0,
    ingresosTotales: 0,
    costoTotal: 0,
    gananciaNeta: 0,
    gastoCombustible: 0,
    margenPromedio: 0
  });
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data: eventosData, error } = await supabase.from('eventos').select('*');
        const eventos = eventosData as any[];
        
        if (error) {
          console.error("Error fetching eventos:", error);
          setLoading(false);
          return;
        }

        if (eventos && eventos.length > 0) {
          // 1. Calculate basic stats
          const totalEventos = eventos.length;
          const ingresosTotales = eventos.reduce((acc, ev) => acc + (Number(ev.total_income) || 0), 0);
          const gananciaNeta = eventos.reduce((acc, ev) => acc + (Number(ev.net_profit) || 0), 0);
          const costoTotal = eventos.reduce((acc, ev) => acc + (Number(ev.total_cost) || 0), 0);
          const gastoCombustible = eventos.reduce((acc, ev) => acc + (Number(ev.fuel_cost) || 0), 0);
          const margenPromedio = ingresosTotales > 0 ? (gananciaNeta / ingresosTotales) * 100 : 0;
          
          setStats({ totalEventos, ingresosTotales, costoTotal, gananciaNeta, gastoCombustible, margenPromedio });

          // 2. Aggregate Top Products
          const productCounts: Record<string, number> = {};
          eventos.forEach(ev => {
            const items = (ev.sold_items || []) as any[];
            items.forEach(item => {
              const name = `${item.product} ${item.variant}`;
              productCounts[name] = (productCounts[name] || 0) + item.quantity;
            });
          });
          
          const sortedProducts = Object.entries(productCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5
            
          setTopProducts(sortedProducts);

          // 3. Aggregate Monthly Data
          const monthlyTotals: Record<string, { month: string, income: number, profit: number, cost: number, fuel: number }> = {};
          
          eventos.forEach(ev => {
            if (!ev.event_date) return;
            const monthToken = ev.event_date.substring(0, 7); 
            
            if (!monthlyTotals[monthToken]) {
              monthlyTotals[monthToken] = { month: monthToken, income: 0, profit: 0, cost: 0, fuel: 0 };
            }
            monthlyTotals[monthToken].income += Number(ev.total_income) || 0;
            monthlyTotals[monthToken].profit += Number(ev.net_profit) || 0;
            monthlyTotals[monthToken].cost += Number(ev.total_cost) || 0;
            monthlyTotals[monthToken].fuel += Number(ev.fuel_cost) || 0;
          });
          
          const sortedMonths = Object.values(monthlyTotals).sort((a, b) => a.month.localeCompare(b.month));
          setMonthlyData(sortedMonths);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Dashboard <span className="gradient-text-green">BLAMEY</span>
        </h2>
      </div>

      {/* KPI Cards Reestructurados */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* KPI 1: Rentabilidad Central */}
        <div className="glass-card neon-border-wanda p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-wanda-pink/10 rounded-full blur-3xl" />
          <div className="flex items-center justify-between pb-2 relative z-10">
            <h3 className="text-sm font-medium opacity-70">Ganancia Neta Total</h3>
            <TrendingUp className="h-5 w-5 text-wanda-pink" />
          </div>
          <div className="text-3xl font-black gradient-text-pink relative z-10">
            ${stats.gananciaNeta.toLocaleString("es-CL")}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs opacity-60">
            <CalendarCheck className="w-3 h-3" />
            <span>En {stats.totalEventos} eventos registrados</span>
          </div>
        </div>

        {/* KPI 2: Margen Operativo */}
        <div className="glass-card neon-border-cosmo p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cosmo-green/10 rounded-full blur-3xl" />
          <div className="flex items-center justify-between pb-2 relative z-10">
            <h3 className="text-sm font-medium opacity-70">Margen Neto Promedio</h3>
            <Percent className="h-5 w-5 text-cosmo-green" />
          </div>
          <div className="text-3xl font-black gradient-text-green relative z-10">
            {stats.margenPromedio.toFixed(1)}%
          </div>
          <div className="mt-2 text-xs opacity-60">
            Punto de equilibrio saludable
          </div>
        </div>

        {/* KPI 3: Logística y Combustible */}
        <div className="glass-card p-6 border border-white/10 hover:border-blue-400/50 transition-colors">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium opacity-70">Gasto Logístico Total</h3>
            <Truck className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            ${stats.gastoCombustible.toLocaleString("es-CL")}
          </div>
          <div className="mt-2 text-xs opacity-60">
            Inversión en combustible y traslados
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Chart 1: Rentabilidad Operativa Flujo */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-wanda-pink" /> 
            Rentabilidad Operativa
          </h3>
          <div className="h-[300px] w-full">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--cosmo)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--cosmo)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--wanda)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--wanda)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', background: 'rgba(26,26,46,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString('es-CL')}`, '']}
                  />
                  <Legend />
                  <Area type="monotone" name="Ingresos ($)" dataKey="income" stroke="var(--cosmo)" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" name="Ganancia Neta ($)" dataKey="profit" stroke="var(--wanda)" fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center opacity-50 text-sm">No hay datos suficientes</div>
            )}
          </div>
        </div>

        {/* Chart 2: Tendencias de Productos */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cosmo-green" />
            Tendencias (Más Vendidos)
          </h3>
          <div className="h-[300px] w-full">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ borderRadius: '12px', background: 'rgba(26,26,46,0.95)', border: '1px solid rgba(127,255,0,0.3)' }}
                    formatter={(value: any) => [`${value} unidades`, 'Ventas']}
                  />
                  <Bar dataKey="count" fill="var(--cosmo)" radius={[0, 4, 4, 0]}>
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--wanda)' : 'var(--cosmo)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center opacity-50 text-sm">No hay datos suficientes</div>
            )}
          </div>
        </div>
        
        {/* Chart 3: Costos Logísticos vs Ingresos */}
        <div className="glass-card p-6 lg:col-span-3 border-t-2 border-t-blue-500/50">
           <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" />
            Logística vs Producción
          </h3>
          <div className="h-[250px] w-full">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', background: 'rgba(26,26,46,0.95)', border: '1px solid rgba(59,130,246,0.3)' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString('es-CL')}`, '']}
                  />
                  <Legend />
                  <Line type="monotone" name="Costo Ingredientes" dataKey="cost" stroke="rgba(255,255,255,0.8)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" name="Gasto en Logística (Combustible)" dataKey="fuel" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4, fill: '#60A5FA', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center opacity-50 text-sm">No hay datos suficientes</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
