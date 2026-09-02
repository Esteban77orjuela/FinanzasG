# Guía de Aprendizaje — FinanzasG

Material de estudio para memorizar el proyecto: la **idea general**, la **idea particular** y cada pieza técnica con reglas de memorización. Lectura propuesta en orden.

---

## 1. Idea General (para explicar a cualquiera)

> "FinanzasG es una app instalable en el celular que registra **ingresos y gastos**, distingue los **fijos** (aparecen cada mes solos) de los **esporádicos** (solo su mes) y muestra el **balance de cada mes**. Los datos viven en la nube y se accede con correo y contraseña."

**Regla de memorización:** *"Una caja registradora que recuerda lo que tú no quieres volver a escribir."*

**Clave de la idea particular:** casi todo el código existe para lograr una sola cosa: **que un gasto fijo aparezca todos los meses sin escribirlo de nuevo.**

---

## 2. Conceptos + las 8 preguntas

Para cada concepto: QUÉ es / PARA QUÉ sirve / POR QUÉ lo usamos / CÓMO funciona / DÓNDE está / CÓMO se conecta / QUÉ pasaría si NO existiera / Regla para memorizar.

### Next.js (App Router)

**QUÉ:** framework de React que define las páginas por carpetas dentro de `app/`.

**PARA QUÉ:** sirve las páginas (Dashboard, Movimientos, Categorías, Login, Registro) y la lógica de rutas/middleware.

**POR QUÉ:** es la base de React + TypeScript + despliegue nativo en Vercel (usable gratis).

**CÓMO:** cada subcarpeta en `app/` con `page.tsx` es una ruta: `app/login/page.tsx` → `/login`.

**DÓNDE:** `app/` (páginas), `middleware.ts` (control de acceso), `next.config.ts` (configuración).

**CÓMO SE CONECTA:** las páginas usan componentes de `components/` y los clientes de `lib/`.

**QUÉ PASARÍA SI NO EXISTIERA:** no habría servidor web; solo habría archivos.

**REGLA:** *"Carpeta = ruta, `page.tsx` = pantalla, Next.js = el mesero que sirve pantallas."*

### TypeScript

**QUÉ:** JavaScript con tipos.

**PARA QUÉ:** que el editor y el build detecten errores antes de que lleguen a producción.

**POR QUÉ:** base de datos tipada = menos bugs de estructura de datos.

**DÓNDE:** `lib/types/database.ts` describe las tablas; el resto del proyecto usa esos tipos.

**CÓMO SE CONECTA:** los componentes dicen `Transaction[]` y el compilador valida que los datos cumplan la forma.

**QUÉ PASARÍA SI NO EXISTIERA:** errores como mandar un `string` donde va un `number` pasarían desapercibidos.

**REGLA:** *"TypeScript es la red de seguridad que atrapa errores antes de usarlos."*

### Supabase

**QUÉ:** servicio de backend como servicio: **PostgreSQL + Autenticación**.

**PARA QUÉ:** guardar categorías y transacciones, y gestionar cuentas/sesiones.

**POR QUÉ:** gratis en el plan básico y con RLS (seguridad por fila) sin armar servidores.

**DÓNDE:** `lib/supabase/client.ts` (navegador) y `lib/supabase/server.ts` (servidor); `supabase/migration.sql` crea las tablas.

**CÓMO SE CONECTA:** la app llama a `supabase.from('transactions')...` y el resultado se usa en React.

**QUÉ PASARÍA SI NO EXISTIERA:** no habría dónde guardar el historial ni cómo identificar al usuario.

**REGLA:** *"Supabase es el banco de datos: guarda todo y solo deja ver a cada quien lo suyo."*

### Row Level Security (RLS)

**QUÉ:** reglas en la base de datos que filtran filas por el usuario de la sesión.

**PARA QUÉ:** que nadie lea/escriba datos ajenos aunque modifique la app.

**POR QUÉ:** la seguridad no se decide en el frontend (que es público y falseable), sino en la base.

**DÓNDE:** `supabase/migration.sql` (políticas `auth.uid() = user_id`).

**CÓMO:** cada SELECT/INSERT/UPDATE/DELETE de una fila se compara con el usuario autenticado.

**QUÉ PASA SI NO EXISTE:** cualquier persona con la clave pública podría ver datos de otros.

**REGLA:** *"RLS es la bóveda del banco: la puerta solo se abre con tu llave."*

### PWA + Service Worker

**QUÉ:** la web se comporta como app instalable; un archivo (`sw.js`) la cachea.

**PARA QUÉ:** instalarla en Android/iOS y usarla sin conexión en las pantallas principales.

**POR QUÉ:** sin costo de tiendas ni app nativa; es la vía "gratis" que pediste.

**DÓNDE:** `public/manifest.json` (identidad de la app), `public/sw.js` (caché), `components/ServiceWorkerRegister.tsx` (la registra), `public/icons/icon-*.png` (íconos).

**CÓMO:** al instalar guarda las páginas base; al navegar muestra la copia guardada si no hay red.

**QUÉ PASA SI NO EXISTE:** no se podría "instalar" ni abrir sin conexión; seguiría siendo una simple web.

**REGLA:** *"El service worker es el botones de la app: deja una copia lista antes de que falte la red."*

### Lógica de mes (fijos vs esporádicos) — `lib/utils.ts`

**QUÉ:** decide qué transacciones entran en cada mes.

**POR QUÉ:** es la funcionalidad clave del producto (la idea particular).

**CÓMO:** `getTransactionsForMonth(tx, y, m)`:
- fijo → aplica si `start_date ≤ mes` (y `end_date` no lo corta);
- esporádico → aplica solo si su mes coincide.

**DÓNDE:** `lib/utils.ts`.

**CÓMO SE CONECTA:** cada pantalla de mes llama a esta función con TODAS las transacciones y el mes elegido.

**QUÉ PASARÍA SI NO EXISTIERA:** los gastos fijos tendrían que escribirse a mano cada mes (el problema original).

**REGLA:** *"Fijo se repite, esporádico es de una sola noche."*

### Middleware

**QUÉ:** código que corre antes de responder, en cada petición.

**PARA QUÉ:** refrescar la sesión y redirigir según esté logueado.

**DÓNDE:** `middleware.ts` (Next.js 16 avisa que el nombre preferido es `proxy`).

**CÓMO SE CONECTA:** si no hay sesión y la ruta es privada → `/login`; si hay sesión y vas a login/register → `/`.

**REGLA:** *"El middleware es el portero: revisa tu boleto antes de dejarte entrar."*

### Despliegue Vercel

**QUÉ:** servicio que compila y publica el proyecto desde GitHub `main`.

**PARA QUÉ:** que la app esté en internet con HTTPS gratis.

**CÓMO:** cada push desencadena build + deploy automáticos.

**DÓNDE:** en Vercel (no hay archivo de configuración propio; se detecta Next.js solo).

**CÓMO SE CONECTA:** variables de entorno en Vercel → las mismas de `.env.local` local.

**REGLA:** *"Vercel es la editorial: cada push que sube a GitHub publica la nueva edición."*

---

## 3. Mapa mental del flujo de datos

```
Usuario (celular) → PWA en el navegador → Next.js la sirve → Supabase guarda/verifica
                            ↑
               Service Worker (copia sin red)
```

## 3.1 Formulario: fecha de fin de un gasto fijo

**QUÉ:** campo "Hasta (opcional)" que aparece solo cuando marcas un gasto como fijo.

**PARA QUÉ:** decirle a un gasto fijo "deja de aparecer a partir de tal mes" sin eliminarlo.

**POR QUÉ:** un gasto fijo puede ser temporal (una suscripción que vence). Antes, sin esto, solo podías eliminarlo. Ya existía el campo `end_date` en la base de datos — solo faltaba exponerlo en la interfaz.

**CÓMO:**
- estado `endDate` en `TransactionForm`.
- visible solo si `isFixed` está activo (`{isFixed && (...)}`).
- validación: si `endDate < startDate` → error y no guarda.
- si está vacío o no es fijo → se guarda `null` (= infinito).

**DÓNDE:** `components/TransactionForm.tsx` (estado + campo + validación + payload) y `components/TransactionList.tsx` (badge).

**CÓMO SE CONECTA:** el `end_date` que guardas alimenta `getTransactionsForMonth`: *"Fijo aplica si `start_date ≤ mes` Y (`end_date` vacío O `end_date ≥ mes`)."*

**QUÉ PASA SI NO EXISTIERA:** un gasto temporal seguiría apareciendo meses de más hasta eliminarlo a mano.

**REGLA:** *"`end_date` vacío = para siempre; `end_date` puesto = hasta ese mes."*

---

## 4. Flujo de una transacción nueva (idea particular concreta)

1. Usuario toca **+** → abre `TransactionForm`.
2. Completa tipo, descripción, monto, categoría, fecha y marca **fijo** si aplica.
3. Si es fijo, puede ponerle "Hasta (opcional)" (fecha de fin).
4. Se envía a Supabase: `insert` en la tabla `transactions`.
5. La app recarga datos → `getTransactionsForMonth` calcula a qué meses aplica.
6. El dashboard muestra el resumen recalculado (`calculateSummary`).

## 5. Reglas de oro para recordar

| Regla | Frase |
|---|---|
| La seguridad no se decide en el frontend | "El frontend miente; la base manda." |
| Fijo vs esporádico | "Fijo se repite, esporádico es de una noche." |
| Fecha de fin de un fijo | "`end_date` vacío = para siempre; puesto = hasta ese mes." |
| YAGNI | "No construyas lo que la idea general no pidió." |
| Proporcionalidad | "Tan simple como sea posible, tan robusto como sea necesario." |
| Evidencia antes que afirmar | "No digo que funciona hasta que lo pruebo." |