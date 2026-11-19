const nosotros = require("../models/nosotros");

const LIMITS = {
  historia: 65535,
  direccion: 255,
  telefono: 50,
  email: 100,
  horario: 255,
  foto: 255,
};

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validText(value, maxLength) {
  return (
    value === null || (typeof value === "string" && value.length <= maxLength)
  );
}

async function get(req, res) {
  const registro = await nosotros.get();
  if (!registro) {
    throw httpError(404, "Información no encontrada");
  }
  res.json(registro);
}

async function update(req, res) {
  const fields = {};
  for (const field of Object.keys(LIMITS)) {
    const value = req.body[field];
    if (value !== undefined) {
      if (!validText(value, LIMITS[field])) {
        throw httpError(
          400,
          `${field} debe tener hasta ${LIMITS[field]} caracteres o ser null`,
        );
      }
      fields[field] = value;
    }
  }
  if (Object.keys(fields).length === 0) {
    throw httpError(400, "Debe enviar al menos un campo para actualizar");
  }

  const registro = await nosotros.update(fields);
  if (!registro) {
    throw httpError(404, "Información no encontrada");
  }
  res.json(registro);
}

module.exports = { get, update };