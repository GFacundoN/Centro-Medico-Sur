const db = require('../config/database');

class Atencion {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT a.*, 
              u.nombre as usuario_nombre,
              t.id_turno, t.descripcion as turno_descripcion,
              e.id_emergencia, e.motivo as emergencia_motivo
       FROM Atencion a
       JOIN Usuario u ON a.usuario_registro = u.id_usuario
       LEFT JOIN Turno t ON a.id_turno = t.id_turno
       LEFT JOIN Emergencia e ON a.id_emergencia = e.id_emergencia
       ORDER BY a.fecha_registro DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT a.*, 
              u.nombre as usuario_nombre,
              t.id_turno, t.descripcion as turno_descripcion,
              e.id_emergencia, e.motivo as emergencia_motivo
       FROM Atencion a
       JOIN Usuario u ON a.usuario_registro = u.id_usuario
       LEFT JOIN Turno t ON a.id_turno = t.id_turno
       LEFT JOIN Emergencia e ON a.id_emergencia = e.id_emergencia
       WHERE a.id_atencion = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByTurno(turnoId) {
    const [rows] = await db.query(
      `SELECT a.*, u.nombre as usuario_nombre
       FROM Atencion a
       JOIN Usuario u ON a.usuario_registro = u.id_usuario
       WHERE a.id_turno = ?`,
      [turnoId]
    );
    return rows[0];
  }

  static async findByEmergencia(emergenciaId) {
    const [rows] = await db.query(
      `SELECT a.*, u.nombre as usuario_nombre
       FROM Atencion a
       JOIN Usuario u ON a.usuario_registro = u.id_usuario
       WHERE a.id_emergencia = ?`,
      [emergenciaId]
    );
    return rows[0];
  }

  static async create(atencionData) {
    const { id_turno, id_emergencia, notas, diagnostico, tratamiento, usuario_registro } = atencionData;
    
    const [result] = await db.query(
      'INSERT INTO Atencion (id_turno, id_emergencia, notas, diagnostico, tratamiento, usuario_registro) VALUES (?, ?, ?, ?, ?, ?)',
      [id_turno || null, id_emergencia || null, notas, diagnostico, tratamiento, usuario_registro]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, atencionData) {
    const { notas, diagnostico, tratamiento } = atencionData;
    
    await db.query(
      'UPDATE Atencion SET notas = ?, diagnostico = ?, tratamiento = ? WHERE id_atencion = ?',
      [notas, diagnostico, tratamiento, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM Atencion WHERE id_atencion = ?', [id]);
    return true;
  }
}

module.exports = Atencion;
