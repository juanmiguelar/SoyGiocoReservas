# LLM Instructions

Este archivo provee un resumen del proyecto **SoyGiocoReservas** para ayudar a las inteligencias artificiales y agentes a comprender el contexto general de la aplicación.

## Objetivo del proyecto

- Aplicación hecha en **Vue 3** y **Vuetify** pensada para compilarse con **Capacitor** a Android.
- Maneja registros de pagos y asistencias de clientes utilizando `localStorage` como persistencia local.
- No depende de un backend ni de bases de datos externas.

## Directorios principales

- `src/components/` – componentes reutilizables para formularios CRUD.
- `src/views/` – vistas de los módulos **Pagos** y **Asistencias**.
- `src/router/` – define las rutas disponibles en la aplicación.
- `src/stores/` – stores de Pinia con persistencia automática en `localStorage`.

## Ejecución básica

1. Instalar dependencias con `npm install`.
2. Ejecutar en modo desarrollo con `npm run dev`.
3. Para compilar la versión de producción usar `npm run build` (requiere Node 20 o superior).

## Uso con Capacitor

- Inicializar con `npx cap init` y agregar la plataforma Android con `npx cap add android`.
- Luego de compilar (`npm run build`), sincronizar cambios con `npx cap sync android` y abrir Android Studio con `npx cap open android`.

---
Este proyecto se distribuye bajo la licencia **MIT**.
