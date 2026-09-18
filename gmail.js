const { google } = require('googleapis');
const config = require('./config');
const { emailD0, emailGeneric } = require('./prompts');

function getAuth() {
  const auth = new google.auth.OAuth2(
    config.GOOGLE_OAUTH_CLIENT_ID,
    config.GOOGLE_OAUTH_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: config.GOOGLE_OAUTH_REFRESH_TOKEN });
  return auth;
}

function encodeMessage(raw) {
  return Buffer.from(raw).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function buildPlainEmail({ to, subject, body }) {
  const lines = [
    `From: ${config.GMAIL_FROM}`,
    `To: ${to || ''}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body,
  ];
  return lines.join('\r\n');
}

// Score tiers:
//   8-10 (HOT)    - report generated; draft includes Drive link + Calendly
//   6-7  (WARM)   - report generated; draft includes Drive link + Calendly
//   4-5  (MEDIUM) - generic draft only; no report
//   <4           - nothing; caller should skip
async function createDraft(lead, driveLink) {
  const score = Number(lead.lead_score) || 0;
  if (score < 4) return null;

  const gmail = google.gmail({ version: 'v1', auth: getAuth() });

  const emailData = score >= 6
    ? emailD0(lead, driveLink)
    : emailGeneric(lead);

  const raw = buildPlainEmail({
    to: lead.email || '',
    subject: emailData.subject,
    body: emailData.body,
  });

  const res = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: { message: { raw: encodeMessage(raw) } },
  });

  return { draftId: res.data.id, subject: emailData.subject, body: emailData.body };
}

module.exports = { createDraft };
