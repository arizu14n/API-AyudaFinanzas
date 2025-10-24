const cloudinary = require('../services/cloudinary');
const checkModel = require('../models/check');

const createCheck = async (req, res) => {
  const { nro, banco, librador, fecha_emision, importe, estado } = req.body;
  const { userId } = req.user;

  if (!req.file) {
    return res.status(400).json({ message: 'La imagen del cheque es requerida.' });
  }

  try {
    // Subir imagen a Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const imagen_url = uploadResult.secure_url;

    // Guardar cheque en la base de datos
    const newCheck = await checkModel.createCheck({
      nro,
      banco,
      librador,
      fecha_emision,
      importe,
      imagen_url,
      estado,
      usuario_id: userId,
    });

    res.status(201).json({ message: 'Cheque registrado exitosamente.', check: newCheck });
  } catch (error) {
    console.error('Error al registrar cheque:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getChecks = async (req, res) => {
  const { userId } = req.user;

  try {
    const checks = await checkModel.getChecksByUserId(userId);
    res.json(checks);
  } catch (error) {
    console.error('Error al obtener cheques:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateCheck = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { nro, banco, librador, fecha_emision, importe, estado } = req.body;

  try {
    const check = await checkModel.getCheckById(id);

    if (!check) {
      return res.status(404).json({ message: 'Cheque no encontrado.' });
    }

    if (check.usuario_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para modificar este cheque.' });
    }

    const updatedCheckData = {
      nro: nro || check.nro,
      banco: banco || check.banco,
      librador: librador || check.librador,
      fecha_emision: fecha_emision || check.fecha_emision,
      importe: importe || check.importe,
      estado: estado || check.estado,
    };

    const updatedCheck = await checkModel.updateCheckById(id, updatedCheckData);

    res.json({ message: 'Cheque actualizado exitosamente.', check: updatedCheck });
  } catch (error) {
    console.error('Error al actualizar cheque:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteCheck = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const check = await checkModel.getCheckById(id);

    if (!check) {
      return res.status(404).json({ message: 'Cheque no encontrado.' });
    }

    if (check.usuario_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este cheque.' });
    }

    await checkModel.deleteCheckById(id);

    res.json({ message: 'Cheque eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar cheque:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  createCheck,
  getChecks,
  updateCheck,
  deleteCheck,
};
