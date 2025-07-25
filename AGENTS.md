# Instrucciones para agentes

- Usa `src/secrets.ts` para definir `SPREADSHEET_ID`, `API_KEY`, `API_BASE` y los datos de OAuth (`OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `OAUTH_ACCESS_TOKEN`, etc.).
- El archivo real `src/secrets.ts` no se debe versionar. Utiliza la plantilla
  `src/secrets.example.ts` como base.
- Los stores de Pinia importan estas constantes desde `../secrets` y cada uno
  define su propia constante `SHEET_NAME`.
