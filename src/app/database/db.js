// Establish Database Connection so as to be used in another file
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

async function getDb() {
  if (!db) {
    db = await open({
      filename: "./nfmvtDatabaseNew.sqlite",
      driver: sqlite3.Database,
    });
  }

  return db;
}

export default getDb;

