const db = require('../config/database');

class ListaEspera {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT l.*, 
              p.dni, p.nombre, p.apellido, p.telefono, p.email
       FROM ListaEspera l
       JOIN Paciente p ON l.id_paciente = p.id_paciente
       ORDER BY l.fecha_solicitud ASC`
    );
    return rows;
  }

  static async findActivas() {
    const [rows] = await db.query(
      `SELECT l.*, 
              p.dni, p.nombre, p.apellido, p.telefono, p.email
       FROM ListaEspera l
       JOIN Paciente p ON l.id_paciente = p.id_paciente
       WHERE l.estado = 'activa'
       ORDER BY l.fecha_solicitud ASC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT l.*, 
              p.dni, p.nombre, p.apellido, p.telefono, p.email
       FROM ListaEspera l
       JOIN Paciente p ON l.id_paciente = p.id_paciente
       WHERE l.id_lista = ?`,
      [id]
    );
    return rows[0];
  }

  static async create(listaData) {
    const { id_paciente } = listaData;
    
    const [result] = await db.query(
      'INSERT INTO ListaEspera (id_paciente, estado) VALUES (?, "activa")',
      [id_paciente]
    );
    
    return this.findById(result.insertId);
  }

  static async updateEstado(id, estado) {
    await db.query(
      'UPDATE ListaEspera SET estado = ? WHERE id_lista = ?',
      [estado, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM ListaEspera WHERE id_lista = ?', [id]);
    return true;
  }
}

module.exports = ListaEspera;
