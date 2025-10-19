const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const agendaController = require('../controllers/agenda.controller');
const { auth, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Todas las rutas requieren autenticación
router.use(auth);

// Get all agendas
router.get('/', agendaController.getAll);

// Get agenda by ID
router.get('/:id', agendaController.getById);

// Create agenda (admin only)
router.post('/', authorize('admin'), [
  body('id_profesional').notEmpty().withMessage('El profesional es requerido'),
  body('id_consultorio').notEmpty().withMessage('El consultorio es requerido'),
  body('fecha').isDate().withMessage('Fecha inválida'),
  body('hora_inicio').notEmpty().withMessage('Hora de inicio requerida'),
  body('hora_fin').notEmpty().withMessage('Hora de fin requerida'),
  validate
], agendaController.create);

// Update agenda (admin only)
router.put('/:id', authorize('admin'), [
  body('id_profesional').notEmpty().withMessage('El profesional es requerido'),
  body('id_consultorio').notEmpty().withMessage('El consultorio es requerido'),
  body('fecha').isDate().withMessage('Fecha inválida'),
  body('hora_inicio').notEmpty().withMessage('Hora de inicio requerida'),
  body('hora_fin').notEmpty().withMessage('Hora de fin requerida'),
  validate
], agendaController.update);

// Delete agenda (admin only)
router.delete('/:id', authorize('admin'), agendaController.delete);

module.exports = router;
