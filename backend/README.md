# Puerto de Chancay Logistics Orchestrator - Backend

Backend API para el sistema de logística del Puerto de Chancay.

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── app.js                    # Configuración de Express
│   ├── config/
│   │   └── db.js                 # Configuración de MySQL
│   ├── controllers/
│   │   ├── bookingController.js  # Lógica de reservas
│   │   └── slotsController.js     # Lógica de horarios
│   └── routes/
│       └── api.js                # Definición de rutas
├── server.js                     # Punto de entrada
├── package.json
└── .env                          # Variables de entorno (crear)
```

## 🚀 Instalación

1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Crear archivo `.env`:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=chancay_logistics_db
DB_CONNECTION_LIMIT=10
```

3. Iniciar el servidor:
```bash
npm run dev    # Modo desarrollo con nodemon
# o
npm start      # Modo producción
```

## 📡 Endpoints

- `GET /health` - Health check
- `GET /api` - Información de la API
- `GET /api/slots` - Obtener horarios disponibles
- `POST /api/bookings` - Crear una reserva

## 🔒 Características de Seguridad

- **Transacciones MySQL**: Previene condiciones de carrera en reservas
- **Row-level locking**: Usa `SELECT ... FOR UPDATE` para evitar sobre-reservas
- **Validación de datos**: Validación completa de inputs antes de procesar

## 🧪 Pruebas

Para probar la creación de reservas:
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"slot_id": 2, "user_id": 3, "truck_plate": "ABC-123"}'
```

