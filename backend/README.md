# TypeScript + ExpressJs + PostgreSQL

# Instrucciones para ejecutar la  aplicación venta de maíz bob

Crear un archivo .env en el directorio raíz del proyecto `backend` con las siguientes variables de entorno

```
DB_USER=user
DB_HOST=localhost
DB_NAME=corn_db
DB_PASS=password
DB_PORT=5432
``` 
## ejecutar los siguinetes scripts en directorio backend de el proyecto


### `docker compose up -d` 
Para levantar la base de datos

### `npm install`
Para instalar las dependencias

### `npm run  migrations`
Para ejecutar las migraciones

### `npm run dev`
Para ejecutar el servidor en modo desarrollo

## Rutas de la aplicación
/POST /api/corn/buy
Body
```
{
    "clientCode": "C001",
}
```
## Codigos de clientes creados en la base de datos, se pueden usar para hacer pruebas
```
C001
C002
C003
```