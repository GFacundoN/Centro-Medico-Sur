const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const profesionalController = require('../controllers/profesional.controller');
const { auth, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Todas las rutas requieren autenticación
router.use(auth);

// Get all profesionales
router.get('/', profesionalController.getAll);

// Get profesional by ID
router.get('/:id', profesionalController.getById);

// Update profesional (admin only)
router.put('/:id', authorize('admin'), [
  body('especialidad').notEmpty().withMessage('La especialidad es requerida'),
  validate
], profesionalController.update);

module.exports = router;
