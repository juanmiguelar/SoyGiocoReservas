// Nombre de las hojas que utilizaremos en el Spreadsheet. Cada hoja debe tener
// una fila de encabezados con los campos que se manejan en la aplicación.
// "pagos" utiliza las columnas:
//   id, cliente, contacto, pago1, pago2, pendientes, correo, cedula, telefono
// "asistencias" utiliza las columnas:
//   id, cliente, asistente, taller, disenoElegido, disenoApoyo,
//   disenoRealizado, bienvenida, recordatorio
const SHEETS = {
  pagos: 'pagos',
  asistencias: 'asistencias',
};
const AUTH_TOKEN = 'supersecreto123';

// Obtiene la hoja correspondiente al nombre indicado en el atributo `sheet`.
// Se asume que siempre se enviará un valor válido desde el cliente.
function getSheetByType(type) {
  const sheetName = SHEETS[String(type).toLowerCase()];
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
}

// Entrada GET: obtener todas las filas o una por ID
function doGet(e) {
  if (!isAuthorized(e)) return jsonResponse({ status: 401, error: "No autorizado" });

  const id = e.parameter.id;
  const sheet = getSheetByType(e.parameter.sheet);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  if (!id) {
    const all = data.slice(1).map(row => {
      let item = {};
      headers.forEach((h, i) => item[h] = row[i]);
      return item;
    });
    return jsonResponse(all);
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      let result = {};
      headers.forEach((h, j) => result[h] = data[i][j]);
      return jsonResponse(result);
    }
  }

  return jsonResponse({ status: 404, error: "ID no encontrado" });
}

// Entrada POST: se usa para crear, actualizar y eliminar (método virtual)
function doPost(e) {
  if (!isAuthorized(e)) return jsonResponse({ status: 401, error: "No autorizado" });

  const payload = JSON.parse(e.postData.contents);
  const method = (payload.method || 'POST').toUpperCase();

  if (method === 'POST') return handleCreate(payload);
  if (method === 'PUT') return handleUpdate(payload);
  if (method === 'DELETE') return handleDelete(payload);

  return jsonResponse({ status: 400, error: "Método no soportado" });
}

// Crear nueva fila
function handleCreate(payload) {
  const sheet = getSheetByType(payload.sheet);
  const headers = sheet.getDataRange().getValues()[0];
  const id = Utilities.getUuid();
  const newRow = [id];

  headers.slice(1).forEach(h => newRow.push(payload[h] || ""));
  sheet.appendRow(newRow);

  return jsonResponse({ message: "Creado correctamente", id });
}

// Actualizar fila existente
function handleUpdate(payload) {
  const id = payload.id;
  if (!id) return jsonResponse({ status: 400, error: "Falta 'id'" });

  const sheet = getSheetByType(payload.sheet);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      headers.slice(1).forEach((h, j) => {
        if (h in payload) {
          sheet.getRange(i + 1, j + 2).setValue(payload[h]);
        }
      });
      return jsonResponse({ message: "Actualizado correctamente", id });
    }
  }

  return jsonResponse({ status: 404, error: "ID no encontrado" });
}

// Eliminar fila existente
function handleDelete(payload) {
  const id = payload.id;
  if (!id) return jsonResponse({ status: 400, error: "Falta 'id'" });

  const sheet = getSheetByType(payload.sheet);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ message: "Eliminado correctamente", id });
    }
  }

  return jsonResponse({ status: 404, error: "ID no encontrado" });
}

// Validación de token secreto
function isAuthorized(e) {
  try {
    const tokenFromQuery = e.parameter && e.parameter.token;
    let tokenFromBody = null;
    if (e.postData && e.postData.contents) {
      const parsed = JSON.parse(e.postData.contents);
      tokenFromBody = parsed.token;
    }
    return (tokenFromQuery === AUTH_TOKEN || tokenFromBody === AUTH_TOKEN);
  } catch (err) {
    return false;
  }
}

// Respuesta JSON simple
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Manejar preflight CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
