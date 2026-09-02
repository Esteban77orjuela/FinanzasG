# Roadmap

Plan de iteraciones. El estado de cada item se actualiza en la bitácora.

## Iteración 0 — Base profesional documental
- [ ] Crear estructura `docs/` (visión, requisitos, arquitectura, metodología, roadmap, bitácora, aprendizaje).
- [ ] Limpiar archivos de herramientas (`AGENTS.md`, `CLAUDE.md`) y añadirlos a `.gitignore`.
- [ ] Corregir `README.md` (versión real, estructura, enlaces a docs).
- [x] Proyecto desplegado y operativo en Vercel (referencia histórica).

## Iteración 1 — Calidad: pruebas de la lógica financiera
- [x] Configurar framework de pruebas (Vitest).
- [x] Tests de `getTransactionsForMonth` (fijos, esporádicos, rangos de fechas).
- [x] Tests de `calculateSummary` (balance, casos mixtos, vacío).
- [x] Tests de `formatCurrency` / utilitarios de mes.
- [x] Confirmar ciertos criterios de aceptación (CA-01 a CA-05).

## Iteración 2 — Seguridad
- [x] Revisión de RLS: políticas reforzadas para impedir que un cliente altere `user_id` (INSERT y UPDATE).
- [x] Revisión OWASP básica: headers de seguridad ampliados (Referrer-Policy, Permissions-Policy).
- [x] Verificación de ausencia de XSS (sin `dangerouslySetInnerHTML`/`innerHTML`/`eval`).
- [x] `npm audit`: 0 vulnerabilidades.
- [x] Verificación de secretos: ninguno versionado; `.env.local.example` corregido a placeholders.
- [x] Aplicar en Supabase (SQL Editor) las políticas RLS reforzadas del `migration.sql`.

## Iteración 3 — Validación de UX en producción
- [x] QA manual con criterios de aceptación (CA-01 a CA-06).
- [x] Verificar instalación PWA en dispositivo real.
- [ ] Corregir bugs detectados en uso real (proyecto ya en producción).

## Iteración 4 — Fechas de fin para gastos fijos
- [x] Campo "Hasta (opcional)" en el formulario de transacciones (solo para fijos).
- [x] Validación: fecha de fin posterior a la de inicio; vacío = indefinido.
- [x] Envío correcto de `end_date` en insert y update.
- [x] Indicador visual "fin" en el badge de gastos fijos con fecha de fin.
- [x] Desplegado en producción (commit 1f09c6c).
- [x] Verificar la funcionalidad en producción (QA).

## Iteración 5 — Modo claro y oscuro
- [x] Paleta clara en variables CSS por `data-theme` (light/dark).
- [x] Toggle claro/oscuro en la navbar con persistencia en `localStorage`.
- [x] Sin parpadeo al cargar (script vía `useServerInsertedHTML`).
- [x] Corrección del hydration: Next bajado a la versión estable 16.3.4.
- [ ] QA visual en producción (dashboard, movimientos, categorías, login).

## Iteración 5+ — Funcionalidades futuras (pendientes de priorizar)
- [ ] Presupuesto por categoría.
- [ ] Exportación de datos (CSV/Excel).
- [ ] Búsqueda/texto en movimientos.

## Estado del proyecto
- **Desplegado:** https://finanzas-g-one.vercel.app
- **Repositorio:** GitHub (privado) — `Esteban77orjuela/FinanzasG`
- **Entorno:** producción en uso real. Toda iteración debe minimizar impacto en el servicio activo.