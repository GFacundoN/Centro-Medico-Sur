const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validator');

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validate
], authController.login);

// Register
router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['recepcion', 'profesional', 'admin', 'director']).withMessage('Rol inválido'),
  validate
], authController.register);

// Profile (requiere autenticación)
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  validate
], authController.updateProfile);

// Change password
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('La contraseña actual es requerida'),
  body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  validate
], authController.changePassword);

module.exports = router;
