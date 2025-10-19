const db = require('../config/database');

class Agenda {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT a.*, 
              u.nombre as profesional_nombre,
              prof.especialidad,
              c.nombre as consultorio_nombre,
              s.nombre as sector_nombre
       FROM Agenda a
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       JOIN Sector s ON c.id_sector = s.id_sector
       ORDER BY a.fecha DESC, a.hora_inicio`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT a.*, 
              u.nombre as profesional_nombre,
              prof.especialidad,
              c.nombre as consultorio_nombre,
              s.nombre as sector_nombre
       FROM Agenda a
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       JOIN Sector s ON c.id_sector = s.id_sector
       WHERE a.id_agenda = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByProfesional(profesionalId) {
    const [rows] = await db.query(
      `SELECT a.*, 
              c.nombre as consultorio_nombre,
              s.nombre as sector_nombre
       FROM Agenda a
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       JOIN Sector s ON c.id_sector = s.id_sector
       WHERE a.id_profesional = ?
       ORDER BY a.fecha DESC, a.hora_inicio`,
      [profesionalId]
    );
    return rows;
  }

  static async findByFecha(fecha) {
    const [rows] = await db.query(
      `SELECT a.*, 
              u.nombre as profesional_nombre,
              prof.especialidad,
              c.nombre as consultorio_nombre,
              s.nombre as sector_nombre
       FROM Agenda a
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       JOIN Sector s ON c.id_sector = s.id_sector
       WHERE a.fecha = ?
       ORDER BY a.hora_inicio`,
      [fecha]
    );
    return rows;
  }

  static async create(agendaData) {
    const { id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min } = agendaData;
    
    const [result] = await db.query(
      'INSERT INTO Agenda (id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min) VALUES (?, ?, ?, ?, ?, ?)',
      [id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min || 30]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, agendaData) {
    const { id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min } = agendaData;
    
    await db.query(
      'UPDATE Agenda SET id_profesional = ?, id_consultorio = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, duracion_turno_min = ? WHERE id_agenda = ?',
      [id_profesional, id_consultorio, fecha, hora_inicio, hora_fin, duracion_turno_min, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM Agenda WHERE id_agenda = ?', [id]);
    return true;
  }
}

module.exports = Agenda;
