const db = require('../config/database');

class Profesional {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT p.*, u.nombre, u.email, u.rol
       FROM Profesional p
       JOIN Usuario u ON p.id_usuario = u.id_usuario
       ORDER BY u.nombre`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT p.*, u.nombre, u.email, u.rol
       FROM Profesional p
       JOIN Usuario u ON p.id_usuario = u.id_usuario
       WHERE p.id_profesional = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUsuarioId(usuarioId) {
    const [rows] = await db.query(
      `SELECT p.*, u.nombre, u.email, u.rol
       FROM Profesional p
       JOIN Usuario u ON p.id_usuario = u.id_usuario
       WHERE p.id_usuario = ?`,
      [usuarioId]
    );
    return rows[0];
  }

  static async create(profesionalData) {
    const { id_usuario, especialidad } = profesionalData;
    
    const [result] = await db.query(
      'INSERT INTO Profesional (id_usuario, especialidad) VALUES (?, ?)',
      [id_usuario, especialidad]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, profesionalData) {
    const { especialidad } = profesionalData;
    
    await db.query(
      'UPDATE Profesional SET especialidad = ? WHERE id_profesional = ?',
      [especialidad, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM Profesional WHERE id_profesional = ?', [id]);
    return true;
  }
}

module.exports = Profesional;
