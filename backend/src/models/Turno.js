const db = require('../config/database');

class Turno {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT t.*, 
              p.nombre as paciente_nombre, p.apellido as paciente_apellido, p.dni as paciente_dni,
              a.fecha, a.hora_inicio, a.hora_fin,
              prof.especialidad,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre
       FROM Turno t
       LEFT JOIN Paciente p ON t.id_paciente = p.id_paciente
       JOIN Agenda a ON t.id_agenda = a.id_agenda
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       ORDER BY a.fecha DESC, t.fecha_hora DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT t.*, 
              p.nombre as paciente_nombre, p.apellido as paciente_apellido, p.dni as paciente_dni,
              p.telefono as paciente_telefono, p.email as paciente_email,
              a.fecha, a.hora_inicio, a.hora_fin,
              prof.especialidad, prof.id_profesional,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre, c.id_consultorio
       FROM Turno t
       LEFT JOIN Paciente p ON t.id_paciente = p.id_paciente
       JOIN Agenda a ON t.id_agenda = a.id_agenda
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       WHERE t.id_turno = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByPaciente(pacienteId) {
    const [rows] = await db.query(
      `SELECT t.*, 
              a.fecha, a.hora_inicio, a.hora_fin,
              prof.especialidad,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre
       FROM Turno t
       JOIN Agenda a ON t.id_agenda = a.id_agenda
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       WHERE t.id_paciente = ?
       ORDER BY a.fecha DESC, t.fecha_hora DESC`,
      [pacienteId]
    );
    return rows;
  }

  static async findByFecha(fecha) {
    const [rows] = await db.query(
      `SELECT t.*, 
              p.nombre as paciente_nombre, p.apellido as paciente_apellido, p.dni as paciente_dni,
              a.fecha, a.hora_inicio, a.hora_fin,
              prof.especialidad,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre
       FROM Turno t
       LEFT JOIN Paciente p ON t.id_paciente = p.id_paciente
       JOIN Agenda a ON t.id_agenda = a.id_agenda
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       WHERE a.fecha = ?
       ORDER BY t.fecha_hora`,
      [fecha]
    );
    return rows;
  }

  static async findByProfesional(profesionalId, fecha = null) {
    let query = `SELECT t.*, 
              p.nombre as paciente_nombre, p.apellido as paciente_apellido, p.dni as paciente_dni,
              a.fecha, a.hora_inicio, a.hora_fin,
              prof.especialidad,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre
       FROM Turno t
       LEFT JOIN Paciente p ON t.id_paciente = p.id_paciente
       JOIN Agenda a ON t.id_agenda = a.id_agenda
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       WHERE prof.id_profesional = ?`;
    
    const params = [profesionalId];
    
    if (fecha) {
      query += ' AND a.fecha = ?';
      params.push(fecha);
    }
    
    query += ' ORDER BY a.fecha DESC, t.fecha_hora';
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async create(turnoData) {
    const { id_agenda, id_paciente, descripcion, fecha_hora, duracion_min, estado } = turnoData;
    
    const [result] = await db.query(
      'INSERT INTO Turno (id_agenda, id_paciente, descripcion, fecha_hora, duracion_min, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [id_agenda, id_paciente, descripcion, fecha_hora, duracion_min || 30, estado || 'reservado']
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, turnoData) {
    const { id_paciente, descripcion, fecha_hora, estado } = turnoData;
    
    await db.query(
      'UPDATE Turno SET id_paciente = ?, descripcion = ?, fecha_hora = ?, estado = ? WHERE id_turno = ?',
      [id_paciente, descripcion, fecha_hora, estado, id]
    );
    
    return this.findById(id);
  }

  static async updateEstado(id, estado) {
    await db.query(
      'UPDATE Turno SET estado = ? WHERE id_turno = ?',
      [estado, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM Turno WHERE id_turno = ?', [id]);
    return true;
  }

  static async getTurnosDisponibles(agendaId) {
    const [agenda] = await db.query(
      'SELECT * FROM Agenda WHERE id_agenda = ?',
      [agendaId]
    );
    
    if (!agenda[0]) return [];
    
    const [turnosOcupados] = await db.query(
      'SELECT fecha_hora, duracion_min FROM Turno WHERE id_agenda = ? AND estado != "cancelado"',
      [agendaId]
    );
    
    return { agenda: agenda[0], turnosOcupados };
  }
}

module.exports = Turno;
