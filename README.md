# FinanzasG 💰

PWA de finanzas personales. Registra gastos e ingresos, controla tu balance mes a mes.

**Stack:** Next.js 15 · Supabase (PostgreSQL + Auth) · Vercel

---

## 🚀 Configuración paso a paso

### 1. Supabase (base de datos y auth)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un **nuevo proyecto** (ej: `finanzas-g`)
3. Espera ~2 minutos a que se inicialice
4. Ve a **SQL Editor** y ejecuta el contenido de [`supabase/migration.sql`](./supabase/migration.sql)
5. Ve a **Project Settings > API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Variables de entorno locales

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. Instalar y ejecutar localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## ☁️ Despliegue en Vercel

1. Sube este proyecto a GitHub (o GitLab)
2. Ve a [vercel.com](https://vercel.com) y conecta tu cuenta GitHub
3. Importa el repositorio `FinanzasG`
4. En **Environment Variables** agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key
5. Haz clic en **Deploy**

Vercel detecta Next.js automáticamente. No necesitas configuración adicional.

---

## 📱 Instalar como PWA

**Android (Chrome):**
1. Abre la URL de la app en Chrome
2. Toca el menú (⋮) → "Agregar a pantalla de inicio"

**iOS (Safari):**
1. Abre la URL en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona "Agregar a pantalla de inicio"

---

## 📦 Estructura del proyecto

```
app/
├── page.tsx              # Dashboard principal
├── login/page.tsx        # Login
├── register/page.tsx     # Registro
├── transactions/page.tsx # Lista de movimientos
├── categories/page.tsx   # Gestión de categorías
├── manifest.ts           # PWA manifest
└── globals.css           # Sistema de diseño

components/
├── Navbar.tsx            # Barra de navegación
├── TransactionForm.tsx   # Modal agregar/editar
├── TransactionList.tsx   # Lista de transacciones
├── SummaryCards.tsx      # Tarjetas de resumen
└── MonthPicker.tsx       # Selector de mes

lib/
├── supabase/client.ts    # Cliente Supabase (browser)
├── supabase/server.ts    # Cliente Supabase (server)
├── types/database.ts     # Tipos TypeScript
└── utils.ts              # Funciones utilitarias

supabase/
└── migration.sql         # SQL para crear tablas en Supabase
```

---

## ✨ Funcionalidades

- ✅ Registro e inicio de sesión (Supabase Auth)
- ✅ Registrar ingresos y gastos
- ✅ Gastos **fijos** (aparecen automáticamente cada mes)
- ✅ Gastos **esporádicos** (solo en el mes registrado)
- ✅ Editar y eliminar movimientos
- ✅ Navegar mes a mes
- ✅ Tarjetas de resumen: ingresos, gastos, balance
- ✅ Categorías personalizadas con colores e íconos
- ✅ Instalable como PWA en Android e iOS
- ✅ Diseño premium dark mode, totalmente responsivo
