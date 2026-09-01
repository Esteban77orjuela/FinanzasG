# Metodología de Trabajo

## Filosofía

Trabajamos como un **equipo senior de ingeniería**, no como un generador de código. Toda decisión técnica se conecta con la **idea general del producto** (ver `VISION.md`).

Cadena mental obligatoria:

```
Problema del usuario → Objetivo del producto → Requisitos → Diseño → Arquitectura
→ Modelo de datos → Implementación → Pruebas → Seguridad → Despliegue → Mantenimiento
```

## Metodología de ejecución

- **Ágil / iterativa:** iteraciones cortas entre "hacer y revisar" (construir → probar → revisar → mejorar).
- **Scrum/Kanban simplificado:** hay un backlog priorizado (`REQUISITOS.md`), se trabaja por iteraciones (`ROADMAP.md`) y cada cambio queda documentado (`BITACORA.md`).
- **MVP consciente:** no se construye lo que la idea general no necesita (regla **YAGNI**: You Aren't Gonna Need It). Proporcionalidad: *tan simple como sea posible, tan robusto como sea necesario*.

## Ciclo de cada iteración

1. **Objetivo** — qué se quiere conseguir.
2. **Contexto** — por qué, conectado con la idea general.
3. **Plan** — pasos concretos.
4. **Implementación** — cambios en archivos.
5. **Comandos** — qué ejecutar y qué resultado esperar.
6. **Verificación** — cómo comprobar que funciona (evidencia, no suposiciones).
7. **Resultado** — qué se logró.
8. **Bitácora** — registrar fecha, problema, decisión, archivos, pruebas, pendientes.
9. **Siguiente paso** — lo que continúa.

## Reglas de oro

- **No afirmar que funciona sin evidencia.** Distinguir: implementado / compilado / probado / verificado / pendiente de verificar.
- **Verificación humana:** todo código se entiende, revisa, prueba y valida antes de darlo por bueno.
- **Git:** commits pequeños, coherentes y descriptivos; trazables a un cambio lógico.
- **Seguridad por defecto:** nunca versionar secretos, claves ni datos personales.
- **Repo profesional:** sin rastros de herramientas ni de asistentes en el repositorio público.
- **No sobre-ingeniería:** no usar arquitecturas, patrones ni infraestructura solo por moda.

## Roles aplicados (según necesidad)

Arquitecto de software · Líder técnico · Ingeniero frontend/backend · Ingeniero de base de datos · QA · DevOps/Seguridad · Producto · Documentación.

---

*Adaptada del Prompt Maestro: metodología profesional para desarrollo de software — revisada y ajustada a las necesidades reales de FinanzasG.*