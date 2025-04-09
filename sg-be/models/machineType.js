const db = require('../db');

// Create machine_types table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS machine_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

class MachineType {
    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM machine_types', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM machine_types WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async create(name) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO machine_types (name) VALUES (?)',
                [name],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static async update(id, name) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE machine_types SET name = ? WHERE id = ?',
                [name, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM machine_types WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
}

module.exports = MachineType; 