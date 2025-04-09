const bcrypt = require('bcryptjs');
const db = require('../db');

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

class User {
    static async createUser(username, password, role = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, role],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static async findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static async createDefaultAdminIfNotExists() {
        try {
            const adminUser = await this.findByUsername('admin');
            if (!adminUser) {
                await this.createUser('admin', 'admin', 'admin');
                console.log('Default admin account created successfully');
            }
        } catch (error) {
            console.error('Error creating default admin account:', error);
        }
    }
}

// Create default admin account when the module is loaded
User.createDefaultAdminIfNotExists();

module.exports = User; 