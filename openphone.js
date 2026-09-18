const https = require('https');
const config = require('./config');
const log = require('./logger');

// OpenPhone REST API v3 - sends SMS/MMS via a virtual number.
// Texts are NEVER sent automatically. Jennifer triggers them manually
// via the morning app (/api/send-text) after reviewing the draft text.

const BASE_URL = 'https://api.openphone.com/v1';

function normalisePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  return null;
}

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.openphone.com',
      path: `/v1${path}`,
      method,
      headers: {
        'Authorization': config.OPENPHONE_API_KEY,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`OpenPhone API ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch {
          reject(new Error(`OpenPhone non-JSON response (${res.statusCode}): ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function sendText(toPhone, body) {
  if (!config.OPENPHONE_API_KEY) throw new Error('OPENPHONE_API_KEY not set in .env');
  if (!config.OPENPHONE_NUMBER_ID) throw new Error('OPENPHONE_NUMBER_ID not set in .env');

  const to = normalisePhone(toPhone);
  if (!to) throw new Error(`Cannot normalise phone number: ${toPhone}`);

  log.info(`Sending text to ${to} via OpenPhone`);

  const result = await apiRequest('POST', '/messages', {
    from: config.OPENPHONE_NUMBER_ID,
    to: [to],
    content: body,
  });

  log.done(`Text sent to ${to} - message id: ${result.data?.id || 'unknown'}`);
  return result;
}

// ─── Text templates ───────────────────────────────────────────────────────────

function firstName(lead) {
  return lead.owner_name && lead.owner_name.trim()
    ? lead.owner_name.trim().split(' ')[0]
    : 'there';
}

function textD0(lead) {
  const name = firstName(lead);
  return `Hi ${name}, this is Jennifer from RemodelerRank. I sent you an email about ${lead.name} - just wanted to make sure it landed. Worth a quick look?`;
}

function textD4(lead) {
  const name = firstName(lead);
  return `Hi ${name}, Jennifer again. I have a free report ready for ${lead.name} whenever you want it. Happy to walk through it on a quick call - calendly.com/hey-remodelerrank/review-meeting-15-minutes`;
}

module.exports = { sendText, textD0, textD4, normalisePhone };
