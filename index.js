require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createUsersTable } = require('./src/models/user');
const { createChecksTable } = require('./src/models/check');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Crear las tablas al iniciar la app
createUsersTable();
createChecksTable();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API de AyudaFinanzas está funcionando!');
});

// Aquí irán las rutas de la API
app.use('/api/usuarios', require('./src/routes/users'));
app.use('/api/cheques', require('./src/routes/cheques'));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});