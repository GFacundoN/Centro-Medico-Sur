const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const consultorioController = require('../controllers/consultorio.controller');
const { auth, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Todas las rutas requieren autenticación
router.use(auth);

// Get all consultorios
router.get('/', consultorioController.getAll);

// Get all sectores
router.get('/sectores/all', consultorioController.getAllSectores);

// Get consultorio by ID
router.get('/:id', consultorioController.getById);

// Create consultorio (admin only)
router.post('/', authorize('admin'), [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('id_sector').notEmpty().withMessage('El sector es requerido'),
  validate
], consultorioController.create);

// Update consultorio (admin only)
router.put('/:id', authorize('admin'), [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('id_sector').notEmpty().withMessage('El sector es requerido'),
  validate
], consultorioController.update);

// Delete consultorio (admin only)
router.delete('/:id', authorize('admin'), consultorioController.delete);

module.exports = router;
