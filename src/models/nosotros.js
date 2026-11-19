const database = require("../config/database");

const COLUMNS = "id, historia, direccion, telefono, email, horario, foto";

async function get() {
  const [rows] = await database.query(
    `SELECT ${COLUMNS} FROM nosotros ORDER BY id LIMIT 1`,
  );
  return rows[0] || null;
}

async function update(fields) {
  const current = await get();
  if (!current) {
    return null;
  }
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${field} = ?`);
  const values = entries.map(([, value]) => value);

  await database.execute(
    `UPDATE nosotros SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, current.id],
  );
  return get();
}

module.exports = { get, update };