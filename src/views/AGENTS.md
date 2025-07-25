# Instrucciones para agentes

Vistas principales de la aplicación. `PagosView.vue` y `AsistenciasView.vue` muestran tablas editables con filas expandibles y utilizan los formularios de `src/components` junto con los stores correspondientes.

Las filas de las tablas se expanden haciendo clic en cualquier parte de la fila. Se usa la prop `expand-on-click` y se captura `update:expanded` para mantener solo una fila abierta a la vez. La columna de acciones utiliza `@click.stop` para evitar que el menú dispare la expansión.

Al iterar sobre las propiedades de un item dentro de la fila expandida se emplea `field` como alias en lugar de `key` para prevenir el warning de Vue por usar la palabra reservada `key`.
