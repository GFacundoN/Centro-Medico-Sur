const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const listaEsperaController = require('../controllers/listaEspera.controller');
const { auth, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Todas las rutas requieren autenticación
router.use(auth);

// Get all lista de espera
router.get('/', listaEsperaController.getAll);

// Get lista de espera activa
router.get('/activas', listaEsperaController.getActivas);

// Get item by ID
router.get('/:id', listaEsperaController.getById);

// Add to lista de espera (recepcion, admin)
router.post('/', authorize('recepcion', 'admin'), [
  body('id_paciente').notEmpty().withMessage('El paciente es requerido'),
  validate
], listaEsperaController.create);

// Update estado (recepcion, admin)
router.patch('/:id/estado', authorize('recepcion', 'admin'), [
  body('estado').isIn(['activa', 'asignada', 'cancelada']).withMessage('Estado inválido'),
  validate
], listaEsperaController.updateEstado);

// Delete from lista de espera (admin only)
router.delete('/:id', authorize('admin'), listaEsperaController.delete);

module.exports = router;
