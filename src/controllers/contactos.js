const contactos = require("../models/contactos");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validRequired(value, maxLength) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

function validEmail(value) {
  return (
    validRequired(value, 100) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

async function list(req, res) {
  res.json(await contactos.findAll());
}

async function create(req, res) {
  const { nombre, email, mensaje } = req.body;
  if (!validRequired(nombre, 100)) {
    throw httpError(400, "nombre es obligatorio y admite hasta 100 caracteres");
  }
  if (!validEmail(email)) {
    throw httpError(400, "email no tiene un formato válido");
  }
  if (!validRequired(mensaje, 2000)) {
    throw httpError(400, "mensaje es obligatorio y admite hasta 2000 caracteres");
  }

  const contacto = await contactos.create({
    nombre: nombre.trim(),
    email: email.trim(),
    mensaje: mensaje.trim(),
  });
  res.status(201).json(contacto);
}

module.exports = { list, create };