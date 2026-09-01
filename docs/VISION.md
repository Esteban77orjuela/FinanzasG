# Visión del Producto — FinanzasG

## Idea General

FinanzasG es una **aplicación web instalable (PWA)** de finanzas personales que permite a una persona registrar sus **ingresos** y **gastos** de forma sencilla, y ver su **balance mes a mes**. Está pensada para el uso personal en teléfonos Android e iOS, accesible desde el navegador sin necesidad de instalar una app de tienda.

### Problema que resuelve

Llevar el control del dinero con Excel o papel es frágil: los gastos recurrentes hay que registrarlos a mano cada mes, los fijos pueden olvidarse y el balance no se calcula solo. FinanzasG automatiza esa tarea: registra un gasto una vez y, si es **fijo**, aparece automáticamente en todos los meses siguientes.

### Usuario objetivo

Una **sola persona** (uso personal) o una familia pequeña (una cuenta por persona). No hay roles de empresa, equipos ni permisos avanzados.

### Propuesta de valor

- Registrar ingresos y gastos en menos de un minuto.
- Distinguir gastos **fijos/recurrentes** de gastos **esporádicos**.
- Ver automáticamente el balance (ingresos − gastos) de cada mes.
- Funciona en el celular como una app (PWA), con datos guardados en la nube.

### Criterios de éxito

1. Un usuario puede crear su cuenta e ingresar datos el primer día de uso.
2. Un gasto fijo registrado aparece correctamente en todos los meses desde su fecha de inicio.
3. Un gasto esporádico solo aparece en el mes en que se registró.
4. El balance de cada mes es correcto (ingresos − gastos).
5. La aplicación es instalable en Android e iOS y funciona offline para el app shell.

---

## Idea Particular

Cada pieza técnica existe para servir a la idea general. Este es el mapa mental:

```
USUARIO (celular) → PWA (navegador/instalada) → Vercel (alojamiento) → Supabase (datos + auth)
```

| Pieza | Para qué existe |
|---|---|
| **Next.js (App Router)** | Renderiza las páginas y sirve la app como sitio web. |
| **Supabase Auth** | Da de alta al usuario y protege sus datos con una sesión. |
| **Supabase PostgreSQL** | Guarda categorías y transacciones con seguridad por fila (RLS). |
| **Service Worker** | Hace que la app sea instalable y funcione sin conexión. |
| **Páginas** | Dashboard (resumen), Movimientos (listado), Categorías (segmentos). |
| **Lógica de mes** | Calcula qué transacciones aplican a cada mes según fijo/esporádico. |

### Nota de alcance

- **Dentro del alcance:** registro de usuario, categorías, transacciones fijas y esporádicas, balance mensual, PWA.
- **Fuera del alcance (por ahora):** presupuestos por categoría, exportaciones, multi-moneda, roles de equipo, notificaciones, análisis avanzado.