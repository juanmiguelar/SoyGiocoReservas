# LLM Instructions

Este archivo provee un resumen del proyecto **SoyGiocoReservas** para ayudar a las inteligencias artificiales y agentes a comprender el contexto general de la aplicación.

## Objetivo del proyecto

- Aplicación hecha en **Vue 3** y **Vuetify** pensada para compilarse con **Capacitor** a Android.
- Maneja registros de pagos y asistencias de clientes utilizando `localStorage` como persistencia local.
- Se incluye un `script.gs` para sincronizar con Google Sheets cuando se requiere persistencia en línea.

## Directorios principales

- `src/components/` – componentes reutilizables para formularios CRUD.
- `src/views/` – vistas de los módulos **Pagos** y **Asistencias**. Incluyen tablas con filas expansibles para ver detalles adicionales.
- `src/examples/` – componentes de ejemplo escritos en React (como `AttendanceTable.tsx`) que muestran el patrón de tabla colapsable.
- `src/router/` – define las rutas disponibles en la aplicación.
- `src/stores/` – stores de Pinia con persistencia automática en `localStorage`.
- `appScript/` – contiene un script de Google Apps Script para trabajar con dos hojas (`pagos` y `asistencias`).

## Funcionalidades recientes

- Tablas en **Vuetify** con filas colapsables para mostrar los datos completos de cada registro.
- Menús contextuales en cada fila para editar o eliminar.
- Ejemplo en React (`AttendanceTable.tsx`) que replica esta idea utilizando **MUI**.

## Ejecución básica

1. Instalar dependencias con `npm install`.
2. Ejecutar en modo desarrollo con `npm run dev`.
3. Para compilar la versión de producción usar `npm run build` (requiere Node 20 o superior).

## Uso con Capacitor

- Inicializar con `npx cap init` y agregar la plataforma Android con `npx cap add android`.
- Luego de compilar (`npm run build`), sincronizar cambios con `npx cap sync android` y abrir Android Studio con `npx cap open android`.


## API con Google Apps Script

- El archivo `appScript/script.gs` implementa una API REST sencilla sobre la hoja de cálculo `reservas`.
- Las funciones `doGet` y `doPost` permiten consultar, crear, actualizar y eliminar filas.
- Se valida un token secreto (`AUTH_TOKEN`) enviado por query string o en el cuerpo de la petición.
- Las respuestas se generan en formato JSON usando `ContentService`.

---
Este proyecto se distribuye bajo la licencia **MIT**.
