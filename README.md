# FinanzasG 💰

PWA de finanzas personales. Registra gastos e ingresos, controla tu balance mes a mes.

**Stack:** Next.js 16 · React 19 · TypeScript · Supabase (PostgreSQL + Auth) · Vercel

---

## 📖 Documentación

El proyecto mantiene documentación profesional y trazable en `docs/`:

| Documento | Contenido |
|---|---|
| [Visión](docs/VISION.md) | Idea general y particular del producto |
| [Requisitos](docs/REQUISITOS.md) | Funcionales, no funcionales, historias, backlog |
| [Arquitectura](docs/ARQUITECTURA.md) | Pila, modelo de datos, seguridad, decisiones |
| [Metodología](docs/METODOLOGIA.md) | Cómo se trabaja y se decide |
| [Roadmap](docs/ROADMAP.md) | Plan de iteraciones |
| [Bitácora](docs/BITACORA.md) | Historial de cambios del proyecto |
| [Aprendizaje](docs/APRENDIZAJE.md) | Guía de estudio del proyecto |

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

> Nota: el archivo `.npmrc` (`legacy-peer-deps=true`) evita conflictos de peer dependencies de la pila actual.

---

## ☁️ Despliegue en Vercel

1. Sube el proyecto a GitHub (o GitLab)
2. Ve a [vercel.com](https://vercel.com) y conecta la cuenta de GitHub
3. Importa el repositorio `FinanzasG`
4. En **Environment Variables** agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key
5. Click en **Deploy**

Vercel detecta Next.js automáticamente y despliega desde la rama `main`.

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

## 🏗️ Estructura del proyecto

```
app/                        Páginas y rutas
├── page.tsx                Dashboard (resumen + movimientos por mes)
├── login/page.tsx          Inicio de sesión
├── register/page.tsx       Registro de cuenta
├── transactions/page.tsx   Lista de movimientos
├── categories/page.tsx     Gestión de categorías
├── layout.tsx              Layout raíz (PWA, metadatos)
└── globals.css             Sistema de diseño (dark mode)

components/                 Componentes de UI
├── Navbar.tsx              Navegación superior e inferior
├── TransactionForm.tsx     Modal agregar/editar movimiento
├── TransactionList.tsx     Lista de transacciones
├── SummaryCards.tsx        Tarjetas de resumen (ingresos/gastos/balance)
├── MonthPicker.tsx         Selector y navegación de mes
└── ServiceWorkerRegister.tsx Registro del service worker

lib/
├── supabase/client.ts      Cliente Supabase (navegador)
├── supabase/server.ts      Cliente Supabase (servidor)
├── types/database.ts       Tipos de la base de datos
└── utils.ts                Lógica de negocio (mes, fijos, resumen, moneda)

public/
├── manifest.json           Manifest de la PWA
├── sw.js                   Service worker (caché y offline)
└── icons/                  Íconos de la app

supabase/
└── migration.sql           SQL: tablas, índices y políticas de seguridad (RLS)
```

---

## ✨ Funcionalidades

- ✅ Registro e inicio de sesión (Supabase Auth)
- ✅ Registrar ingresos y gastos
- ✅ Gastos **fijos** (aparecen automáticamente cada mes)
- ✅ Gastos **esporádicos** (solo en el mes registrado)
- ✅ Editar y eliminar movimientos
- ✅ Navegar mes a mes (pasado y presente)
- ✅ Tarjetas de resumen: ingresos, gastos, balance
- ✅ Categorías personalizadas con colores e íconos
- ✅ Instalable como PWA en Android e iOS, con navegación offline
- ✅ Diseño premium dark mode, totalmente responsivo
- ✅ Seguridad por fila en la base de datos (RLS)