# Instrucciones para agentes

Define los stores de Pinia para `pagos` y `asistencias`. Cada store persiste su
estado en `localStorage` y ofrece una función `fetchRemote` para sincronizar con
Google Sheets mediante la API.

Ahora ambos stores utilizan directamente el API de Google Sheets en lugar del
script de Google Apps Script. Se añadieron constantes `SPREADSHEET_ID`,
`API_KEY`, `API_BASE` y `SHEET_NAME` para configurar la llamada y construir la
URL del rango a leer.
