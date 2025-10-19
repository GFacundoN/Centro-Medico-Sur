const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');
const { auth } = require('../middlewares/auth');

// Todas las rutas requieren autenticación y rol admin o director
const requireAdminOrDirector = (req, res, next) => {
  if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'director') {
    return res.status(403).json({ error: 'No tiene permisos para acceder a esta sección' });
  }
  next();
};

router.get('/estadisticas', auth, requireAdminOrDirector, reporteController.getEstadisticas);

module.exports = router;