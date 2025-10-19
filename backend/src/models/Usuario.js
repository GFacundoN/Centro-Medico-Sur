const db = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
  static async findAll() {
    const [rows] = await db.query(
      'SELECT id_usuario, nombre, email, rol, created_at FROM Usuario'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id_usuario, nombre, email, rol, created_at FROM Usuario WHERE id_usuario = ?',
      [id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM Usuario WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async create(userData) {
    const { nombre, email, password, rol } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO Usuario (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, userData) {
    const { nombre, email, rol } = userData;
    
    await db.query(
      'UPDATE Usuario SET nombre = ?, email = ?, rol = ? WHERE id_usuario = ?',
      [nombre, email, rol, id]
    );
    
    return this.findById(id);
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.query(
      'UPDATE Usuario SET password = ? WHERE id_usuario = ?',
      [hashedPassword, id]
    );
    
    return true;
  }

  static async delete(id) {
    await db.query('DELETE FROM Usuario WHERE id_usuario = ?', [id]);
    return true;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Usuario;
