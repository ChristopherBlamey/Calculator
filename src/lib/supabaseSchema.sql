-- Create Ingredientes Table
CREATE TABLE IF NOT EXISTS public.ingredientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('gr', 'unidad', 'ml')),
  cost_per_unit NUMERIC(10, 2) DEFAULT 0,
  stock NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Productos Table
CREATE TABLE IF NOT EXISTS public.productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) DEFAULT 0,
  ingredients JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Eventos Table
CREATE TABLE IF NOT EXISTS public.eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT DEFAULT '',
  sold_items JSONB DEFAULT '[]'::jsonb,
  fuel_cost NUMERIC(10, 2) DEFAULT 0,
  total_income NUMERIC(10, 2) DEFAULT 0,
  total_cost NUMERIC(10, 2) DEFAULT 0,
  net_profit NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Create simple wide open policies for demo/erp purposes
CREATE POLICY "Enable read access for all users" ON public.ingredientes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.ingredientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.ingredientes FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.productos FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.eventos FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.eventos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.eventos FOR UPDATE USING (true);
