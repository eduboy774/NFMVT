// src/database/db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'nfmvt.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the nfmvt SQLite database.');
});

// Export the database connection and utility functions
module.exports = {
  db,
  saveTsharkOutputToDatabase, // To be implemented
};
