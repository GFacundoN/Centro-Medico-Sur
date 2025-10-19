const db = require('../config/database');

exports.getEstadisticas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    // Total de pacientes
    const [pacientes] = await db.query(
      'SELECT COUNT(*) as total FROM Paciente'
    );
    
    // Total de turnos en el periodo
    const [turnos] = await db.query(
      `SELECT COUNT(*) as total FROM Turno t
       JOIN Agenda a ON t.id_agenda = a.id_agenda
       WHERE a.fecha BETWEEN ? AND ?`,
      [fechaInicio, fechaFin]
    );
    
    // Total de emergencias en el periodo
    const [emergencias] = await db.query(
      `SELECT COUNT(*) as total FROM Emergencia
       WHERE DATE(fecha_hora) BETWEEN ? AND ?`,
      [fechaInicio, fechaFin]
    );
    
    // Turnos por estado
    const [turnosPorEstado] = await db.query(
      `SELECT estado, COUNT(*) as cantidad FROM Turno t
       JOIN Agenda a ON t.id_agenda = a.id_agenda
       WHERE a.fecha BETWEEN ? AND ?
       GROUP BY estado`,
      [fechaInicio, fechaFin]
    );
    
    // Emergencias por estado
    const [emergenciasPorEstado] = await db.query(
      `SELECT estado, COUNT(*) as cantidad FROM Emergencia
       WHERE DATE(fecha_hora) BETWEEN ? AND ?
       GROUP BY estado`,
      [fechaInicio, fechaFin]
    );
    
    // Profesionales más activos
    const [profesionalesMasActivos] = await db.query(
      `SELECT 
         u.nombre,
         prof.especialidad,
         COUNT(DISTINCT t.id_turno) as turnos_atendidos,
         COUNT(DISTINCT e.id_emergencia) as emergencias_atendidas
       FROM Profesional prof
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       LEFT JOIN Agenda a ON prof.id_profesional = a.id_profesional
       LEFT JOIN Turno t ON a.id_agenda = t.id_agenda AND t.estado = 'atendido' AND a.fecha BETWEEN ? AND ?
       LEFT JOIN Emergencia e ON prof.id_profesional = e.id_profesional AND e.estado = 'atendida' AND DATE(e.fecha_hora) BETWEEN ? AND ?
       GROUP BY prof.id_profesional, u.nombre, prof.especialidad
       ORDER BY (turnos_atendidos + emergencias_atendidas) DESC
       LIMIT 10`,
      [fechaInicio, fechaFin, fechaInicio, fechaFin]
    );
    
    // Formatear resultados
    const turnosPorEstadoObj = {};
    turnosPorEstado.forEach(row => {
      turnosPorEstadoObj[row.estado] = row.cantidad;
    });
    
    const emergenciasPorEstadoObj = {};
    emergenciasPorEstado.forEach(row => {
      emergenciasPorEstadoObj[row.estado] = row.cantidad;
    });
    
    res.json({
      totalPacientes: pacientes[0].total,
      totalTurnos: turnos[0].total,
      totalEmergencias: emergencias[0].total,
      turnosPorEstado: turnosPorEstadoObj,
      emergenciasPorEstado: emergenciasPorEstadoObj,
      profesionalesMasActivos
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};