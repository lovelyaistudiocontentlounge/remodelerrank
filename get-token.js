// One-time script to get your Google OAuth refresh token.
// Run: node get-token.js — it opens a browser tab and catches the redirect automatically.

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
require('dotenv').config();

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}`;

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/drive.file',
];

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  REDIRECT_URI,
);

const authUrl = auth.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('\n--- Google OAuth Setup ---\n');
console.log('Opening your browser now...');
console.log('If it does not open, paste this URL manually:\n');
console.log(authUrl);
console.log('\nSign in as hey@remodelerrank.com and click Allow.\n');

// Try to open the browser automatically
const { exec } = require('child_process');
exec(`open "${authUrl}"`);

// Spin up a one-shot local server to catch the redirect
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const code = parsed.query.code;

  if (!code) {
    res.end('No code received. Try again.');
    return;
  }

  res.end('<h2>Success! You can close this tab and check your terminal.</h2>');
  server.close();

  try {
    const { tokens } = await auth.getToken(code);
    console.log('\n--- Copy these into your .env file ---\n');
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('\nDone! You can delete get-token.js after this.\n');
  } catch (err) {
    console.error('\nError exchanging code:', err.message);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`Waiting for Google to redirect to http://localhost:${PORT} ...`);
});
