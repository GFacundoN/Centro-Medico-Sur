const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const pacienteRoutes = require('./paciente.routes');
const turnoRoutes = require('./turno.routes');
const agendaRoutes = require('./agenda.routes');
const emergenciaRoutes = require('./emergencia.routes');
const listaEsperaRoutes = require('./listaEspera.routes');
const consultorioRoutes = require('./consultorio.routes');
const profesionalRoutes = require('./profesional.routes');

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Centro Médico Sur API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      pacientes: '/api/pacientes',
      turnos: '/api/turnos',
      agendas: '/api/agendas',
      emergencias: '/api/emergencias',
      listaEspera: '/api/lista-espera',
      consultorios: '/api/consultorios',
      profesionales: '/api/profesionales'
    }
  });
});

// Register routes
router.use('/auth', authRoutes);
router.use('/pacientes', pacienteRoutes);
router.use('/turnos', turnoRoutes);
router.use('/agendas', agendaRoutes);
router.use('/emergencias', emergenciaRoutes);
router.use('/lista-espera', listaEsperaRoutes);
router.use('/consultorios', consultorioRoutes);
router.use('/profesionales', profesionalRoutes);

module.exports = router;
