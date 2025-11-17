import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = path.join((globalThis.process && globalThis.process.cwd && globalThis.process.cwd()) || '.', 'server', 'data');
const dbPath = path.join(dataDir, 'tracking.db');
let db;

export function initDb() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(dbPath, { verbose: undefined });
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS tracking (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      status TEXT NOT NULL,
      meta TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_tracking_email ON tracking(email);
    CREATE INDEX IF NOT EXISTS idx_tracking_created ON tracking(created_at);
    CREATE INDEX IF NOT EXISTS idx_tracking_status ON tracking(status);
  `);
}

function ensure() {
  if (!db) throw new Error('DB not initialized');
}

export function insertTracking({ id, email, status, meta }) {
  ensure();
  const now = Date.now();
  const recordId = id && String(id).trim() ? String(id) : cryptoRandomId();
  const stmt = db.prepare('INSERT INTO tracking (id, email, created_at, status, meta) VALUES (?, ?, ?, ?, ?)');
  stmt.run(recordId, String(email).trim(), now, String(status || 'created').trim(), meta ? JSON.stringify(meta) : null);
  return recordId;
}

export function updateStatus(id, status) {
  ensure();
  const stmt = db.prepare('UPDATE tracking SET status = ? WHERE id = ?');
  const info = stmt.run(String(status).trim(), String(id).trim());
  return info.changes > 0;
}

export function getByEmail(email) {
  ensure();
  const stmt = db.prepare('SELECT id, email, created_at, status, meta FROM tracking WHERE email = ? ORDER BY created_at DESC');
  return stmt.all(String(email).trim());
}

export function getById(id) {
  ensure();
  const stmt = db.prepare('SELECT id, email, created_at, status, meta FROM tracking WHERE id = ?');
  return stmt.get(String(id).trim());
}

export function reportAggregates({ from, to } = {}) {
  ensure();
  const params = [];
  let where = '';
  if (typeof from === 'number') { where += (where ? ' AND ' : ' WHERE ') + 'created_at >= ?'; params.push(from); }
  if (typeof to === 'number') { where += (where ? ' AND ' : ' WHERE ') + 'created_at <= ?'; params.push(to); }
  const totalStmt = db.prepare(`SELECT COUNT(*) as total FROM tracking${where}`);
  const byStatusStmt = db.prepare(`SELECT status, COUNT(*) as cnt FROM tracking${where} GROUP BY status ORDER BY cnt DESC`);
  const byDayStmt = db.prepare(`
    SELECT date(datetime(created_at/1000, 'unixepoch')) AS day, COUNT(*) as cnt
    FROM tracking${where}
    GROUP BY day
    ORDER BY day DESC
  `);
  const total = totalStmt.get(...params)?.total || 0;
  const byStatus = byStatusStmt.all(...params);
  const byDay = byDayStmt.all(...params);
  return { total, byStatus, byDay };
}

function cryptoRandomId() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 24; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export default {
  initDb,
  insertTracking,
  updateStatus,
  getByEmail,
  getById,
  reportAggregates,
};