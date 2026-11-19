const inicio = require("../models/inicio");

const LIMITS = { titulo: 100, subtitulo: 255, video: 255 };

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function get(req, res) {
  const registro = await inicio.get();
  if (!registro) {
    throw httpError(404, "Contenido de inicio no encontrado");
  }
  res.json(registro);
}

async function update(req, res) {
  const fields = {};
  for (const field of Object.keys(LIMITS)) {
    const value = req.body[field];
    if (value === undefined) {
      continue;
    }
    const nullable = field !== "titulo";
    const valid =
      (nullable && value === null) ||
      (typeof value === "string" &&
        value.trim().length > 0 &&
        value.length <= LIMITS[field]);
    if (!valid) {
      throw httpError(
        400,
        field === "titulo"
          ? "titulo no puede estar vacío y admite hasta 100 caracteres"
          : `${field} debe tener hasta ${LIMITS[field]} caracteres o ser null`,
      );
    }
    fields[field] = value;
  }
  if (Object.keys(fields).length === 0) {
    throw httpError(400, "Debe enviar al menos un campo para actualizar");
  }

  const registro = await inicio.update(fields);
  if (!registro) {
    throw httpError(404, "Contenido de inicio no encontrado");
  }
  res.json(registro);
}

module.exports = { get, update };