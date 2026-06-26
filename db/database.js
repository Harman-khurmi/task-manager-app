// const Database = require('better-sqlite3');
// const path = require('path');
// const fs = require('fs');

// const dbPath = path.join(__dirname, 'tasks.db');
// const db = new Database(dbPath);

// db.pragma('journal_mode = WAL');
// db.pragma('foreign_keys = ON');

// const schemaPath = path.join(__dirname, 'schema.sql');
// const schema = fs.readFileSync(schemaPath, 'utf8');
// db.exec(schema);

// module.exports = db;

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let db;

async function getDb() {
    if (db) return db;

    // Use /tmp directory in production (Vercel), local db folder in development
    const dbDir = process.env.NODE_ENV === 'production' ? '/tmp' : __dirname;
    const dbPath = path.join(dbDir, 'tasks.db');

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.run('PRAGMA journal_mode = WAL');
    await db.run('PRAGMA foreign_keys = ON');

    // Initialize schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.exec(schema);

    console.log(`✅ SQLite database connected at ${dbPath}`);
    return db;
}

module.exports = { getDb };