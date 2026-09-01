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
- [ ] Revisión de RLS: verificar que insert/update no permitan tomar `user_id` ajeno.
- [ ] Revisión OWASP básica (XSS, headers, dependencias con vulnerabilidades: `npm audit`).
- [ ] Verificar que no existan secretos en el historial de Git.

## Iteración 3 — Validación de UX en producción
- [ ] QA manual con criterios de aceptación (CA-01 a CA-06).
- [ ] Corregir bugs detectados en uso real (proyecto ya en producción).

## Iteración 4+ — Funcionalidades futuras (pendientes de priorizar)
- [ ] Presupuesto por categoría.
- [ ] Exportación de datos (CSV/Excel).
- [ ] Fecha fin renovable para gastos fijos desde la UI.
- [ ] Búsqueda/texto en movimientos.
- [ ] Modo claro/oscuridad.

## Estado del proyecto
- **Desplegado:** https://finanzas-g-one.vercel.app
- **Repositorio:** GitHub (privado) — `Esteban77orjuela/FinanzasG`
- **Entorno:** producción en uso real. Toda iteración debe minimizar impacto en el servicio activo.