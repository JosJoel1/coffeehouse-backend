const database = require("../config/database");

const COLUMNS = "id, nombre, descripcion, icono, imagen";

async function findAll() {
  const [rows] = await database.query(
    `SELECT ${COLUMNS} FROM servicios ORDER BY id`,
  );
  return rows;
}

async function findById(id) {
  const [rows] = await database.execute(
    `SELECT ${COLUMNS} FROM servicios WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
}

async function create({ nombre, descripcion, icono, imagen }) {
  const [result] = await database.execute(
    "INSERT INTO servicios (nombre, descripcion, icono, imagen) VALUES (?, ?, ?, ?)",
    [nombre, descripcion ?? null, icono ?? null, imagen ?? null],
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const columnNames = {
    nombre: "nombre",
    descripcion: "descripcion",
    icono: "icono",
    imagen: "imagen",
  };
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${columnNames[field]} = ?`);
  const values = entries.map(([, value]) => value);

  await database.execute(
    `UPDATE servicios SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id],
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await database.execute("DELETE FROM servicios WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };