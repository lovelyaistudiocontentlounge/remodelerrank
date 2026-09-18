const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'logs', 'pipeline.log');
const MAX_BYTES = 5 * 1024 * 1024; // rotate at 5MB

function rotateIfNeeded() {
  try {
    const stat = fs.statSync(LOG_FILE);
    if (stat.size > MAX_BYTES) {
      fs.renameSync(LOG_FILE, LOG_FILE.replace('.log', '.old.log'));
    }
  } catch {
    // file doesn't exist yet - fine
  }
}

function write(level, message) {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level}] ${message}\n`;
  process.stdout.write(line);
  try {
    rotateIfNeeded();
    fs.appendFileSync(LOG_FILE, line);
  } catch {
    // never let logging crash the pipeline
  }
}

const log = {
  info:  msg => write('INFO ', msg),
  warn:  msg => write('WARN ', msg),
  error: msg => write('ERROR', msg),
  done:  msg => write('DONE ', msg),
};

module.exports = log;
