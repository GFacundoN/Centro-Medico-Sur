const db = require('../config/database');

class Consultorio {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT c.*, s.nombre as sector_nombre
       FROM Consultorio c
       JOIN Sector s ON c.id_sector = s.id_sector
       ORDER BY c.nombre`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT c.*, s.nombre as sector_nombre
       FROM Consultorio c
       JOIN Sector s ON c.id_sector = s.id_sector
       WHERE c.id_consultorio = ?`,
      [id]
    );
    return rows[0];
  }

  static async findBySector(sectorId) {
    const [rows] = await db.query(
      `SELECT c.*, s.nombre as sector_nombre
       FROM Consultorio c
       JOIN Sector s ON c.id_sector = s.id_sector
       WHERE c.id_sector = ?
       ORDER BY c.nombre`,
      [sectorId]
    );
    return rows;
  }

  static async create(consultorioData) {
    const { nombre, id_sector } = consultorioData;
    
    const [result] = await db.query(
      'INSERT INTO Consultorio (nombre, id_sector) VALUES (?, ?)',
      [nombre, id_sector]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, consultorioData) {
    const { nombre, id_sector } = consultorioData;
    
    await db.query(
      'UPDATE Consultorio SET nombre = ?, id_sector = ? WHERE id_consultorio = ?',
      [nombre, id_sector, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM Consultorio WHERE id_consultorio = ?', [id]);
    return true;
  }
}

module.exports = Consultorio;
