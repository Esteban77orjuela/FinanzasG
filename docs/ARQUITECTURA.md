# Arquitectura Técnica

## Resumen

Aplicación **monolítica** (server-rendered + client components) de una sola unidad desplegada en Vercel. El estado se persiste en Supabase. Es la arquitectura más simple que cubre las necesidades del producto (principio de proporcionalidad).

## Diagrama de componentes

```
┌─────────────────────────────────────────────────────────────┐
│                     Cliente (navegador)                       │
│  PWA instalable · Service Worker (sw.js) · Manifest          │
└───────────────┬──────────────────────────────────────────────┘
                │ HTTPS
┌───────────────▼──────────────────────────────────────────────┐
│                     Vercel (Next.js 16)                        │
│   middleware.ts → control de acceso (sesión)                   │
│   app/*        → páginas (Dashboard, Movimientos, Categorías)  │
│   components/* → UI (Formularios, Listas, Resúmenes)           │
│   lib/utils    → lógica de negocio (mes, fijos, resumen)       │
└───────────────┬──────────────────────────────────────────────┘
                │ Supabase SDK (JWT de sesión)
┌───────────────▼──────────────────────────────────────────────┐
│                  Supabase (PostgreSQL + Auth)                  │
│   auth.users        → identidad del usuario                    │
│   public.categories → segmentos de ingreso/gasto               │
│   public.transactions → movimientos (fijos/esporádicos)        │
│   RLS              → cada usuario solo ve sus filas            │
└───────────────────────────────────────────────────────────────┘
```

## Pila tecnológica y justificación

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | SSR/CSR, rutas, middleware de auth, despliegue nativo en Vercel. |
| Lenguaje | **TypeScript estricto** | Código a prueba de tipado; el builder detecta errores antes de producción. |
| UI | **React 19** | Completa el stack de Next.js. Estilos con CSS propio (sistema de diseño en `globals.css`). |
| Backend de datos | **Supabase (PostgreSQL + Auth)** | Gratis en la capa Hobby, auth llave en mano, RLS por fila, sin infraestructura que administrar. |
| PWA | **Service Worker manual (`public/sw.js`)** | Cacheo del app shell + navegación offline. Sustituye a `next-pwa` (incompatible con Turbopack). |
| Despliegue | **Vercel** | Despliegue automático desde GitHub `main`, HTTPS, gratis para proyectos personales. |
| Control de versiones | **Git + GitHub (privado)** | Historial trazable de cada cambio. |

## Modelo de datos

### Tabla `auth.users` (provista por Supabase)

No se gestiona en el código: la administra el servicio de autenticación.

### Tabla `categories`

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | generado con `gen_random_uuid()` |
| user_id | UUID FK → auth.users | propietario |
| name | TEXT | obligatorio |
| type | TEXT | CHECK IN ('income','expense') |
| color | TEXT | default #10b981 |
| icon | TEXT | default 📦 (emoji) |
| created_at | TIMESTAMPTZ | default now() |

### Tabla `transactions`

| Columna | Tipo | Notas |
|---|---|---|
| id | UUID PK | generado |
| user_id | UUID FK → auth.users | propietario |
| category_id | UUID FK → categories | ON DELETE SET NULL (queda sin categoría) |
| description | TEXT | obligatorio |
| amount | NUMERIC(12,2) | CHECK > 0; se guarda en COP |
| type | TEXT | CHECK IN ('income','expense') |
| is_fixed | BOOLEAN | default false |
| start_date | DATE | inicio del fijo / fecha del esporádico |
| end_date | DATE | (campo reservado para fin de un fijo) |
| created_at | TIMESTAMPTZ | default now() |

### Índices

`transactions(user_id)`, `transactions(is_fixed)`, `transactions(start_date)`, `categories(user_id)`.

### Seguridad por fila (RLS)

Cada tabla tiene políticas para `SELECT`, `INSERT`, `UPDATE`, `DELETE` que comprueban `auth.uid() = user_id`. La base de datos es la última barrera de seguridad: aunque un cliente modifique la app, no puede leer ni escribir filas ajenas.

## Lógica de negocio clave (conceptual)

En `lib/utils.ts`:

- `getTransactionsForMonth(tx, y, m)` → cuáles de todas las transacciones del usuario aplican a un mes:
  - **Fijo:** aplica si `start_date ≤ mes` y (sin `end_date` o `end_date ≥ mes`).
  - **Esporádico:** aplica solo si `start_date` cae exactamente en ese mes.
- `calculateSummary(tx)` → suma ingresos, gastos y calcula balance.
- `formatCurrency(n)` → formato COP.

> Nota: la fecha de inicio de un fijo se interpreta como **mes/año**; no hay escalado diario de montos. Un fijo es "X sobre el mes".

## Estructura de carpetas

```
app/            páginas (layout, dashboard, movimientos, categorías, login, register)
components/     piezas de UI reutilizables
lib/            clientes de Supabase, tipos de base de datos, utilidades
public/         manifest PWA, service worker, íconos, assets estáticos
supabase/       migración SQL (schema + RLS + índices)
docs/           documentación del producto y proceso
```

## Decisiones de arquitectura (ADR resumido)

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Monolito Next.js | Microservicios | Proyecto personal; microservicios = sobreingeniería. |
| Supabase | Firebase | PostgreSQL + SQL + RLS; mantiene datos normalizados y relacionales. |
| Service Worker manual | next-pwa | next-pwa v5 no genera el SW con Turbopack de Next.js 16; un SW manual es simple y controlable. |
| Todo client-side para datos | Server Components para fetch | MVP; el volumen de datos es pequeño. Revisar si crece. |
| `.npmrc` con `legacy-peer-deps` | Migrar `next-pwa` | Libera el bloqueo de instalación en Vercel sin tocar código de feature. |