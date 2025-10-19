const db = require('../config/database');

class Paciente {
  static async findAll() {
    const [rows] = await db.query(
      'SELECT * FROM Paciente ORDER BY apellido, nombre'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM Paciente WHERE id_paciente = ?',
      [id]
    );
    return rows[0];
  }

  static async findByDni(dni) {
    const [rows] = await db.query(
      'SELECT * FROM Paciente WHERE dni = ?',
      [dni]
    );
    return rows[0];
  }

  static async search(searchTerm) {
    const [rows] = await db.query(
      `SELECT * FROM Paciente 
       WHERE dni LIKE ? OR nombre LIKE ? OR apellido LIKE ? OR email LIKE ?
       ORDER BY apellido, nombre`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }

  static async create(pacienteData) {
    const { dni, nombre, apellido, fecha_nacimiento, telefono, email } = pacienteData;
    
    const [result] = await db.query(
      'INSERT INTO Paciente (dni, nombre, apellido, fecha_nacimiento, telefono, email) VALUES (?, ?, ?, ?, ?, ?)',
      [dni, nombre, apellido, fecha_nacimiento, telefono, email]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, pacienteData) {
    const { dni, nombre, apellido, fecha_nacimiento, telefono, email } = pacienteData;
    
    await db.query(
      'UPDATE Paciente SET dni = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, telefono = ?, email = ? WHERE id_paciente = ?',
      [dni, nombre, apellido, fecha_nacimiento, telefono, email, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM Paciente WHERE id_paciente = ?', [id]);
    return true;
  }

  static async getHistorial(id) {
    const [turnos] = await db.query(
      `SELECT t.*, a.fecha, a.hora_inicio, u.nombre as profesional_nombre, prof.especialidad,
              c.nombre as consultorio_nombre, at.diagnostico, at.tratamiento, at.notas
       FROM Turno t
       JOIN Agenda a ON t.id_agenda = a.id_agenda
       JOIN Profesional prof ON a.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       JOIN Consultorio c ON a.id_consultorio = c.id_consultorio
       LEFT JOIN Atencion at ON t.id_turno = at.id_turno
       WHERE t.id_paciente = ? AND t.estado = 'atendido'
       ORDER BY a.fecha DESC, a.hora_inicio DESC`,
      [id]
    );
    
    const [emergencias] = await db.query(
      `SELECT e.*, u.nombre as profesional_nombre, prof.especialidad, c.nombre as consultorio_nombre,
              at.diagnostico, at.tratamiento, at.notas
       FROM Emergencia e
       LEFT JOIN Profesional prof ON e.id_profesional = prof.id_profesional
       LEFT JOIN Usuario u ON prof.id_usuario = u.id_usuario
       LEFT JOIN Consultorio c ON e.id_consultorio = c.id_consultorio
       LEFT JOIN Atencion at ON e.id_emergencia = at.id_emergencia
       WHERE e.id_paciente = ?
       ORDER BY e.fecha_hora DESC`,
      [id]
    );
    
    return { turnos, emergencias };
  }
}

module.exports = Paciente;
