# Flujos de Experiencia - Sistema de Orquestación Logística Puerto de Chancay

## Documento de Diseño de Experiencia de Usuario

Basado en los Objetivos del Proyecto y la implementación actual del sistema ChancayFlow.

---

## 1. FLUJO DE EXPERIENCIA: CONDUCTOR

### Objetivo del Flujo
Permitir que el conductor reciba instrucciones granulares sobre cuándo, cómo y en qué secuencia debe operar, considerando variables contextuales peruanas (tráfico, clima, obras viales) para optimizar su llegada al puerto.

---

### PASO 1: Acceso Inicial y Autenticación

**Experiencia del Conductor:**
- El conductor accede a la aplicación ChancayFlow desde su dispositivo móvil
- Ingresa sus credenciales (usuario/contraseña) o escanea código QR de identificación del vehículo
- El sistema valida su identidad y permisos (MTC/SUTRAN, seguro activo)

**Funcionamiento del Software:**
```
1. Validar credenciales contra base de datos
2. Verificar estado de permisos:
   - MTC/SUTRAN: Habilitado/No habilitado
   - Seguro de carga: Activo/Vencido
   - Estado del vehículo: Operativo/Mantenimiento
3. Si todo está en orden → Redirigir a Dashboard
4. Si hay problemas → Mostrar alertas específicas y bloquear acceso
```

**Componentes Técnicos:**
- `HomeView.vue` - Selector de rol
- Backend: Endpoint de autenticación y validación de permisos

---

### PASO 2: Visualización de Horarios Disponibles (Time Slots)

**Experiencia del Conductor:**
- El conductor ve una lista de horarios disponibles para ingresar al puerto
- Cada horario muestra:
  - Hora de inicio y fin
  - Capacidad disponible (ej: "3 de 10 camiones")
  - Estado del túnel viaducto (abierto/cerrado)
  - Tiempo estimado de viaje desde su ubicación actual
- Los horarios están ordenados por disponibilidad y optimización de ruta

**Funcionamiento del Software:**
```
1. Obtener ubicación GPS del conductor (si está disponible)
2. Consultar slots disponibles en la base de datos:
   SELECT * FROM time_slots 
   WHERE available_capacity > 0 
   AND start_time >= NOW()
   ORDER BY start_time ASC
3. Calcular tiempo estimado de viaje para cada slot:
   - Usar API de routing (Google Maps/Waze) con variables contextuales:
     * Estado actual de carreteras
     * Obras viales activas
     * Tráfico en tiempo real
     * Condiciones climáticas
4. Aplicar algoritmo de optimización:
   - Priorizar slots que minimicen tiempo de espera
   - Considerar capacidad del túnel viaducto
   - Evitar sobrecarga en horarios pico
5. Mostrar slots con recomendación visual (mejor opción destacada)
```

**Componentes Técnicos:**
- `DriverDashboard.vue` - Vista principal
- `SlotCard.vue` - Tarjeta de horario
- `bookingStore.js` - Estado y lógica de slots
- Backend: `GET /api/slots` - Endpoint de slots disponibles

**Variables Contextuales Integradas:**
- Estado de carreteras (MTC/SUTRAN)
- Obras viales activas (cronograma)
- Patrones horarios de tráfico regional
- Condiciones climáticas (SENAMHI)

---

### PASO 3: Selección y Reserva de Horario

**Experiencia del Conductor:**
- El conductor selecciona un horario disponible
- Ingresa la placa de su vehículo (validación automática)
- El sistema confirma la reserva y genera un "Pase de Acceso Digital"
- Se muestra un código QR único para el acceso

**Funcionamiento del Software:**
```
1. Usuario selecciona slot_id y proporciona truck_plate
2. Validar datos:
   - Placa válida (formato peruano)
   - Slot aún disponible
   - Usuario tiene permisos activos
3. Iniciar transacción MySQL:
   BEGIN TRANSACTION;
   SELECT * FROM time_slots WHERE id = ? FOR UPDATE;
   -- Verificar capacidad disponible
   IF available_capacity > 0 THEN
     INSERT INTO bookings (slot_id, user_id, truck_plate, qr_token)
     UPDATE time_slots SET available_capacity = available_capacity - 1
     COMMIT;
   ELSE
     ROLLBACK;
     ERROR: "Slot ya no disponible"
   END
4. Generar QR token único (UUID + hash)
5. Calcular ruta optimizada:
   - Integrar con API de routing
   - Considerar variables contextuales
   - Generar instrucciones de navegación
6. Retornar booking confirmado con:
   - Booking ID
   - QR Token
   - Instrucciones de ruta
   - Tiempo estimado de llegada
```

**Componentes Técnicos:**
- `SlotCard.vue` - Componente de selección
- `bookingStore.js` - `createBooking()` action
- Backend: `POST /api/bookings` - Endpoint de reserva
- Backend: `bookingController.js` - Lógica transaccional con `SELECT ... FOR UPDATE`

**Prevención de Condiciones de Carrera:**
- Uso de `SELECT ... FOR UPDATE` para bloqueo de fila
- Transacciones MySQL para atomicidad
- Validación de capacidad antes de confirmar

---

### PASO 4: Visualización del Pase Digital y Estado de Viaje

**Experiencia del Conductor:**
- El conductor ve su "Pase de Acceso Digital" (estilo boarding pass)
- Información mostrada:
  - Placa del vehículo (con indicador ecológico si aplica)
  - ID de reserva
  - Ruta asignada: "Acceso Túnel Viaducto - Carril 2"
  - Estado aduanero: "Pre-aprobado (Canal Verde)" o "Seleccionado Inspección"
  - Validaciones normativas: MTC/SUTRAN y Seguro
  - Instrucción de timing: "Mantener velocidad constante. Su ventana de ingreso en el túnel abre en: 35 min"
- **Banner de Estado de Viaje (TravelStatusBanner):**
  - GO: "Ruta Habilitada" (verde) - Puede proceder
  - HOLD: "DETENER MARCHA - ESPERAR" (rojo, animado) - Debe detenerse
  - REROUTE: "Nueva Ruta Asignada" (azul) - Ruta alternativa activada
- **Mapa Interactivo:**
  - Muestra ruta asignada en azul
  - Marcador de ubicación actual del conductor
  - Marcador del puerto
  - Actualización en tiempo real si hay REROUTE

**Funcionamiento del Software:**
```
1. Mostrar información del booking confirmado
2. Consultar estado de viaje en tiempo real:
   - Integrar con sistema de monitoreo de tráfico (Waze API)
   - Consultar alertas de infraestructura (MTC/SUTRAN)
   - Verificar condiciones climáticas (SENAMHI)
   - Analizar estado del túnel viaducto
3. Determinar estado de viaje:
   IF (congestión_severa OR accidente OR túnel_cerrado) THEN
     status = 'HOLD'
     reason = motivo_detallado
   ELSE IF (ruta_alternativa_disponible AND ruta_principal_bloqueada) THEN
     status = 'REROUTE'
     reason = "Acceso Túnel Viaducto temporalmente cerrado..."
   ELSE
     status = 'GO'
   END
4. Actualizar mapa:
   - Si REROUTE: Cambiar a ruta alternativa (naranja)
   - Si GO/HOLD: Mantener ruta principal (azul)
5. Calcular tiempo restante hasta ventana de ingreso:
   tiempo_restante = (slot.start_time - NOW()) - tiempo_viaje_estimado
   IF tiempo_restante < 5 min THEN
     alerta: "Aproxímese al punto de control"
   END
```

**Componentes Técnicos:**
- `DriverDashboard.vue` - Vista del ticket digital
- `TravelStatusBanner.vue` - Banner de estado dinámico
- `DriverMap.vue` - Mapa con ruta
- `QRDisplay.vue` - Visualización de código QR
- Backend: WebSocket o polling para actualizaciones en tiempo real

**Variables Contextuales en Tiempo Real:**
- Tráfico actual (Waze API)
- Estado de obras viales (MTC/SUTRAN)
- Condiciones climáticas (SENAMHI)
- Estado del túnel viaducto (sistema portuario)

---

### PASO 5: Navegación y Monitoreo en Tiempo Real

**Experiencia del Conductor:**
- El conductor inicia su viaje hacia el puerto
- El sistema monitorea su ubicación GPS (con permiso)
- Recibe actualizaciones dinámicas:
  - Cambios en el estado de la ruta
  - Alertas de tráfico o incidentes
  - Ajustes en el tiempo de llegada
  - Instrucciones de velocidad recomendada
- Si hay incidente: Banner HOLD se activa automáticamente
- Si hay desvío: Banner REROUTE + mapa actualiza ruta alternativa

**Funcionamiento del Software:**
```
1. Activar seguimiento GPS (opcional, con consentimiento):
   - Obtener ubicación cada 30 segundos
   - Calcular distancia restante al puerto
2. Monitoreo continuo de variables contextuales:
   - Polling cada 1 minuto a APIs externas:
     * Waze API: Estado de tráfico
     * SENAMHI: Condiciones climáticas
     * MTC/SUTRAN: Obras viales y restricciones
   - WebSocket desde sistema portuario:
     * Estado del túnel viaducto
     * Capacidad disponible
     * Incidentes operativos
3. Análisis predictivo:
   - Comparar tiempo estimado vs tiempo real
   - Predecir si llegará a tiempo a su slot
   - Si llegará tarde: Notificar y ofrecer slot alternativo
4. Generar alertas proactivas:
   IF (tiempo_restante < 10 min AND distancia > 5 km) THEN
     alerta: "Acelere ligeramente para llegar a tiempo"
   END
   IF (congestión_detectada_en_ruta) THEN
     status = 'HOLD' o 'REROUTE'
     notificar_conductor
   END
5. Actualizar UI en tiempo real:
   - Actualizar banner de estado
   - Actualizar mapa con nueva ruta si aplica
   - Actualizar contador de tiempo restante
```

**Componentes Técnicos:**
- Geolocalización del navegador
- WebSocket connection para updates en tiempo real
- Integración con APIs externas (Waze, SENAMHI, MTC/SUTRAN)
- Backend: Sistema de notificaciones push

---

### PASO 6: Llegada al Punto de Control

**Experiencia del Conductor:**
- El conductor llega al punto de control del puerto
- Escanea o presenta el código QR
- El sistema valida:
  - QR token válido
  - Horario dentro de la ventana permitida
  - Permisos y documentación en orden
- Si todo está correcto: Acceso autorizado
- Si hay problemas: Instrucciones específicas

**Funcionamiento del Software:**
```
1. Escaneo de QR en punto de control:
   - Leer QR token
   - Validar contra base de datos:
     SELECT * FROM bookings 
     WHERE qr_token = ? 
     AND status = 'confirmed'
   - Verificar ventana de tiempo:
     IF (NOW() BETWEEN slot.start_time - 5min AND slot.end_time) THEN
       acceso_permitido = true
     ELSE
       acceso_permitido = false
       motivo = "Fuera de horario asignado"
     END
2. Validación de permisos:
   - Verificar MTC/SUTRAN activo
   - Verificar seguro de carga activo
   - Verificar estado del vehículo
3. Si acceso permitido:
   - Actualizar booking: status = 'in_progress'
   - Registrar timestamp de ingreso
   - Activar semáforo/barrier en punto de control
   - Asignar carril específico según optimización
4. Si acceso denegado:
   - Mostrar motivo específico
   - Ofrecer reasignación a otro slot si aplica
   - Registrar intento de acceso
```

**Componentes Técnicos:**
- Sistema de escaneo QR (hardware en punto de control)
- Backend: `POST /api/checkpoints/validate` - Validación de acceso
- Integración con sistemas físicos (semáforos, barriers)

---

### PASO 7: Ingreso al Túnel Viaducto y Operación

**Experiencia del Conductor:**
- El conductor ingresa al túnel viaducto según su carril asignado
- Sigue las instrucciones de velocidad constante
- El sistema monitorea su progreso
- Al salir del túnel: Instrucciones para descarga/carga

**Funcionamiento del Software:**
```
1. Monitoreo dentro del túnel:
   - Tracking por sensores/cámaras
   - Verificar que sigue carril asignado
   - Verificar velocidad constante
2. Coordinación con operaciones portuarias:
   - Notificar a sistema de grúas que camión está llegando
   - Preparar área de descarga/carga
   - Asignar muelle específico según optimización
3. Al salir del túnel:
   - Actualizar booking: status = 'at_port'
   - Generar instrucciones de siguiente paso:
     * Muelle asignado
     * Área de espera
     * Tiempo estimado de operación
```

**Componentes Técnicos:**
- Sistema de tracking dentro del túnel
- Backend: Integración con sistema de operaciones portuarias
- Backend: `POST /api/operations/assign_muelle` - Asignación de muelle

---

## 2. FLUJO DE EXPERIENCIA: PANEL ADMINISTRATIVO

### Objetivo del Flujo
Proporcionar visibilidad end-to-end y control estratégico de flujos para optimizar la operación del puerto, reducir bloqueos y mejorar la previsibilidad para todos los actores logísticos.

---

### PASO 1: Acceso y Dashboard Principal

**Experiencia del Administrador:**
- El administrador accede al panel de control
- Ve un dashboard con KPIs en tiempo real:
  - Camiones en ruta
  - Camiones en espera
  - Capacidad del túnel viaducto
  - Retenciones aduanas
  - Alertas activas
- Mapa del puerto con ubicación de todos los vehículos
- Gráfico predictivo de demanda

**Funcionamiento del Software:**
```
1. Cargar datos agregados en tiempo real:
   SELECT 
     COUNT(*) FILTER (WHERE status = 'in_route') as en_ruta,
     COUNT(*) FILTER (WHERE status = 'waiting') as en_espera,
     COUNT(*) FILTER (WHERE status = 'at_customs') as en_aduanas,
     SUM(available_capacity) as capacidad_tunel
   FROM bookings b
   JOIN time_slots ts ON b.slot_id = ts.id
   WHERE DATE(b.created_at) = CURRENT_DATE
2. Cargar alertas activas:
   - Alertas de tráfico (Waze API)
   - Alertas climáticas (SENAMHI)
   - Alertas de infraestructura (MTC/SUTRAN)
3. Cargar datos para gráfico predictivo:
   - Demanda histórica por hora
   - Proyección para próximas 3 horas
   - Identificar picos potenciales
4. Renderizar mapa con todos los vehículos activos:
   - Obtener ubicaciones GPS de todos los bookings en progreso
   - Mostrar marcadores en mapa
   - Agrupar por estado (color diferente)
```

**Componentes Técnicos:**
- `AdminDashboard.vue` - Vista principal
- `KPICardsRow.vue` - Tarjetas de KPIs
- `MapSection.vue` - Mapa con vehículos
- `ActiveAlerts.vue` - Panel de alertas
- `PredictiveChart.vue` - Gráfico de demanda
- Backend: `GET /api/admin/dashboard` - Endpoint de datos agregados

---

### PASO 2: Monitoreo de Flujos en Tiempo Real

**Experiencia del Administrador:**
- Ve lista de camiones activos con:
  - Placa
  - Estado (En Túnel, En Espera, Fiscalización)
  - ETA al puerto
  - Indicadores ecológicos y de cumplimiento
- Mapa muestra ubicación de cada vehículo
- Puede filtrar por estado, empresa, tipo de vehículo

**Funcionamiento del Software:**
```
1. Consultar bookings activos:
   SELECT 
     b.id,
     b.truck_plate,
     b.status,
     ts.start_time,
     u.company_name,
     b.current_location, -- GPS tracking
     b.eta_to_port
   FROM bookings b
   JOIN time_slots ts ON b.slot_id = ts.id
   JOIN users u ON b.user_id = u.id
   WHERE b.status IN ('confirmed', 'in_route', 'at_port')
   ORDER BY b.eta_to_port ASC
2. Calcular ETA para cada vehículo:
   - Obtener ubicación GPS actual
   - Calcular ruta optimizada
   - Considerar variables contextuales (tráfico, obras)
   - ETA = tiempo_viaje_estimado + tiempo_restante_slot
3. Agrupar por estado para visualización
4. Actualizar cada 30 segundos (polling o WebSocket)
```

**Componentes Técnicos:**
- `TrucksList.vue` - Lista de camiones
- `MapSection.vue` - Mapa con marcadores
- Backend: `GET /api/admin/trucks` - Endpoint de camiones activos
- WebSocket para updates en tiempo real

---

### PASO 3: Gestión de Orquestación (Orchestration Panel)

**Experiencia del Administrador:**
- Panel con 3 pestañas:
  - **Orquestación**: Lista de gestiones pendientes de confirmar
  - **Camiones**: Lista detallada de todos los camiones
  - **Pilas**: Estado de patios de contenedores (ocupación, acceso)

**Funcionamiento del Software:**

#### Pestaña Orquestación:
```
1. Cargar gestiones pendientes:
   SELECT * FROM orchestration_tasks
   WHERE status = 'pending_confirmation'
   ORDER BY priority DESC, created_at ASC
2. Cada gestión muestra:
   - Tipo de operación (descarga, carga, reubicación)
   - Ubicación (muelle, almacén, patio)
   - Prioridad calculada
   - Impacto en flujo general
3. Al confirmar gestión:
   - Actualizar estado a 'confirmed'
   - Asignar recursos (grúas, personal)
   - Notificar a operadores
   - Actualizar capacidad disponible
```

#### Pestaña Camiones:
```
1. Mostrar lista completa de camiones con:
   - Estado actual
   - Ubicación GPS
   - ETA
   - Indicadores de cumplimiento
2. Permitir acciones:
   - Cambiar estado manualmente si es necesario
   - Reasignar slot
   - Enviar notificación al conductor
```

#### Pestaña Pilas:
```
1. Cargar estado de patios:
   SELECT 
     zone_name,
     current_occupancy,
     max_capacity,
     status, -- open, closed, limited
     last_updated
   FROM yard_blocks
   ORDER BY zone_name
2. Calcular ocupación porcentual
3. Permitir toggle de acceso:
   UPDATE yard_blocks 
   SET status = CASE WHEN status = 'open' THEN 'closed' ELSE 'open' END
   WHERE id = ?
```

**Componentes Técnicos:**
- `OrchestrationPanel.vue` - Panel principal
- `TrucksList.vue` - Lista de camiones
- `YardStatus.vue` - Estado de patios
- Backend: `GET /api/admin/orchestration` - Gestiones
- Backend: `POST /api/admin/yards/toggle` - Toggle acceso patio

---

### PASO 4: Análisis Predictivo y Planificación

**Experiencia del Administrador:**
- Ve gráfico de demanda proyectada para próximas horas
- Identifica picos potenciales antes de que ocurran
- Recibe alertas predictivas (ej: "Saturación en Acceso Túnel a las 18:00 hrs")
- Puede ajustar capacidad o generar slots adicionales

**Funcionamiento del Software:**
```
1. Análisis de demanda histórica:
   SELECT 
     DATE_TRUNC('hour', start_time) as hour,
     COUNT(*) as bookings_count,
     AVG(available_capacity) as avg_capacity
   FROM time_slots
   WHERE start_time >= NOW() - INTERVAL '30 days'
   GROUP BY hour
   ORDER BY hour
2. Modelo predictivo:
   - Usar regresión o machine learning
   - Considerar:
     * Día de la semana
     * Hora del día
     * Patrones estacionales
     * Eventos especiales
   - Proyectar demanda para próximas 3-6 horas
3. Comparar con capacidad disponible:
   IF (demanda_proyectada > capacidad_disponible * 0.9) THEN
     generar_alerta: "Saturación prevista en {hora}"
     sugerir_acciones:
       * Crear slots adicionales
       * Redistribuir carga
       * Activar ruta alternativa
   END
4. Visualizar en gráfico:
   - Línea azul: Demanda proyectada
   - Línea roja: Límite de capacidad
   - Marcar puntos de saturación
```

**Componentes Técnicos:**
- `PredictiveChart.vue` - Gráfico de demanda
- Backend: Modelo de predicción (Python/ML o algoritmo simple)
- Backend: `GET /api/admin/predictions` - Datos predictivos

---

### PASO 5: Gestión de Alertas y Respuesta a Incidentes

**Experiencia del Administrador:**
- Ve panel de alertas activas con:
  - Tipo de alerta (tráfico, clima, infraestructura)
  - Fuente (SENAMHI, Waze API, MTC/SUTRAN)
  - Severidad
  - Tiempo desde que se generó
- Puede tomar acciones:
  - Activar ruta alternativa
  - Notificar a conductores afectados
  - Ajustar capacidad del túnel

**Funcionamiento del Software:**
```
1. Monitoreo continuo de fuentes:
   - Waze API: Consultar cada 2 minutos
   - SENAMHI: Consultar cada 5 minutos
   - MTC/SUTRAN: Consultar cada 10 minutos
   - Sistema portuario: WebSocket en tiempo real
2. Procesar alertas:
   IF (nueva_alerta_detectada) THEN
     INSERT INTO alerts (
       type, -- traffic, weather, infrastructure
       source, -- waze, senamhi, mtc
       severity, -- low, medium, high
       description,
       location,
       affected_routes
     )
     -- Evaluar impacto:
     affected_bookings = SELECT * FROM bookings 
       WHERE status = 'in_route' 
       AND route_id IN (affected_routes)
     -- Notificar conductores:
     FOR EACH booking IN affected_bookings:
       send_notification(booking.user_id, alert)
       IF (severity = 'high') THEN
         update_travel_status(booking.id, 'HOLD' o 'REROUTE')
       END
   END
3. Mostrar en panel con badges de fuente
4. Permitir acciones administrativas:
   - Marcar como resuelta
   - Aplicar solución automática
   - Notificar manualmente
```

**Componentes Técnicos:**
- `ActiveAlerts.vue` - Panel de alertas
- Backend: Servicio de monitoreo de APIs externas
- Backend: Sistema de notificaciones push
- Backend: `POST /api/admin/alerts/resolve` - Resolver alerta

---

### PASO 6: Control de Flujos y Optimización

**Experiencia del Administrador:**
- Ve estado de patios de contenedores (Pilas)
- Puede cerrar/abrir acceso a bloques específicos
- Ve ocupación en tiempo real
- Toma decisiones para redistribuir carga

**Funcionamiento del Software:**
```
1. Monitoreo de patios:
   SELECT 
     zone_name,
     current_containers,
     max_capacity,
     (current_containers::float / max_capacity * 100) as occupancy_pct,
     status
   FROM yard_blocks
   WHERE last_updated > NOW() - INTERVAL '5 minutes'
2. Detectar saturación:
   IF (occupancy_pct > 90) THEN
     status = 'limited' o 'closed'
     alerta: "Patio {zone} al {occupancy_pct}% de capacidad"
     sugerir: Redistribuir a otros patios
   END
3. Al cambiar estado de acceso:
   - Actualizar base de datos
   - Notificar a sistema de routing
   - Actualizar instrucciones para conductores en ruta
   - Recalcular rutas si es necesario
```

**Componentes Técnicos:**
- `YardStatus.vue` - Estado de patios
- Backend: `GET /api/admin/yards` - Estado de patios
- Backend: `POST /api/admin/yards/:id/toggle` - Cambiar acceso

---

### PASO 7: Reportes y Análisis

**Experiencia del Administrador:**
- Puede generar reportes de:
  - Eficiencia operativa
  - Tiempos de espera
  - Utilización de capacidad
  - Incidentes y resoluciones
- Exportar datos para análisis externo

**Funcionamiento del Software:**
```
1. Generar reportes agregados:
   SELECT 
     DATE(created_at) as fecha,
     COUNT(*) as total_bookings,
     AVG(wait_time) as tiempo_espera_promedio,
     SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completados,
     (SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)::float / COUNT(*) * 100) as tasa_exito
   FROM bookings
   WHERE created_at >= ? AND created_at <= ?
   GROUP BY DATE(created_at)
2. Calcular métricas de eficiencia:
   - Tiempo promedio de espera
   - Tasa de utilización de capacidad
   - Número de reasignaciones
   - Tiempo promedio de operación
3. Exportar a CSV/Excel
```

**Componentes Técnicos:**
- Backend: `GET /api/admin/reports` - Generar reportes
- Backend: Exportación de datos

---

## 3. INTEGRACIÓN Y COORDINACIÓN ENTRE FLUJOS

### Sincronización en Tiempo Real

**Arquitectura:**
```
Conductor (Frontend) ←→ WebSocket ←→ Backend ←→ WebSocket ←→ Admin (Frontend)
                              ↓
                    Base de Datos MySQL
                              ↓
                    APIs Externas (Waze, SENAMHI, MTC/SUTRAN)
```

**Eventos que se propagan:**
1. Conductor crea booking → Admin ve nuevo camión en lista
2. Admin cambia estado de patio → Conductor recibe actualización de ruta
3. Alerta externa detectada → Ambos reciben notificación
4. Conductor actualiza ubicación GPS → Admin ve movimiento en mapa

---

## 4. VARIABLES CONTEXTUALES PERUANAS INTEGRADAS

### Fuentes de Datos Externas

1. **Waze API** (Tráfico en tiempo real)
   - Congestión vehicular
   - Accidentes reportados
   - Tiempos de viaje actualizados

2. **SENAMHI** (Condiciones climáticas)
   - Visibilidad (neblina)
   - Lluvia
   - Vientos
   - Alertas meteorológicas

3. **MTC/SUTRAN** (Infraestructura vial)
   - Obras viales activas
   - Restricciones de tránsito
   - Estado de carreteras
   - Cronograma de obras

4. **Sistema Portuario** (Operaciones internas)
   - Estado del túnel viaducto
   - Capacidad disponible
   - Incidentes operativos

---

## 5. ALGORITMOS DE OPTIMIZACIÓN

### Asignación de Slots

```
FUNCIÓN asignar_slot_optimo(conductor, ubicacion_actual):
  1. Obtener slots disponibles
  2. Para cada slot:
     a. Calcular tiempo_viaje = routing_api(ubicacion_actual, puerto)
     b. Considerar variables contextuales:
        - Tráfico actual
        - Obras viales
        - Condiciones climáticas
     c. Calcular tiempo_espera = slot.start_time - (NOW() + tiempo_viaje)
     d. Calcular score = f(tiempo_espera, capacidad_disponible, prioridad)
  3. Retornar slot con mayor score
```

### Gestión de Flujos

```
FUNCIÓN optimizar_flujos():
  1. Analizar demanda proyectada vs capacidad
  2. Si saturación prevista:
     a. Crear slots adicionales si es posible
     b. Redistribuir carga a otros horarios
     c. Activar rutas alternativas
  3. Priorizar flujos según:
     - Urgencia de carga
     - Tipo de vehículo (ecológico tiene prioridad)
     - Historial de puntualidad
```

---

## 6. MÉTRICAS DE ÉXITO

### Para el Sistema

- **Reducción de tiempos de espera**: Meta: 30% reducción
- **Aumento de utilización de capacidad**: Meta: 85% utilización promedio
- **Reducción de bloqueos**: Meta: 50% menos incidentes de bloqueo
- **Mejora en previsibilidad**: Meta: 90% de bookings completados en horario asignado

### Para Conductores

- Tiempo promedio desde reserva hasta ingreso al puerto
- Tasa de reasignaciones necesarias
- Satisfacción con instrucciones recibidas

### Para Administradores

- Visibilidad end-to-end de operaciones
- Tiempo de respuesta a incidentes
- Eficiencia en toma de decisiones

---

## CONCLUSIÓN

Este flujo de experiencia integra todos los objetivos del proyecto:

✅ **Orquestador Logístico Inteligente Contextualizado**: Coordina cuándo, cómo y en qué secuencia operan los vehículos, integrando variables locales peruanas.

✅ **Planificación Dinámica y Predictiva**: Combina decisiones predictivas (modelos de demanda) con capacidades reactivas (ajustes en tiempo real).

✅ **Control Estratégico de Flujos**: Gestiona lotes de camiones, prioriza flujos eficientes, y proporciona visibilidad end-to-end a todos los actores.

El sistema resultante optimiza la operación del Puerto de Chancay, reduciendo tiempos de espera y maximizando la utilización de capacidades portuarias, todo mientras se adapta dinámicamente al contexto peruano específico.

