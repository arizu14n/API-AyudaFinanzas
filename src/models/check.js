const db = require('./db');

const createChecksTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS cheques (
      id SERIAL PRIMARY KEY,
      nro VARCHAR(50),
      banco VARCHAR(100),
      librador VARCHAR(255),
      fecha_emision DATE,
      importe DECIMAL(10, 2),
      imagen_url VARCHAR(255),
      estado VARCHAR(50),
      usuario_id INTEGER REFERENCES usuarios(id)
    );
  `;
  try {
    await db.query(createTableQuery);
    console.log('Tabla "cheques" creada o ya existente.');
  } catch (err) {
    console.error('Error al crear la tabla "cheques":', err);
  }
};

const createCheck = async (checkData) => {
  const { nro, banco, librador, fecha_emision, importe, imagen_url, estado, usuario_id } = checkData;
  const insertQuery = `
    INSERT INTO cheques (nro, banco, librador, fecha_emision, importe, imagen_url, estado, usuario_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [nro, banco, librador, fecha_emision, importe, imagen_url, estado, usuario_id];
  const { rows } = await db.query(insertQuery, values);
  return rows[0];
};

const getChecksByUserId = async (userId) => {
  const query = 'SELECT * FROM cheques WHERE usuario_id = $1 ORDER BY fecha_emision DESC';
  const { rows } = await db.query(query, [userId]);
  return rows;
};

const getCheckById = async (id) => {
  const query = 'SELECT * FROM cheques WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const updateCheckById = async (id, checkData) => {
  const { nro, banco, librador, fecha_emision, importe, estado } = checkData;
  const query = `
    UPDATE cheques
    SET nro = $1, banco = $2, librador = $3, fecha_emision = $4, importe = $5, estado = $6
    WHERE id = $7
    RETURNING *;
  `;
  const values = [nro, banco, librador, fecha_emision, importe, estado, id];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const deleteCheckById = async (id) => {
  const query = 'DELETE FROM cheques WHERE id = $1';
  await db.query(query, [id]);
};

module.exports = {
  createChecksTable,
  createCheck,
  getChecksByUserId,
  getCheckById,
  updateCheckById,
  deleteCheckById,
};
