-- ============================================================
-- FinanzasG — Migración de base de datos para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ========================
-- TABLA: categories
-- ========================
CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color      TEXT NOT NULL DEFAULT '#10b981',
  icon       TEXT NOT NULL DEFAULT '📦',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- TABLA: transactions
-- ========================
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_fixed    BOOLEAN NOT NULL DEFAULT FALSE,
  start_date  DATE NOT NULL,
  end_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- ÍNDICES
-- ========================
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_is_fixed ON public.transactions(is_fixed);
CREATE INDEX IF NOT EXISTS idx_transactions_start_date ON public.transactions(start_date);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- ========================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuario solo ve sus propios datos
-- ========================

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies para categories
CREATE POLICY "Users can read own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id AND user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- Policies para transactions
CREATE POLICY "Users can read own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id AND user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ========================
-- CATEGORÍAS POR DEFECTO
-- (No aplica RLS ya que no tienen user_id — esto es solo un ejemplo)
-- Las categorías se crean por usuario desde la app
-- ========================

-- Verificar que todo está correcto:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
