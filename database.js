const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'leads.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS seen_places (
        place_id TEXT PRIMARY KEY,
        name     TEXT,
        added_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS ran_queries (
        city TEXT NOT NULL,
        term TEXT NOT NULL,
        ran_at TEXT DEFAULT (datetime('now')),
        PRIMARY KEY (city, term)
      );
    `);
  }
  return db;
}

// Pick up to `count` city+term combos that have never been run before.
// Falls back to oldest-run combos once all have been covered (full cycle reset).
function pickCombinations(cities, terms, count) {
  const db = getDb();
  const ran = new Set(
    db.prepare("SELECT city || '|' || term AS key FROM ran_queries").all().map(r => r.key)
  );

  const all = [];
  for (const city of cities) {
    for (const term of terms) {
      all.push({ city, term });
    }
  }

  const unseen = all.filter(c => !ran.has(`${c.city}|${c.term}`));

  // If we've covered everything, reset and start a new cycle
  if (unseen.length === 0) {
    db.exec('DELETE FROM ran_queries');
    return all.sort(() => Math.random() - 0.5).slice(0, count);
  }

  return unseen.sort(() => Math.random() - 0.5).slice(0, count);
}

function markQueryRan(city, term) {
  getDb()
    .prepare('INSERT OR REPLACE INTO ran_queries (city, term) VALUES (?, ?)')
    .run(city, term);
}

// Returns true if place_id is new (not yet seen), false if duplicate
function isNew(place_id) {
  const row = getDb().prepare('SELECT 1 FROM seen_places WHERE place_id = ?').get(place_id);
  return !row;
}

// Mark a place_id as seen. Call after successfully writing to sheet.
function markSeen(place_id, name = '') {
  getDb()
    .prepare('INSERT OR IGNORE INTO seen_places (place_id, name) VALUES (?, ?)')
    .run(place_id, name);
}

// Filter an array of normalised records to only unseen ones
function filterNew(records) {
  return records.filter(r => r.place_id && isNew(r.place_id));
}

// One-off cleanup: remove place_ids that no longer appear in the sheet
function purgeIds(idsToKeep) {
  const db = getDb();
  const tx = db.transaction((ids) => {
    db.exec('DELETE FROM seen_places');
    const insert = db.prepare('INSERT OR IGNORE INTO seen_places (place_id) VALUES (?)');
    for (const id of ids) insert.run(id);
  });
  tx(idsToKeep);
}

function close() {
  if (db) { db.close(); db = null; }
}

module.exports = { isNew, markSeen, filterNew, purgeIds, close, pickCombinations, markQueryRan };
