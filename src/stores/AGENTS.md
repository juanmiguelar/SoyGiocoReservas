# Instrucciones para agentes

Define los stores de Pinia para `pagos` y `asistencias`. Cada store persiste su
estado en `localStorage` y ofrece una función `fetchRemote` para sincronizar con
Google Sheets mediante la API.

Ahora ambos stores utilizan directamente el API de Google Sheets en lugar del
script de Google Apps Script. Se añaden las constantes `SPREADSHEET_ID`,
`API_KEY`, `API_BASE` y `SHEET_NAME` para configurar las URLs. El token de
OAuth se obtiene en tiempo de ejecución a través del store `googleAuth`, por lo
que `OAUTH_ACCESS_TOKEN` es opcional. Para operaciones de escritura se envía la
cabecera `Authorization: Bearer <token>` usando el valor proporcionado por dicho
store.

Las funciones `add` y `remove` también actualizan la hoja. El método `add`
utiliza la operación `append` de Google Sheets para insertar una nueva fila y
`remove` emplea `batchUpdate` con `deleteDimension` para borrar la fila
correspondiente.
