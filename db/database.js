const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let db;

async function getDb() {
    if (db) return db;

    db = await open({
        filename: path.join(__dirname, 'tasks.db'),
        driver: sqlite3.Database
    });

    await db.run('PRAGMA journal_mode = WAL');
    await db.run('PRAGMA foreign_keys = ON');

    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.exec(schema);

    console.log('✅ SQLite database connected');
    return db;
}

module.exports = { getDb };
