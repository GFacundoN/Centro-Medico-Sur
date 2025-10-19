const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const usuarioController = require('../controllers/usuario.controller');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Middleware para verificar que sea admin
const requireAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
  }
  next();
};

// Obtener todos los usuarios
router.get('/', auth, requireAdmin, usuarioController.getAll);

// Obtener usuario por ID
router.get('/:id', auth, requireAdmin, usuarioController.getById);

// Actualizar usuario
router.put('/:id', auth, requireAdmin, [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('rol').isIn(['recepcion', 'profesional', 'admin', 'director']).withMessage('Rol inválido'),
  validate
], usuarioController.update);

// Actualizar contraseña
router.put('/:id/password', auth, requireAdmin, [
  body('newPassword').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validate
], usuarioController.updatePassword);

// Eliminar usuario
router.delete('/:id', auth, requireAdmin, usuarioController.delete);

module.exports = router;