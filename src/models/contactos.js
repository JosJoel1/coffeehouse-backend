const database = require("../config/database");

const COLUMNS = "id, nombre, email, mensaje, fecha";

async function findAll() {
  const [rows] = await database.query(
    `SELECT ${COLUMNS} FROM contactos ORDER BY id DESC`,
  );
  return rows;
}

async function findById(id) {
  const [rows] = await database.execute(
    `SELECT ${COLUMNS} FROM contactos WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
}

async function create({ nombre, email, mensaje }) {
  const [result] = await database.execute(
    "INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)",
    [nombre, email, mensaje],
  );
  return findById(result.insertId);
}

module.exports = { findAll, findById, create };