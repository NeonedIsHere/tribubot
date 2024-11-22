const fs = require('fs');
const path = require('path');
const { Database } = require('sqlite3');

const databaseDir = path.join(__dirname, '../database');
const dbPath = path.join(databaseDir, 'db.sqlite');

if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
    console.log('Dossier de la base de données créé.');
}

module.exports = (client) => {
    return new Promise((resolve, reject) => {
        const db = new Database(dbPath, (err) => {
            if (err) {
                client.error('Erreur lors de la connexion à la base de données :', err.message);
                reject(err);
            } else {
                client.data('Connecté à la base de données SQLite');

                db.run(
                    `CREATE TABLE IF NOT EXISTS channel (
                        guildId TEXT NOT NULL UNIQUE,
                        channelId TEXT NOT NULL,
                        date TEXT DEFAULT (datetime('now')),
                        owner TEXT NOT NULL
                    )`,
                    (err) => {
                        if (err) {
                            client.error('Erreur lors de la création de la table cronus :', err.message);
                        } else {
                            client.data('Table "channel" créée avec succès.');
                        }
                    }
                );

                db.run(
                    `CREATE TABLE IF NOT EXISTS role (
                        guildId TEXT NOT NULL,
                        roleId TEXT NOT NULL,
                        date TEXT DEFAULT (datetime('now')),
                        owner TEXT NOT NULL
                    )`,
                    (err) => {
                        if (err) {
                            client.error('Erreur lors de la création de la table cheat :', err.message);
                        } else {
                            client.data('Table "role" créée avec succès.');
                        }
                    }
                );

                db.run(
                    `CREATE TABLE IF NOT EXISTS trackedRole (
                        guildId TEXT NOT NULL,
                        roleId TEXT NOT NULL,
                        baseName TEXT NOT NULL,
                        maxCount INTEGER NOT NULL,
                        date TEXT DEFAULT (datetime('now')),
                        owner TEXT NOT NULL
                    )`,
                    (err) => {
                        if (err) {
                            client.error('Erreur lors de la création de la table trackedRole :', err.message);
                        } else {
                            client.data('Table "trackedRole" créée avec succès.');
                        }
                    } 
                )

                db.run(
                    `CREATE TABLE IF NOT EXISTS embedColor (
                        guildId TEXT NOT NULL,
                        color TEXT NOT NULL,
                        date TEXT DEFAULT (datetime('now')),
                        owner TEXT NOT NULL
                    )`,
                    (err) => {
                        if (err) {
                            client.error('Erreur lors de la création de la table embedColor :', err.message);
                        } else {
                            client.data('Table "embedColor" créée avec succès.');
                        }
                    }
                )

                resolve(db);
            }
        });

        db.on('close', () => {
            client.info('Connexion à la base de données fermée.');
        });

        if (client) {
            client.database = db;
        }
    });
};
