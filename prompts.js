// All Claude prompts live here. Edit copy here, not inline in enricher.js.

function scoringPrompt(leadData) {
  return `You are scoring a remodeling contractor as a sales lead for RemodelerRank, a marketing agency serving East Bay and Solano County remodelers.

Score this lead 1-10 based on how likely they need and can afford marketing services. Higher = better lead.

Scoring criteria:
- No website: +3 points
- Bad website platform (GoDaddy/Wix/Weebly/Squarespace): +2 points
- Low review count (<20 reviews): +2 points
- Low GBP completeness (<6/10): +2 points
- In prime cities (Dublin, San Ramon, Danville, Walnut Creek, Pleasanton): +2 points
- Licensed and active: required -- score 0 if unlicensed or inactive
- Rating between 3.5-4.5 (room to improve but not failing): +1 point

Score honestly. A WordPress site with real project photos, BBB accreditation, and an active license is a C+ (score 5-6), not a D. Reserve scores of 1-3 for contractors with zero reviews, no website, or no license. The score should reflect real gaps, not manufactured urgency.

Never use emoji in any field. This is a high-end professional product.

Lead data:
${JSON.stringify(leadData, null, 2)}

Respond with JSON only -- no markdown, no explanation:
{
  "score": 8,
  "score_reason": "One sentence explaining the score",
  "priority": "hot",
  "best_hook": "One specific observation to use in outreach -- reference something real about their business"
}

priority must be exactly: hot, warm, or cold`;
}

function reportPrompt(leadData) {
  return `Generate a brief website audit report for a remodeling contractor.
This will be sent to them as a free value-add before a sales call.

Format: Plain text, 3 sections, conversational not corporate.

Sections:
1. What we found (2-3 specific observations about their web presence)
2. What it's costing them (1-2 sentences on the business impact)
3. What good looks like (2-3 specific recommendations)

Tone: Peer, not salesperson. Direct. Specific to their business.
Do not mention RemodelerRank by name in the report body.
Do not use em dashes. Use plain hyphens or rewrite.

Lead data:
${JSON.stringify(leadData, null, 2)}`;
}

// ─── Static email templates ────────────────────────────────────────────────────

function firstNameFrom(ownerName) {
  if (ownerName && ownerName.trim()) return ownerName.trim().split(' ')[0];
  return 'there';
}

function emailD0(lead, auditUrl) {
  const firstName = firstNameFrom(lead.owner_name);
  const hook = lead.best_hook || `${lead.name} has some gaps in its web presence worth addressing.`;
  const reportLine = auditUrl
    ? `\nHere is the report when you are ready: ${auditUrl}\n`
    : '';

  return {
    subject: `${lead.name} - quick question`,
    body: `Hi ${firstName},

Do you have capacity for a kitchen remodel right now, or are you booked out?

I ask because I put together a quick audit of ${lead.name}'s web presence and found something worth sharing. ${hook}

I put together a free report showing exactly what I found and what I'd fix. Worth a look?
${reportLine}
Jennifer
RemodelerRank
925-940-9484
Book a call: ${config().CALENDLY_URL}`,
  };
}

function emailD3(lead) {
  const firstName = firstNameFrom(lead.owner_name);
  return {
    subject: `Re: ${lead.name} - quick question`,
    body: `Hi ${firstName},

Just bumping this up in case it got buried.

The report is ready whenever you want it. Takes about 3 minutes to read and shows exactly where ${lead.name} is losing homeowners before they ever call.

Jennifer
925-940-9484
Book a call: ${config().CALENDLY_URL}`,
  };
}

function emailD7(lead) {
  const firstName = firstNameFrom(lead.owner_name);
  return {
    subject: `Re: ${lead.name} - quick question`,
    body: `Hi ${firstName},

Last follow up from me.

I work with a small number of East Bay remodelers at a time and wanted to give ${lead.name} first look before I move on. If timing is not right, no hard feelings at all.

If it ever makes sense to talk, you know where to find me.

Jennifer
RemodelerRank
925-940-9484
Book a call: ${config().CALENDLY_URL}`,
  };
}

function emailGeneric(lead) {
  const firstName = firstNameFrom(lead.owner_name);
  return {
    subject: `${lead.name} - quick question`,
    body: `Hi ${firstName},

Do you have capacity for new projects right now, or are you booked out?

I work with remodeling contractors in the East Bay on their web presence and online lead generation. Wanted to reach out directly.

Worth a quick call?

Jennifer
RemodelerRank
925-940-9484
Book a call: ${config().CALENDLY_URL}`,
  };
}

// Lazy-load config to avoid circular dep issues
function config() { return require('./config'); }

module.exports = { scoringPrompt, reportPrompt, emailD0, emailD3, emailD7, emailGeneric };
