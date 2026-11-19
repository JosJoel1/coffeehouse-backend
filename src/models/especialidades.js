const database = require("../config/database");

const COLUMNS = "id, nombre, descripcion, imagen";

async function findAll() {
  const [rows] = await database.query(
    `SELECT ${COLUMNS} FROM especialidades ORDER BY id`,
  );
  return rows;
}

async function findById(id) {
  const [rows] = await database.execute(
    `SELECT ${COLUMNS} FROM especialidades WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
}

async function create({ nombre, descripcion, imagen }) {
  const [result] = await database.execute(
    "INSERT INTO especialidades (nombre, descripcion, imagen) VALUES (?, ?, ?)",
    [nombre, descripcion ?? null, imagen ?? null],
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const columnNames = {
    nombre: "nombre",
    descripcion: "descripcion",
    imagen: "imagen",
  };
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${columnNames[field]} = ?`);
  const values = entries.map(([, value]) => value);

  await database.execute(
    `UPDATE especialidades SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id],
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await database.execute(
    "DELETE FROM especialidades WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };