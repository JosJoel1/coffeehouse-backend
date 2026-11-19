const especialidades = require("../models/especialidades");

const LIMITS = { nombre: 100, descripcion: 255, imagen: 255 };

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validText(value, maxLength, nullable = true) {
  return (
    value === undefined ||
    (nullable && value === null) ||
    (typeof value === "string" && value.length <= maxLength)
  );
}

function validNombre(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= LIMITS.nombre
  );
}

async function list(req, res) {
  res.json(await especialidades.findAll());
}

async function get(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  const especialidad = await especialidades.findById(id);
  if (!especialidad) {
    throw httpError(404, "Especialidad no encontrada");
  }
  res.json(especialidad);
}

async function create(req, res) {
  const { nombre, descripcion, imagen } = req.body;
  if (!validNombre(nombre)) {
    throw httpError(400, "nombre es obligatorio y admite hasta 100 caracteres");
  }
  for (const field of ["descripcion", "imagen"]) {
    if (!validText(req.body[field], LIMITS[field])) {
      throw httpError(
        400,
        `${field} debe tener hasta ${LIMITS[field]} caracteres o ser null`,
      );
    }
  }

  const especialidad = await especialidades.create({
    nombre,
    descripcion,
    imagen,
  });
  res.status(201).json(especialidad);
}

async function update(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await especialidades.findById(id))) {
    throw httpError(404, "Especialidad no encontrada");
  }

  const fields = {};
  if (req.body.nombre !== undefined) {
    if (!validNombre(req.body.nombre)) {
      throw httpError(
        400,
        "nombre no puede estar vacío y admite hasta 100 caracteres",
      );
    }
    fields.nombre = req.body.nombre;
  }
  for (const field of ["descripcion", "imagen"]) {
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

  res.json(await especialidades.update(id, fields));
}

async function remove(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await especialidades.remove(id))) {
    throw httpError(404, "Especialidad no encontrada");
  }
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };