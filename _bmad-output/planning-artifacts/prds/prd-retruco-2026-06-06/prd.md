---
title: "Retruco PRD"
status: "final"
created: "2026-06-06"
updated: "2026-06-06"
finalized: "2026-06-06"
---

# Retruco — Documento de Requerimientos de Producto

## Visión

Retruco es una plataforma web para gestionar y visualizar un campeonato de Truco uruguayo organizado en series mensuales. Permite que los administradores de la liga carguen resultados y operen el torneo desde cualquier dispositivo, mientras los jugadores y visitantes consultan tablas, posiciones y resultados en tiempo real.

El MVP apunta a un lanzamiento real en producción con costo mínimo, bajo mantenimiento y escala acotada para hasta ~200 personas. Prioriza claridad operativa, legibilidad de tablas y una experiencia pública moderna e intuitiva — especialmente en celulares.

---

## Usuarios y roles

### Visitante / Jugador (sin login)

Cualquier persona que accede al sitio público sin necesidad de cuenta. Consulta tablas de posiciones por serie, tabla global y resultados de jornadas. La mayoría accede desde el celular, habitualmente durante o después de una jornada de juego.

### Administrador (con login)

Usuario autorizado de la liga. Gestiona todas las entidades del torneo: series, bares, parejas, jornadas y partidos. En el MVP todos los administradores tienen los mismos permisos completos.

---

## Alcance del MVP

### Dentro del alcance

- Un único torneo activo con múltiples series organizadas por día de juego
- Jornadas mensuales por serie con carga manual de partidos y resultados
- Cálculo automático de puntos de tabla, tantos y criterios de desempate
- Tabla pública de posiciones por serie y tabla global
- Consulta pública de jornadas y resultados de partidos
- Panel de administración con autenticación
- Interfaz mobile-first, moderna y estéticamente coherente con la identidad del Truco uruguayo

### Fuera de alcance inicial

- Login de jugadores o visitantes
- Generación automática de fixtures
- Múltiples campeonatos o temporadas simultáneas
- Notificaciones, pagos o inscripciones online
- Roles de administrador diferenciados (todos tienen los mismos permisos en el MVP)
- Reportes estadísticos avanzados o exportación de datos

---

## Contexto del dominio

### Estructura del campeonato

El campeonato tiene una única instancia activa. Se organiza en **series** según el día de juego (ej.: Serie Lunes, Serie Miércoles Marlon). Cada serie tiene un **bar** sede y sus propias **parejas** inscriptas.

Una misma pareja puede participar en más de una serie. Cuando esto ocurre, puntúa de forma independiente en la tabla de cada serie donde está inscripta.

Mensualmente se disputa una **jornada** por serie, compuesta por varios **partidos** entre parejas de esa misma serie.

### Mecánica de puntaje

Cada partido se juega a 40 tantos. El sistema registra el resultado (tantos de cada pareja) y determina automáticamente la ganadora.

| Resultado | Puntos de tabla |
|-----------|----------------|
| Ganado    | 2 puntos        |
| Perdido   | 0 puntos        |

**Criterios de desempate en tabla de serie (en orden de prioridad):**

1. Mayor cantidad de puntos de tabla
2. Mayor cantidad de tantos acumulados (suma de tantos en todos los partidos, ganados y perdidos)
3. Mayor diferencia de tantos (tantos a favor − tantos en contra)
4. Mayor cantidad de tantos a favor
5. Si persiste el empate: posición compartida visible en la tabla

### Tabla global

En la tabla global cada pareja aparece una sola vez. Se toman los datos de la **serie donde obtuvo más puntos de tabla**. Los criterios de desempate de la global son los mismos que los de la tabla por serie, aplicados sobre los datos de esa mejor serie de cada pareja.

Si una pareja tiene el mismo puntaje máximo en dos series propias, se selecciona la de mayor cantidad de tantos acumulados como criterio para elegir la serie de referencia en la global.

---

## Jornadas de usuario

### UJ-1 — Marcelo carga los resultados de una jornada

*Marcelo organiza la liga. La jornada de los lunes terminó y tiene los resultados anotados en papel.*

1. Ingresa al panel de administración desde su celular y se autentica con su cuenta.
2. Navega a la Serie Lunes y crea una nueva jornada con su número y fecha.
3. Agrega los partidos uno a uno: selecciona las dos parejas, ingresa los tantos de cada una.
4. El sistema determina automáticamente la ganadora y actualiza los cálculos de la tabla.
5. Guarda y comparte el link de la tabla de posiciones con el grupo de WhatsApp de la liga.

### UJ-2 — Silvana consulta posiciones desde el celular

*Silvana juega en la Serie Miércoles. Quiere ver la tabla después de la última jornada.*

1. Abre el link de Retruco en el navegador del celular.
2. Desde la pantalla principal ve un resumen de las series activas.
3. Toca la Serie Miércoles y ve la tabla de posiciones con su pareja ubicada.
4. Toca la última jornada para ver los resultados de cada partido jugado esa noche.
5. Navega a la tabla global para ver cómo está su pareja en el campeonato general.

---

## Features y requerimientos funcionales

### F1 — Autenticación de administradores

**FR-001** El sistema debe permitir que administradores inicien sesión con email y contraseña.

**FR-002** El sistema debe mantener la sesión activa durante un período razonable sin requerir re-autenticación frecuente.

**FR-003** El sistema debe permitir cerrar sesión manualmente.

**FR-004** Toda operación de escritura (crear, editar, desactivar, cargar resultados) debe requerir sesión activa de administrador.

**FR-005** El sistema debe soportar múltiples administradores simultáneos con los mismos permisos.

El alta de nuevos administradores se gestiona directamente en el sistema (cuentas predefinidas), sin flujo de auto-registro. El número de cuentas admin es pequeño y fijo en el MVP.

---

### F2 — Gestión de entidades del torneo

#### F2.1 — Series

**FR-010** El sistema debe permitir crear una serie con nombre, día de juego y bar asociado.

**FR-011** El nombre de una serie debe ser editable en cualquier momento (ej.: de "Serie Lunes" a "Serie Lunes El Palmar").

**FR-012** El sistema debe permitir desactivar una serie. Las series desactivadas no aparecen en las vistas públicas pero conservan su historial completo.

**FR-013** El panel de administración debe listar todas las series activas e inactivas.

#### F2.2 — Bares

**FR-020** El sistema debe permitir crear un bar con al menos su nombre.

**FR-021** El sistema debe permitir editar el nombre de un bar.

**FR-022** El sistema debe permitir desactivar un bar.

**FR-023** Un bar puede estar asociado a múltiples series.

#### F2.3 — Parejas

**FR-030** El sistema debe permitir crear una pareja identificada por nombre y apellido de cada uno de sus dos integrantes.

**FR-031** El sistema debe permitir inscribir una pareja en una o más series.

**FR-032** Una pareja inscripta en más de una serie acumula puntos de forma independiente en la tabla de cada serie.

**FR-033** El sistema debe permitir editar el nombre de los integrantes de una pareja.

**FR-034** El sistema debe permitir desactivar la inscripción de una pareja en una serie. Los partidos ya registrados de esa pareja se conservan en el historial.

#### F2.4 — Jornadas

**FR-040** El sistema debe permitir crear una jornada para una serie con número de jornada y fecha.

**FR-041** El sistema debe permitir editar el número y la fecha de una jornada.

**FR-042** El sistema debe permitir desactivar una jornada. Las jornadas desactivadas no aparecen en la vista pública pero conservan sus partidos.

**FR-043** El sistema debe listar las jornadas de cada serie en orden cronológico.

---

### F3 — Carga manual de partidos y resultados

**FR-050** El sistema debe permitir agregar un partido a una jornada seleccionando dos parejas inscriptas en esa serie e ingresando los tantos de cada una.

**FR-051** El sistema debe determinar automáticamente la pareja ganadora según los tantos ingresados.

**FR-052** El sistema debe permitir editar el resultado de un partido ya cargado.

**FR-053** El sistema debe permitir desactivar (dar de baja) un partido cargado por error, recalculando automáticamente las estadísticas.

**FR-054** Al guardar un partido, el sistema debe calcular y actualizar automáticamente para cada pareja involucrada:
- Puntos de tabla (ganadora +2, perdedora +0)
- Tantos a favor, tantos en contra y diferencia de tantos en la serie
- Tantos acumulados totales en la serie
- Posición en la tabla de la serie

**FR-055** Si se edita o desactiva un partido, todos los cálculos asociados deben recalcularse automáticamente.

---

### F4 — Tablas y rankings públicos

#### F4.1 — Tabla por serie

**FR-060** La vista pública debe mostrar una tabla de posiciones por cada serie activa.

**FR-061** La tabla de cada serie debe mostrar por pareja: posición, nombre de la pareja (ambos integrantes), partidos jugados, ganados, perdidos, tantos a favor, tantos en contra, diferencia de tantos, tantos acumulados y puntos de tabla.

**FR-062** La tabla debe ordenarse aplicando en cascada los criterios de desempate confirmados:
1. Puntos de tabla (descendente)
2. Tantos acumulados (descendente)
3. Diferencia de tantos (descendente)
4. Tantos a favor (descendente)
5. Posición compartida si persiste el empate

**FR-063** La tabla debe actualizarse automáticamente cada vez que se carga, edita o desactiva un partido.

**FR-064** La vista de tabla debe indicar el bar sede y el día de juego de la serie.

#### F4.2 — Tabla global

**FR-070** La vista pública debe mostrar una tabla global que incluye a cada pareja una sola vez.

**FR-071** Para cada pareja, la tabla global usa los datos (puntos de tabla, tantos, etc.) de la serie donde obtuvo su mayor cantidad de puntos de tabla.

**FR-072** Si una pareja tiene el mismo puntaje máximo en dos series propias, se usa la serie con mayor cantidad de tantos acumulados para seleccionar la serie de referencia en la global.

**FR-073** La tabla global aplica los mismos cinco criterios de desempate que la tabla por serie, usando los datos de la mejor serie de cada pareja.

**FR-074** La tabla global debe indicar qué serie se tomó como referencia para el puntaje de cada pareja.

---

### F5 — Consulta pública de jornadas y resultados

**FR-080** La vista pública debe listar las jornadas de cada serie activa en orden cronológico, indicando número y fecha.

**FR-081** Al seleccionar una jornada, el visitante debe ver todos los partidos jugados con: nombres de ambas parejas, tantos de cada una y pareja ganadora.

**FR-082** La vista pública debe permitir navegar entre series para consultar tablas y jornadas. Dado que cada serie corresponde a un día de juego, la navegación por serie cubre implícitamente el filtro por día.

**FR-083** La vista pública debe mostrar el bar donde se juega cada serie.

**FR-084** Los jugadores se muestran solo con nombre y apellido. No se publican emails, teléfonos ni ningún otro dato sensible.

---

## Requerimientos no funcionales

**NFR-001 — Mobile-first.** La interfaz pública debe ser completamente funcional y legible en pantallas desde 375px de ancho. Las tablas de posiciones no deben requerir scroll horizontal para mostrar la información esencial.

**NFR-002 — Performance.** Las páginas públicas deben cargar en menos de 3 segundos en conexiones 4G estándar. Las tablas con hasta 30 parejas deben renderizar sin degradación perceptible.

**NFR-003 — Costo operativo mínimo.** La primera versión debe poder operar con herramientas gratuitas o de costo mínimo (target: $0/mes). La arquitectura debe permitir migrar a opciones pagas si el proyecto crece sin rediseño de interfaz.

**NFR-004 — Desacoplamiento frontend/backend.** El frontend en React debe estar desacoplado del backend. No debe quedar atado a un proveedor específico de hosting o base de datos, para permitir migración futura.

**NFR-005 — Privacidad básica.** Solo se exponen públicamente nombre y apellido de los jugadores. No se almacenan ni publican datos sensibles.

**NFR-006 — Escala acotada.** El sistema debe operar sin degradación para hasta ~200 usuarios consumiendo páginas públicas. Las escrituras simultáneas son excepcionales (solo admins cargando resultados).

**NFR-007 — Estética y coherencia visual.** La interfaz pública debe ser moderna y minimalista, con identidad visual inspirada en el Truco uruguayo. El panel de administración debe priorizar claridad operativa.

**NFR-008 — Intuitividad operativa.** El panel de administración debe poder usarse sin documentación por alguien con conocimiento básico de celular/computadora. Las acciones críticas (desactivar, eliminar datos) deben pedir confirmación.

---

## Métricas de éxito

| Métrica | Objetivo | Contra-métrica |
|---------|----------|----------------|
| Jornadas reales cargadas en producción | ≥ 1 en el primer mes de uso | Errores de carga reportados > 5% de los partidos ingresados |
| Tiempo de carga de tabla de serie | < 3s en conexión 4G | Bounce rate en vista de tabla > 50% |
| Adopción del panel admin | Todos los admins de la liga operando sin soporte externo | Consultas de soporte > 2 por semana |
| Exactitud de cálculos | 0 errores de cálculo reportados por jugadores al comparar con control manual | Cualquier discrepancia detectada entre tabla digital y verificación manual |
| Costo mensual de operación | $0 en MVP | Costo mensual > $10 USD |

---

## Decisiones de soporte (resueltas)

| # | Decisión | Resolución |
|---|----------|------------|
| D-1 | Proveedor de persistencia y autenticación | Supabase (PostgreSQL + auth integrada). Decisión formal en arquitectura. Restricción PRD: gratuito, admins predefinidos, modelo relacional. |
| D-2 | Criterio de selección de mejor serie en tabla global cuando hay empate total (puntos + tantos acumulados) | Se aplican en cascada: diferencia de tantos, luego tantos a favor, luego orden alfabético de nombre de serie. Caso extremadamente poco probable en la práctica. |
| D-3 | ¿El sistema valida que el ganador llegue exactamente a 40 tantos? | No. El admin ingresa los tantos reales; el sistema determina el ganador por mayor puntaje. No se fuerza el valor 40 para dar flexibilidad ante casos de borde. |
| D-4 | Dominio web para el MVP | URL gratuita del proveedor de hosting (ej.: retruco.vercel.app). Dominio propio puede comprarse en el futuro sin cambios al sistema. |

---

*Próximos pasos recomendados: `bmad-ux` → `bmad-create-architecture` → `bmad-create-epics-and-stories`*

