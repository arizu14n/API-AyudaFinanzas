const db = require('./db');

const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL
    );
  `;
  try {
    await db.query(createTableQuery);
    console.log('Tabla "usuarios" creada o ya existente.');
  } catch (err) {
    console.error('Error al crear la tabla "usuarios":', err);
  }
};

const createUser = async (email, passwordHash) => {
  const insertQuery = `
    INSERT INTO usuarios (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email;
  `;
  const values = [email, passwordHash];
  const { rows } = await db.query(insertQuery, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const { rows } = await db.query(query, [email]);
  return rows[0];
};

module.exports = {
  createUsersTable,
  createUser,
  findUserByEmail,
};
