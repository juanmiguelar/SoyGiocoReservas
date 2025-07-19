# SoyGiocoReservas

Aplicación base en Vue 3 + Vuetify diseñada para ser compilada con Capacitor a Android. Por defecto maneja los pagos y asistencias de forma local (sin backend) usando `localStorage`.  
Opcionalmente puede sincronizarse con Google Sheets a través del script ubicado en `appScript/script.gs`.

## Instalación

1. Instalar dependencias

```bash
npm install
```

2. Correr en modo desarrollo

```bash
npm run dev
```

## Capacitor

Inicializar Capacitor y agregar plataforma Android:

```bash
npx cap init
npx cap add android
```

Compilar y sincronizar cambios:

```bash
npm run build
npx cap sync android
npx cap open android  # abre Android Studio
```

## Estructura

- `src/components/` – componentes reutilizables de formularios CRUD
- `src/views/` – vistas por módulo (Pagos y Asistencias)
- `src/router/` – configuración de rutas
- `src/stores/` – stores Pinia con persistencia en `localStorage`
- `appScript/` – contiene el archivo `script.gs` para sincronizar con Google Sheets

## Integración con Google Sheets

El archivo `appScript/script.gs` permite almacenar los datos en una hoja de cálculo.
Se espera un spreadsheet con dos hojas llamadas **pagos** y **asistencias**, cada
una con una fila de encabezados que corresponda a los campos mostrados en las
vistas.
Las peticiones a este script deben incluir el parámetro `sheet` indicando la hoja
a utilizar y un token de autorización.

## Contribución

1. Hacer fork del repositorio.
2. Crear una rama a partir de `main` con una descripción clara.
3. Enviar *pull request* describiendo cambios y pasos para probarlos.

## Descripción de módulos

### Control de Pagos
Permite registrar clientes y el estado de sus pagos (`pago1`, `pago2`, `pendientes`). Cada cliente es único. Desde la vista se puede navegar a las asistencias del mismo cliente.

### Control de Asistencias
Registra la asistencia a talleres y los diseños realizados por un cliente. Incluye botón para consultar los pagos relacionados.

## Licencia

MIT

