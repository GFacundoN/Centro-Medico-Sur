const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const turnoController = require('../controllers/turno.controller');
const { auth, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Todas las rutas requieren autenticación
router.use(auth);

// Get all turnos
router.get('/', turnoController.getAll);

// Get turno by ID
router.get('/:id', turnoController.getById);

// Get turnos by paciente
router.get('/paciente/:pacienteId', turnoController.getByPaciente);

// Get turnos by profesional
router.get('/profesional/:profesionalId', turnoController.getByProfesional);

// Get turnos disponibles de una agenda
router.get('/disponibles/:agendaId', turnoController.getTurnosDisponibles);

// Create turno (recepcion, admin)
router.post('/', authorize('recepcion', 'admin'), [
  body('id_agenda').notEmpty().withMessage('La agenda es requerida'),
  body('id_paciente').notEmpty().withMessage('El paciente es requerido'),
  body('fecha_hora').isISO8601().withMessage('Fecha y hora inválida'),
  validate
], turnoController.create);

// Update turno (recepcion, admin)
router.put('/:id', authorize('recepcion', 'admin'), turnoController.update);

// Update estado del turno
router.patch('/:id/estado', authorize('recepcion', 'profesional', 'admin'), [
  body('estado').isIn(['reservado', 'confirmado', 'cancelado', 'atendido']).withMessage('Estado inválido'),
  validate
], turnoController.updateEstado);

// Delete turno (admin only)
router.delete('/:id', authorize('admin'), turnoController.delete);

module.exports = router;
