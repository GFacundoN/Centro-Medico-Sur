const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const emergenciaController = require('../controllers/emergencia.controller');
const { auth, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Todas las rutas requieren autenticación
router.use(auth);

// Get all emergencias
router.get('/', emergenciaController.getAll);

// Get emergencias activas
router.get('/activas', emergenciaController.getActivas);

// Get emergencia by ID
router.get('/:id', emergenciaController.getById);

// Create emergencia
router.post('/', authorize('recepcion', 'profesional', 'admin'), [
  body('id_paciente').notEmpty().withMessage('El paciente es requerido'),
  body('motivo').notEmpty().withMessage('El motivo es requerido'),
  validate
], emergenciaController.create);

// Update emergencia
router.put('/:id', authorize('recepcion', 'profesional', 'admin'), emergenciaController.update);

// Update estado de emergencia
router.patch('/:id/estado', authorize('recepcion', 'profesional', 'admin'), [
  body('estado').isIn(['activa', 'en_atencion', 'atendida', 'derivada']).withMessage('Estado inválido'),
  validate
], emergenciaController.updateEstado);

// Delete emergencia (admin only)
router.delete('/:id', authorize('admin'), emergenciaController.delete);

module.exports = router;
