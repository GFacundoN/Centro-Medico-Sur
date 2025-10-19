const db = require('../config/database');

class Emergencia {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT e.*, 
              p.nombre as paciente_nombre, p.apellido as paciente_apellido, p.dni as paciente_dni,
              prof.especialidad,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre
       FROM Emergencia e
       JOIN Paciente p ON e.id_paciente = p.id_paciente
       LEFT JOIN Profesional prof ON e.id_profesional = prof.id_profesional
       LEFT JOIN Usuario u ON prof.id_usuario = u.id_usuario
       LEFT JOIN Consultorio c ON e.id_consultorio = c.id_consultorio
       ORDER BY e.fecha_hora DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT e.*, 
              p.nombre as paciente_nombre, p.apellido as paciente_apellido, p.dni as paciente_dni,
              p.telefono as paciente_telefono, p.email as paciente_email,
              prof.especialidad, prof.id_profesional,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre, c.id_consultorio
       FROM Emergencia e
       JOIN Paciente p ON e.id_paciente = p.id_paciente
       LEFT JOIN Profesional prof ON e.id_profesional = prof.id_profesional
       LEFT JOIN Usuario u ON prof.id_usuario = u.id_usuario
       LEFT JOIN Consultorio c ON e.id_consultorio = c.id_consultorio
       WHERE e.id_emergencia = ?`,
      [id]
    );
    return rows[0];
  }

  static async findActivas() {
    const [rows] = await db.query(
      `SELECT e.*, 
              p.nombre as paciente_nombre, p.apellido as paciente_apellido, p.dni as paciente_dni,
              prof.especialidad,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre
       FROM Emergencia e
       JOIN Paciente p ON e.id_paciente = p.id_paciente
       LEFT JOIN Profesional prof ON e.id_profesional = prof.id_profesional
       LEFT JOIN Usuario u ON prof.id_usuario = u.id_usuario
       LEFT JOIN Consultorio c ON e.id_consultorio = c.id_consultorio
       WHERE e.estado IN ('activa', 'en_atencion')
       ORDER BY e.fecha_hora DESC`
    );
    return rows;
  }

  static async findByProfesional(profesionalId) {
    const [rows] = await db.query(
      `SELECT e.*, 
              p.nombre as paciente_nombre, p.apellido as paciente_apellido, p.dni as paciente_dni,
              prof.especialidad,
              u.nombre as profesional_nombre,
              c.nombre as consultorio_nombre
       FROM Emergencia e
       JOIN Paciente p ON e.id_paciente = p.id_paciente
       JOIN Profesional prof ON e.id_profesional = prof.id_profesional
       JOIN Usuario u ON prof.id_usuario = u.id_usuario
       LEFT JOIN Consultorio c ON e.id_consultorio = c.id_consultorio
       WHERE prof.id_profesional = ?
       ORDER BY e.fecha_hora DESC`,
      [profesionalId]
    );
    return rows;
  }

  static async create(emergenciaData) {
    const { id_paciente, id_profesional, id_consultorio, motivo, estado } = emergenciaData;
    
    const [result] = await db.query(
      'INSERT INTO Emergencia (id_paciente, id_profesional, id_consultorio, motivo, estado) VALUES (?, ?, ?, ?, ?)',
      [id_paciente, id_profesional || null, id_consultorio || null, motivo, estado || 'activa']
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, emergenciaData) {
    const { id_profesional, id_consultorio, motivo, estado } = emergenciaData;
    
    await db.query(
      'UPDATE Emergencia SET id_profesional = ?, id_consultorio = ?, motivo = ?, estado = ? WHERE id_emergencia = ?',
      [id_profesional, id_consultorio, motivo, estado, id]
    );
    
    return this.findById(id);
  }

  static async updateEstado(id, estado) {
    await db.query(
      'UPDATE Emergencia SET estado = ? WHERE id_emergencia = ?',
      [estado, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM Emergencia WHERE id_emergencia = ?', [id]);
    return true;
  }
}

module.exports = Emergencia;
