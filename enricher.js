const axios = require('axios');
const cheerio = require('cheerio');
const Anthropic = require('@anthropic-ai/sdk');
const config = require('./config');
const log = require('./logger');
const { scoringPrompt } = require('./prompts');

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

// ─── Website Analysis ─────────────────────────────────────────────────────────

const PLATFORM_SIGNATURES = {
  GoDaddy:     ['godaddy', 'secureserver', 'websites.godaddy'],
  Wix:         ['wix.com', 'wixstatic'],
  Squarespace: ['squarespace'],
  Weebly:      ['weebly'],
  WordPress:   ['wp-content', 'wp-includes', 'wordpress'],
};

function detectPlatform(html, websiteUrl) {
  const lower = (html + websiteUrl).toLowerCase();
  for (const [platform, sigs] of Object.entries(PLATFORM_SIGNATURES)) {
    if (sigs.some(s => lower.includes(s))) return platform;
  }
  return 'Custom/Unknown';
}

function extractFooterYear(html) {
  const match = html.match(/©\s*(20\d{2})/);
  return match ? parseInt(match[1], 10) : null;
}

async function analyseWebsite(url) {
  if (!url) return { website_platform: 'None', has_contact_form: false, footer_year: null, is_mobile_friendly: false, portfolio_buried: false, scraped_email: '' };

  try {
    const { data: html } = await axios.get(url, {
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RemodelerRankBot/1.0)' },
      maxRedirects: 5,
    });

    const $ = cheerio.load(html);
    const platform = detectPlatform(html, url);
    const hasViewport = $('meta[name="viewport"]').length > 0;
    const hasContactForm = $('form').length > 0 || html.toLowerCase().includes('contact');
    const footerYear = extractFooterYear(html);

    const portfolioKeywords = ['gallery', 'portfolio', 'projects', 'our work', 'photo'];
    const homepageText = $('body').text().toLowerCase();
    const homepageLinks = $('a').map((_, el) => $(el).attr('href') || '').get().join(' ').toLowerCase();
    const navLinks = $('nav a, header a').map((_, el) => $(el).text().toLowerCase()).get().join(' ');
    const hasPortfolioNav = portfolioKeywords.some(kw => navLinks.includes(kw));
    const hasPortfolioOnPage = portfolioKeywords.some(kw => homepageText.includes(kw));
    const hasPortfolioLink = portfolioKeywords.some(kw => homepageLinks.includes(kw));
    const portfolio_buried = (hasPortfolioOnPage || hasPortfolioLink) && !hasPortfolioNav;

    const skipPatterns = /noreply|no-reply|donotreply|unsubscribe|example\.com/i;
    const emails = $('a[href^="mailto:"]')
      .map((_, el) => $(el).attr('href').replace('mailto:', '').split('?')[0].trim().toLowerCase())
      .get()
      .filter(e => e.includes('@') && !skipPatterns.test(e));
    const scraped_email = emails[0] || '';

    return { website_platform: platform, is_mobile_friendly: hasViewport, has_contact_form: hasContactForm, footer_year: footerYear, portfolio_buried, scraped_email };
  } catch {
    return { website_platform: 'Unknown', has_contact_form: false, footer_year: null, is_mobile_friendly: false, portfolio_buried: false, scraped_email: '' };
  }
}

// ─── Apollo Enrichment ────────────────────────────────────────────────────────

async function enrichWithApollo(domain) {
  if (!domain || !config.APOLLO_API_KEY) return { owner_name: '', email: '' };

  try {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const res = await axios.post('https://api.apollo.io/v1/people/match', {
      domain: cleanDomain,
      reveal_personal_emails: false,
      reveal_phone_number: false,
    }, {
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': config.APOLLO_API_KEY },
      timeout: 8000,
    });

    const person = res.data?.person;
    return {
      owner_name: person?.name || '',
      email: person?.email || '',
    };
  } catch {
    return { owner_name: '', email: '' };
  }
}

// ─── GBP Scoring ─────────────────────────────────────────────────────────────

function scoreGBP(lead) {
  let score = 0;
  if (lead.phone)                               score++;
  if (lead.website)                             score++;
  if (lead.has_hours)                           score++;
  if (lead.rating)                              score++;
  if (lead.rating >= 4.0)                       score++;
  if (lead.review_count >= 10)                  score++;
  if (lead.review_count >= 50)                  score++;
  if (lead.photo_count > 0)                     score++;
  if (lead.business_status === 'OPERATIONAL')   score++;
  if (lead.description)                         score++;
  return score;
}

// ─── Findability Scoring ──────────────────────────────────────────────────────

async function scoreFindability(lead) {
  const checks = {
    gbp_claimed: false,
    gbp_complete: false,
    yelp_active: false,
    houzz_profile: false,
    bbb_accredited: false,
    buildzoom_active: false,
    facebook_page: false,
  };

  // GBP: place_id proves the listing exists on Google Maps — every Outscraper result has one.
  // rating > 0 was wrong: a new or unreviewed business still has a GBP.
  checks.gbp_claimed = !!(lead.place_id || lead.business_status === 'OPERATIONAL');
  checks.gbp_complete = (lead.review_count >= 5 && lead.has_hours && lead.photo_count > 0);

  // Lightweight checks via Google search presence (skip if too slow/rate-limited)
  // Search each platform and check if the business name appears in the HTML response.
  // Uses the first significant word of the name to handle slight variations.
  const keyword = lead.name.split(/\s+/).find(w => w.length > 3) || lead.name.split(/\s+/)[0];
  const nameFragment = keyword.toLowerCase();

  // Returns the search URL when the business is found on that platform, null otherwise.
  const checkPresence = async (url) => {
    try {
      const res = await axios.get(url, {
        timeout: 6000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        maxRedirects: 3,
        validateStatus: s => s < 500,
      });
      return res.data?.toLowerCase().includes(nameFragment) ? url : null;
    } catch { return null; }
  };

  const [yelp, houzz, bbb, buildzoom] = await Promise.allSettled([
    checkPresence(`https://www.yelp.com/search?find_desc=${encodeURIComponent(lead.name)}&find_loc=${encodeURIComponent(lead.city || 'CA')}`),
    checkPresence(`https://www.houzz.com/professionals/search?query=${encodeURIComponent(lead.name)}`),
    checkPresence(`https://www.bbb.org/search?find_country=USA&find_text=${encodeURIComponent(lead.name)}`),
    checkPresence(`https://www.buildzoom.com/search?q=${encodeURIComponent(lead.name)}`),
  ]);

  const yelpUrl      = yelp.status      === 'fulfilled' ? yelp.value      : null;
  const houzzUrl     = houzz.status     === 'fulfilled' ? houzz.value     : null;
  const bbbUrl       = bbb.status       === 'fulfilled' ? bbb.value       : null;
  const buildzoomUrl = buildzoom.status === 'fulfilled' ? buildzoom.value : null;

  checks.yelp_active      = !!yelpUrl;
  checks.houzz_profile    = !!houzzUrl;
  checks.bbb_accredited   = !!bbbUrl;
  checks.buildzoom_active = !!buildzoomUrl;

  const score =
    (checks.gbp_claimed   ? 3 : 0) +
    (checks.gbp_complete  ? 1 : 0) +
    (checks.yelp_active   ? 2 : 0) +
    (checks.houzz_profile ? 1 : 0) +
    (checks.bbb_accredited? 1 : 0) +
    (checks.buildzoom_active ? 1 : 0) +
    (checks.facebook_page ? 1 : 0);

  return {
    findability_score: Math.min(score, 10),
    findability_breakdown: checks,
    yelp_url:       yelpUrl      || '',
    houzz_url:      houzzUrl     || '',
    bbb_url:        bbbUrl       || '',
    buildzoom_url:  buildzoomUrl || '',
  };
}

// ─── CSLB License Check ───────────────────────────────────────────────────────

async function checkCSLB(businessName) {
  const searchUrl = 'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; RemodelerRankBot/1.0)',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const { data: pageHtml, headers: resHeaders } = await axios.get(searchUrl, { timeout: 10000, headers });
    const $page = cheerio.load(pageHtml);
    const viewState       = $page('input[name="__VIEWSTATE"]').attr('value') || '';
    const viewStateGen    = $page('input[name="__VIEWSTATEGENERATOR"]').attr('value') || '';
    const eventValidation = $page('input[name="__EVENTVALIDATION"]').attr('value') || '';
    const cookie          = resHeaders['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

    const params = new URLSearchParams({
      '__VIEWSTATE': viewState,
      '__VIEWSTATEGENERATOR': viewStateGen,
      '__EVENTVALIDATION': eventValidation,
      'ctl00$MainContent$NextName': businessName,
      'ctl00$MainContent$Contractor_Business_Name_Button': '',
    });

    const { data: resultHtml } = await axios.post(searchUrl, params.toString(), {
      timeout: 10000,
      headers: { ...headers, Cookie: cookie },
      maxRedirects: 5,
    });

    const $ = cheerio.load(resultHtml);
    const cellTexts = [];
    $('table td').each((_, el) => cellTexts.push($(el).text().trim().replace(/\s+/g, ' ')));

    const licenseIdx = cellTexts.findIndex(t => t === 'License');
    const statusIdx  = cellTexts.findIndex(t => t === 'Status');
    if (licenseIdx === -1) return { cslb_license: '', license_status: 'Not Found' };

    const licenseNum = cellTexts[licenseIdx + 1] || '';
    const status     = statusIdx !== -1 ? cellTexts[statusIdx + 1] : '';
    if (!licenseNum || !/^\d+$/.test(licenseNum)) return { cslb_license: '', license_status: 'Not Found' };

    return {
      cslb_license: licenseNum,
      license_status: status.toLowerCase().includes('active') ? 'Active' : status || 'Unknown',
    };
  } catch {
    return { cslb_license: '', license_status: 'Error' };
  }
}

// ─── Claude Scoring ───────────────────────────────────────────────────────────

async function scoreWithClaude(lead) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{ role: 'user', content: scoringPrompt(lead) }],
  });

  const text = message.content[0].text.trim();
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

// ─── Main enrichLead ──────────────────────────────────────────────────────────

async function enrichLead(lead) {
  const [websiteData, cslbData, apolloData, findabilityData] = await Promise.all([
    analyseWebsite(lead.website),
    checkCSLB(lead.name),
    enrichWithApollo(lead.website),
    scoreFindability(lead),
  ]);

  const gbp_score = scoreGBP(lead);

  const enriched = {
    ...lead,
    ...websiteData,
    gbp_score,
    ...cslbData,
    ...findabilityData,
    email:      lead.email || apolloData.email || websiteData.scraped_email || '',
    owner_name: apolloData.owner_name || '',
    email_found: !!(lead.email || apolloData.email || websiteData.scraped_email),
  };

  if (enriched.license_status === 'Expired' || enriched.license_status === 'Inactive') {
    return { ...enriched, lead_score: 0, priority: 'cold', score_reason: 'CSLB license expired or inactive. Do not contact.', best_hook: '' };
  }
  if (enriched.license_status === 'Not Found') {
    enriched.license_status = 'Unverified';
  }

  const claudeScore = await scoreWithClaude(enriched);

  const best_hook = enriched.portfolio_buried
    ? 'Your project photos are impressive, but they are buried where homeowners never find them.'
    : claudeScore.best_hook;

  return {
    ...enriched,
    lead_score:   claudeScore.score,
    priority:     claudeScore.priority,
    score_reason: claudeScore.score_reason,
    best_hook,
  };
}

// ─── Batch enrichment ─────────────────────────────────────────────────────────

async function enrichBatch(leads, concurrency = 5) {
  const results = [];
  for (let i = 0; i < leads.length; i += concurrency) {
    const chunk = leads.slice(i, i + concurrency);
    const settled = await Promise.allSettled(chunk.map(enrichLead));
    for (let j = 0; j < settled.length; j++) {
      if (settled[j].status === 'fulfilled') {
        results.push(settled[j].value);
      } else {
        log.error(`Enrichment failed for "${chunk[j].name}": ${settled[j].reason?.message}`);
        results.push(chunk[j]);
      }
    }
    log.info(`Enriched ${Math.min(i + concurrency, leads.length)}/${leads.length}`);
  }
  return results;
}

module.exports = { enrichLead, enrichBatch, analyseWebsite, scoreGBP, checkCSLB, enrichWithApollo, scoreFindability };
