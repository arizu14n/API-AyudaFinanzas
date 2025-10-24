const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');
const checkController = require('../controllers/cheques');

// Crear un nuevo cheque
router.post(
  '/',
  auth,
  upload.single('imagen'),
  checkController.createCheck
);

// Obtener todos los cheques del usuario logueado
router.get('/', auth, checkController.getChecks);

// Actualizar un cheque existente
router.put('/:id', auth, checkController.updateCheck);

// Eliminar un cheque
router.delete('/:id', auth, checkController.deleteCheck);

module.exports = router;
