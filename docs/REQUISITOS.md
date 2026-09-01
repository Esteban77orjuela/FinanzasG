# Requisitos del Producto

## Requisitos Funcionales (RF)

| ID | Descripción | Estado |
|---|---|---|
| RF-01 | El usuario puede **registrarse** con correo y contraseña. | Implementado |
| RF-02 | El usuario puede **iniciar y cerrar sesión**. | Implementado |
| RF-03 | El usuario puede **crear, editar, ver y eliminar categorías** de tipo ingreso o gasto, con nombre, ícono (emoji) y color. | Implementado |
| RF-04 | El usuario puede **registrar una transacción** (ingreso o gasto) con descripción, monto, categoría, fecha y tipo fijo/esporádico. | Implementado |
| RF-05 | Una transacción **fija** aparece **automáticamente en todos los meses** desde su fecha de inicio (de forma ilimitada). | Implementado |
| RF-06 | Una transacción **esporádica** solo aparece en el **mes de su fecha**. | Implementado |
| RF-07 | El usuario puede **editar y eliminar** cualquier transacción. | Implementado |
| RF-08 | El dashboard muestra por mes: **total ingresos, total gastos y balance**. | Implementado |
| RF-09 | El usuario puede **navegar entre meses** (pasado y presente; no futuro). | Implementado |
| RF-10 | El usuario puede **filtrar** movimientos por tipo (todos / ingresos / gastos). | Implementado |
| RF-11 | La aplicación es **instalable** como PWA en Android e iOS. | Implementado |
| RF-12 | Las rutas privadas **exigen sesión activa**; las de auth redirigen a usuarios logueados. | Implementado |

## Requisitos No Funcionales (RNF)

| ID | Requisito | Estado |
|---|---|---|
| RNF-01 | **Seguridad:** cada usuario solo ve y modifica sus propios datos (RLS en Supabase). | Implementado |
| RNF-02 | **Confidencialidad:** credenciales y claves no se versionan en el repositorio. | Implementado |
| RNF-03 | **Compatibilidad:** funciona en Android e iOS como app instalable (PWA). | Implementado |
| RNF-04 | **Idioma/locale:** interfaz en español, moneda en pesos colombianos (COP). | Implementado |
| RNF-05 | **Rendimiento:** las consultas principales están indexadas en la base de datos. | Implementado |
| RNF-06 | **Mantenibilidad:** tipado estricto de TypeScript y tipo de base de datos definido. | Implementado |
| RNF-07 | **Calidad:** la lógica financiera crítica cuenta con pruebas automatizadas. | **Pendiente** |
| RNF-08 | **Disponibilidad:** despliegue en Vercel con HTTPS y despliegue automático desde la rama principal. | Implementado |

## Historias de Usuario

> "Como usuario, quiero registrar mi arriendo una sola vez como gasto fijo, para que aparezca todos los meses sin volver a escribirlo."

> "Como usuario, quiero registrar una compra esporádica en un mes, para que no contamine los meses siguientes."

> "Como usuario, quiero ver mis ingresos, gastos y balance de cada mes, para saber si gasté más de lo que gané."

## Backlog priorizado (estado inicial)

1. **Pruebas de la lógica financiera** (fijos, esporádicos, resumen) — riesgo más alto.
2. **Pruebas de seguridad** (RLS) y revisión OWASP básica.
3. **Mejoras de UX** detectadas en validación (ver ROADMAP).
4. Nuevas funcionalidades propuestas (presupuestos, exportación, etc.).

## Criterios de aceptación — Modo QA (definidos para validación)

- **CA-01:** Crear un gasto fijo con fecha de inicio → aparece en ese mes y todos los siguientes.
- **CA-02:** Crear un gasto esporádico → aparece solo en su mes.
- **CA-03:** Editar un fijo (monto/categoría) → refleja el cambio en todos los meses que aplica.
- **CA-04:** Eliminar un fijo → desaparece de todos los meses futuros.
- **CA-05:** El balance = ingresos − gastos del mes, sin error de redondeo.
- **CA-06:** Un usuario sin sesión no puede ver datos; al cerrar sesión no puede acceder a rutas privadas.