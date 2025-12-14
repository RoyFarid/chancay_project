# Configuración del archivo .env

Para que el backend funcione correctamente, necesitas crear un archivo `.env` en la carpeta `backend/` con las siguientes variables:

## Pasos para crear el archivo .env

1. Crea un archivo llamado `.env` en la carpeta `backend/`
2. Copia y pega el siguiente contenido, ajustando los valores según tu configuración de MySQL:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_de_mysql_aqui
DB_NAME=chancay_logistics_db
DB_CONNECTION_LIMIT=10
```

## Importante

- **DB_PASSWORD**: Reemplaza `tu_password_de_mysql_aqui` con la contraseña real de tu usuario MySQL (root)
- Si tu MySQL no tiene contraseña, deja `DB_PASSWORD=` vacío (pero asegúrate de que MySQL permita conexiones sin contraseña)
- **DB_NAME**: Asegúrate de que la base de datos `chancay_logistics_db` exista en tu MySQL

## Verificar la conexión

Después de crear el archivo `.env`, reinicia el servidor backend:

```bash
cd backend
npm run dev
```

Deberías ver el mensaje: `✅ Database connection established successfully`

## Si no conoces tu contraseña de MySQL

Si no recuerdas la contraseña de MySQL, puedes:

1. **Resetear la contraseña de MySQL** (consulta la documentación de MySQL)
2. **Crear un nuevo usuario** con permisos para la base de datos
3. **Usar MySQL sin contraseña** (solo para desarrollo, no recomendado en producción)

