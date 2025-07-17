# SoyGiocoReservas

Aplicación base en Vue 3 + Vuetify diseñada para ser compilada con Capacitor a Android. Permite el manejo de pagos y asistencias de clientes de forma local (sin backend) usando `localStorage`.

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

