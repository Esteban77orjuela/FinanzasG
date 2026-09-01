# Bitácora de Desarrollo

Registro cronológico de cambios. Cada entrada: fecha, objetivo, problema, decisión, implementación, archivos, pruebas, resultado, pendientes, siguiente paso.

---

## 2026-09-01 — Iteración 1: Pruebas de la lógica financiera

**Objetivo:** cubrir con pruebas unitarias la lógica que define qué transacciones aplican a cada mes y el cálculo del balance, que es el núcleo del valor del producto.

**Contexto:** la app ya está en producción. Hasta ahora la lógica financiera no tenía ninguna prueba automática; un error silencioso en `getTransactionsForMonth` o `calculateSummary` podría mostrar balances incorrectos a un usuario real.

**Decisión tomada:** usar **Vitest** (framework de pruebas para TypeScript, rápido y con configuración mínima). No requiere navegador: corre funciones puras directamente.

**Implementación:**
- `package.json` — scripts `test` (`vitest run`) y `test:watch`.
- `vitest.config.mts` — configuración: ambiente Node, alias `@` → raíz, inclusión de `*.test.ts`.
- `lib/utils.test.ts` — 22 pruebas: fijos (inicio, meses posteriores, corte por `end_date`, límites de año), esporádicos (solo su mes), casos combinados, resumen (ingresos/gastos/balance, vacíos), formato COP y utilidades de mes.

**Archivos afectados:** `package.json`, `package-lock.json`, `vitest.config.mts`, `lib/utils.test.ts`, `docs/ROADMAP.md`.

**Pruebas realizadas:** `npm test` → **22/22 passed** en ~1s. Confirmados de forma automatizada los criterios de aceptación CA-01 a CA-05 (ver REQUISITOS.md).

**Resultado:** la lógica financiera critica queda cubierta por pruebas. El warning de Vite sobre formato ESM/CJS se eliminó usando extensión `.mts`.

**Pendientes:**
- Iteración 2 — seguridad: revisión RLS, `npm audit`, verificación de secretos en historial.
- Verificar en la app de producción que no hubo impacto funcional (los cambios fueron solo de testing).

**Siguiente paso:** Iteración 2 — Seguridad (revisión OWASP + RLS + `npm audit`).

---

## 2026-09-01 — Iteración 0: Base profesional documental

**Objetivo:** profesionalizar la documentación del proyecto y el repositorio.

**Contexto:** el proyecto ya está desplegado y en uso. La documentación existente estaba desactualizada (README decía "Next.js 15" y estructura obsoleta) y el repo contenía archivos de herramientas de IA (`AGENTS.md`, `CLAUDE.md`) que no corresponden a un repositorio profesional.

**Decisión tomada:**
- Crear la carpeta `docs/` con documentación en español del producto y del proceso.
- Eliminar `AGENTS.md` y `CLAUDE.md`.
- Añadirlos a `.gitignore` para que no vuelvan a committearse (los regenera `next dev` localmente).
- Corregir `README.md`.

**Problema encontrado (histórico):** el despliegue fallaba en Vercel por un conflicto de dependencias (`next-pwa` vs Next.js 16 canary → npm ERESOLVE). Se resolvió con `.npmrc` (`legacy-peer-deps=true`) y luego reemplazando `next-pwa` por un Service Worker manual.

**Implementación:**
- `docs/VISION.md` — idea general y particular del producto.
- `docs/REQUISITOS.md` — RF/RNF, historias de usuario, backlog, criterios de aceptación.
- `docs/ARQUITECTURA.md` — pila, modelo de datos, RLS, decisiones (ADR).
- `docs/METODOLOGIA.md` — metodología ágil/profesional de trabajo.
- `docs/ROADMAP.md` — plan de iteraciones.
- `docs/BITACORA.md` — este archivo.
- `docs/APRENDIZAJE.md` — material de estudio (clase) del proyecto.
- `README.md` — corregido.

**Archivos afectados:** `docs/*`, `README.md`, `.gitignore` (+ eliminación de `AGENTS.md`, `CLAUDE.md`).

**Pruebas realizadas:** revisión manual de que ningún archivo de documentación afecta el runtime; la app en producción no se ve alterada por estos cambios.

**Resultado:** repo profesional, documentado en español, sin archivos de herramientas.

**Pendientes:**
- Ejecutar la Iteración 1 (testing de lógica financiera).
- Confirmar que `next dev` no re-genere rastros en futuros commits.

**Siguiente paso:** Iteración 1 — configurar Vitest y pruebas de `lib/utils.ts`.