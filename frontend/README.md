# Puerto de Chancay Logistics System - Frontend

Aplicación frontend Vue.js 3 para el sistema de logística del Puerto de Chancay.

## 🚀 Setup del Proyecto

### 1. Crear el proyecto con Vite

```bash
npm create vite@latest frontend -- --template vue
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
npm install axios pinia vue-router
npm install -D tailwindcss postcss autoprefixer
```

### 3. Inicializar Tailwind CSS

```bash
npx tailwindcss init -p
```

## 📦 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # Configuración de Axios
│   ├── stores/
│   │   └── bookingStore.js   # Pinia store para reservas
│   ├── views/
│   │   ├── HomeView.vue      # Vista de inicio (selector de rol)
│   │   ├── DriverDashboard.vue  # Dashboard del conductor
│   │   └── AdminDashboard.vue  # Dashboard administrativo
│   ├── components/
│   │   ├── SlotCard.vue      # Tarjeta de horario disponible
│   │   └── QRDisplay.vue     # Componente de visualización QR
│   ├── router/
│   │   └── index.js          # Configuración de Vue Router
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔌 Configuración

El frontend está configurado para comunicarse con el backend en `http://localhost:3000/api`.

Asegúrate de que el backend esté corriendo antes de iniciar el frontend.

## 📱 Características

- **Vista de Conductor**: Permite ver horarios disponibles y crear reservas
- **Visualización QR**: Muestra el código QR después de crear una reserva
- **Responsive Design**: Diseño mobile-first con Tailwind CSS
- **State Management**: Pinia para gestión de estado
- **Routing**: Vue Router para navegación

