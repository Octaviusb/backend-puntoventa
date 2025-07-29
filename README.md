# Punto de Venta Backend

Este documento proporciona información sobre la configuración y uso del backend del sistema de Punto de Venta.

## Requisitos

- Node.js (versión 14 o superior)
- npm (gestor de paquetes de Node)

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del backend:
   ```
   cd punto-de-venta/backend
   ```

3. Instala las dependencias:
   ```
   npm install
   ```

## Ejecución

Para iniciar el servidor, ejecuta el siguiente comando:
```
npm start
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

## Estructura del Proyecto

- **src/app.js**: Punto de entrada de la aplicación. Configura el servidor Express y las rutas.
- **src/controllers**: Controladores que manejan la lógica de negocio.
- **src/models**: Modelos de datos que representan las entidades del sistema.
- **src/routes**: Rutas de la API organizadas por módulos.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.