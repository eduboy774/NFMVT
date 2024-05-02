import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  const db = await open({
    filename: './my_database.db',
    driver: sqlite3.Database,
  });

  await db.run(`CREATE TABLE IF NOT EXISTS ipv4hosts (
                id INTEGER PRIMARY KEY,
                host TEXT NOT NULL
              );`);

  const stmt = await db.prepare("INSERT INTO ipv4hosts (host) VALUES (?)");
  const ipv4hosts = req.body.ipv4hosts;
  for (let i = 0; i < ipv4hosts.length; i++) {
    await stmt.run(ipv4hosts[i]);
  }
  await stmt.finalize();

  const rows = await db.all("SELECT rowid AS id, host FROM ipv4hosts");
  res.status(200).json(rows);
}
