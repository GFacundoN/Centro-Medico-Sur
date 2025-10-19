const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pacienteController = require('../controllers/paciente.controller');
const { auth, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Todas las rutas requieren autenticación
router.use(auth);

// Get all pacientes
router.get('/', pacienteController.getAll);

// Search pacientes
router.get('/search', pacienteController.search);

// Get paciente by ID
router.get('/:id', pacienteController.getById);

// Get historial del paciente
router.get('/:id/historial', pacienteController.getHistorial);

// Create paciente (recepcion, admin)
router.post('/', authorize('recepcion', 'admin'), [
  body('dni').notEmpty().withMessage('El DNI es requerido'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('fecha_nacimiento').isDate().withMessage('Fecha de nacimiento inválida'),
  validate
], pacienteController.create);

// Update paciente (recepcion, admin)
router.put('/:id', authorize('recepcion', 'admin'), [
  body('dni').notEmpty().withMessage('El DNI es requerido'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('fecha_nacimiento').isDate().withMessage('Fecha de nacimiento inválida'),
  validate
], pacienteController.update);

// Delete paciente (admin only)
router.delete('/:id', authorize('admin'), pacienteController.delete);

module.exports = router;
