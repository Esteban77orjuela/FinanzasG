# Bitácora de Desarrollo

Registro cronológico de cambios. Cada entrada: fecha, objetivo, problema, decisión, implementación, archivos, pruebas, resultado, pendientes, siguiente paso.

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