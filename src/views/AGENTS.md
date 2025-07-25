# Instrucciones para agentes

Vistas principales de la aplicación. `PagosView.vue` y `AsistenciasView.vue` muestran tablas editables con filas expandibles y utilizan los formularios de `src/components` junto con los stores correspondientes.

Las filas de las tablas se expanden haciendo clic en cualquier parte de la fila. Esto se logra con la prop `expand-on-click` del componente `v-data-table`. La columna de acciones utiliza `@click.stop` para evitar que el menú dispare la expansión.
