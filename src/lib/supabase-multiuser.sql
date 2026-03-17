-- ============================================
-- SCHEMA PARA MULTI-USUARIO CON GOOGLE AUTH
-- Ejecutar TODO este SQL de una vez
-- ============================================

-- Tabla de perfiles
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  nombre TEXT,
  avatar_url TEXT,
  origin_address TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de ingredientes BASE
CREATE TABLE IF NOT EXISTS public.ingredientes_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de productos BASE
CREATE TABLE IF NOT EXISTS public.productos_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) DEFAULT 0,
  ingredients JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'custom',
  variant TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de ingredientes del usuario
CREATE TABLE IF NOT EXISTS public.ingredientes_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ingredient_base_id UUID REFERENCES ingredientes_base(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit NUMERIC(10, 2) DEFAULT 0,
  stock NUMERIC(10, 2) DEFAULT 0,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de productos del usuario
CREATE TABLE IF NOT EXISTS public.productos_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_base_id UUID REFERENCES productos_base(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) DEFAULT 0,
  ingredients JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'custom',
  variant TEXT DEFAULT '',
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de precios por usuario
CREATE TABLE IF NOT EXISTS public.precios_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ingredient_base_id UUID REFERENCES ingredientes_base(id) ON DELETE CASCADE NOT NULL,
  cost_per_unit NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, ingredient_base_id)
);

-- RLS
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredientes_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredientes_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precios_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "perfiles_policy" ON public.perfiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "ing_base_read" ON public.ingredientes_base FOR SELECT USING (true);
CREATE POLICY "prod_base_read" ON public.productos_base FOR SELECT USING (true);
CREATE POLICY "ing_user_policy" ON public.ingredientes_usuario FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "prod_user_policy" ON public.productos_usuario FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "precios_policy" ON public.precios_usuario FOR ALL USING (auth.uid() = user_id);

-- Agregar columna user_id a eventos
ALTER TABLE public.eventos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Política para eventos
DROP POLICY IF EXISTS "eventos_policy" ON public.eventos;
CREATE POLICY "eventos_policy" ON public.eventos FOR ALL USING (auth.uid() = user_id);

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Datos base
INSERT INTO ingredientes_base (name, unit, cost_per_unit) VALUES
('Pan completo', 'unidad', 250),
('Pan vienesa', 'unidad', 300),
('Vienesa', 'unidad', 800),
('Palta', 'kg', 7500),
('Tomate', 'kg', 1800),
('Mayonesa', 'kg', 4500),
('Mostaza', 'kg', 3500),
('Ketchup', 'kg', 3200),
('Cebolla', 'kg', 1500),
('Palillos', 'unidad', 50),
('Queso', 'kg', 6500),
('Jamón', 'kg', 5500),
('Carne', 'kg', 8000),
('Masa empanada', 'unidad', 200),
('Pimentón', 'kg', 2500)
ON CONFLICT DO NOTHING;

INSERT INTO productos_base (name, price, ingredients, category, variant) VALUES
('Completa', 3500, '[{"ingredient_id":"1","quantity":1,"unit":"unidad"}]'::jsonb, 'hotdog', 'completa'),
('Vienesa simple', 2500, '[{"ingredient_id":"2","quantity":1,"unit":"unidad"}]'::jsonb, 'hotdog', 'simple'),
('Vienesa con palta', 3000, '[{"ingredient_id":"2","quantity":1,"unit":"unidad"},{"ingredient_id":"4","quantity":0.04,"unit":"kg"}]'::jsonb, 'hotdog', 'palta')
ON CONFLICT DO NOTHING;
