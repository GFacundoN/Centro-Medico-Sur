const db = require('../config/database');

class Sector {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM Sector ORDER BY nombre');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Sector WHERE id_sector = ?', [id]);
    return rows[0];
  }

  static async create(sectorData) {
    const { nombre } = sectorData;
    
    const [result] = await db.query(
      'INSERT INTO Sector (nombre) VALUES (?)',
      [nombre]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, sectorData) {
    const { nombre } = sectorData;
    
    await db.query(
      'UPDATE Sector SET nombre = ? WHERE id_sector = ?',
      [nombre, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM Sector WHERE id_sector = ?', [id]);
    return true;
  }
}

module.exports = Sector;
