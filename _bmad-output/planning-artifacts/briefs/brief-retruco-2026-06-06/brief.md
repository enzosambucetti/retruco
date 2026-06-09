---
title: "Retruco Product Brief"
status: "ready-for-prd"
created: "2026-06-06"
updated: "2026-06-06"
---

# Retruco Product Brief

## Resumen ejecutivo

Retruco será una plataforma web online para administrar y visualizar un campeonato de Truco uruguayo organizado por series mensuales. El producto permitirá que administradores carguen y gestionen resultados, mientras jugadores y visitantes consultan tablas públicas, resultados y posiciones.

El primer objetivo es lanzar un MVP real a producción, con costos mínimos, bajo mantenimiento y escala acotada para un uso esperado de hasta aproximadamente 200 personas. La solución debe priorizar claridad, velocidad de carga y facilidad de operación por encima de automatizaciones complejas.

## Usuarios principales

- **Administradores del torneo:** usuarios con login que pueden crear, editar y eliminar series, bares, parejas, jornadas y partidos.
- **Jugadores y visitantes:** usuarios sin login que consultan tablas, resultados y posiciones públicas.

## Contexto del campeonato

El campeonato se organiza en series según día de juego: lunes, martes, miércoles, jueves, viernes y sábado. Cada serie tiene sus propias parejas participantes, una frecuencia mensual de juego y un bar asociado.

Las series pueden crearse inicialmente con nombres simples como `Serie Lunes`, `Serie Martes` o `Serie Miércoles`. Luego, los administradores pueden editar esos nombres para reflejar mejor el bar o la identidad de la serie, por ejemplo `Serie Miércoles Marlon`.

Cada jornada mensual incluye partidos entre parejas. En una jornada típica, cada pareja puede jugar varios partidos, por ejemplo cinco. El MVP no necesita generar fixtures automáticamente: los administradores cargan los partidos y resultados manualmente.

## Mecánica de puntaje

Cada partido de Truco se disputa a 40 tantos. El sistema registra el resultado final del partido, por ejemplo `40 a 25`, junto con las parejas participantes y la pareja ganadora.

La tabla rankea parejas, no jugadores individuales.

- **Partido ganado:** la pareja suma 2 puntos de tabla.
- **Partido perdido:** la pareja suma 0 puntos de tabla.
- **Resultado exacto:** se conserva para cálculos de desempate.

En caso de empate en puntos de tabla, se suman los tantos acumulados de todos los partidos jugados por cada pareja empatada, incluyendo partidos ganados y perdidos. Por ejemplo, si una pareja ganó dos partidos y perdió uno haciendo 25 tantos en la derrota, su total de desempate sería `40 + 40 + 25 = 105`.

Si el empate ocurre entre parejas que solo ganaron partidos, se usa la diferencia de tantos como criterio de desempate.

## Alcance del MVP

El MVP contempla un único torneo activo con múltiples series mensuales. Las parejas son fijas dentro de una serie, pero una misma pareja puede anotarse también en otra serie.

El sistema debe permitir:

- **Tablas por serie:** ranking de parejas dentro de cada serie.
- **Tabla global:** ranking combinado de todas las series.
- **Filtros públicos:** consulta por día, serie o jornada.
- **Resultados públicos:** visualización de partidos cargados y sus resultados.
- **Panel administrador:** login para varios administradores.
- **Gestión completa:** alta, edición y eliminación de series, bares, parejas, jornadas y partidos.
- **Carga manual:** registro manual de partidos y resultados.
- **Cálculo automático:** puntos de tabla, tantos acumulados, tantos a favor, tantos en contra y diferencia.

## Fuera de alcance inicial

Para mantener el MVP simple y barato, no forman parte del primer alcance:

- **Login de jugadores:** los jugadores solo consultan información pública.
- **Fixture automático:** los administradores cargan partidos manualmente.
- **Múltiples campeonatos o temporadas:** el MVP se enfoca en un único torneo activo.
- **Automatizaciones avanzadas:** notificaciones, pagos, inscripciones online o reportes complejos quedan para una etapa posterior.

## Restricciones y lineamientos técnicos

- Debe ser una aplicación web online.
- Debe poder salir a producción como MVP real.
- Debe mantener costos lo más bajos posible.
- El tráfico esperado es bajo: hasta aproximadamente 200 personas.
- El frontend debe desarrollarse en React y mantenerse desacoplado para poder conectarse más adelante a un backend o desplegarse fuera de Vercel.
- La primera versión debe priorizar una solución gratis y sencilla.
- La arquitectura debe evitar acoplar la interfaz a un proveedor específico de hosting o backend.

## Identidad visual

La experiencia pública debe sentirse como un sitio moderno de torneo o liga, con una estética minimalista inspirada en lo criollo, el Truco y lo uruguayo. La interfaz debe priorizar legibilidad de tablas, resultados y rankings, especialmente en dispositivos móviles.

Los jugadores se muestran públicamente por nombre y apellido. No se requiere publicar emails, teléfonos ni otros datos sensibles.

## Riesgos y decisiones pendientes

- **Persistencia y autenticación:** falta definir proveedor para datos y login de administradores.
- **Modelo de datos:** el PRD debe precisar campos de series, bares, parejas, jornadas y partidos.
- **Orden exacto de tablas:** el PRD debe confirmar el orden de criterios: puntos de tabla, tantos acumulados, diferencia de tantos y posibles criterios secundarios.
- **Operación admin:** conviene definir permisos simples para varios administradores, aunque todos puedan gestionar todo en el MVP.

## Resultado esperado

Retruco debe permitir que una liga de Truco gestione su campeonato mensual sin planillas manuales dispersas, mostrando tablas confiables y resultados claros para jugadores y visitantes. El éxito del MVP se mide por poder cargar jornadas reales, publicar posiciones actualizadas y operar el torneo con bajo costo y poca fricción administrativa.
