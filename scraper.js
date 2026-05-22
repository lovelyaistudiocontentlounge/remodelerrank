const axios = require('axios');
const config = require('./config');

async function searchOutscraper(query, limit = config.OUTSCRAPER_LIMIT) {
  const { data } = await axios.get(config.OUTSCRAPER_URL, {
    headers: { 'X-API-KEY': config.OUTSCRAPER_API_KEY },
    params: { query, limit, async: false, language: 'en', region: 'us' },
  });

  if (data.status !== 'Success') {
    throw new Error(`Outscraper error for "${query}": ${data.status}`);
  }

  return data.data[0] || [];
}

function normaliseRecord(raw) {
  return {
    place_id:        raw.place_id || '',
    name:            raw.name || '',
    address:         raw.address || '',
    city:            raw.city || '',
    phone:           raw.phone || '',
    website:         raw.website || '',
    email:           raw.email || '',
    owner_name:      '',  // populated by Apollo enrichment
    rating:          raw.rating || null,
    review_count:    raw.reviews || 0,
    business_status: raw.business_status || '',
    has_hours:       !!(raw.working_hours && Object.keys(raw.working_hours).length),
    types:           [raw.type, raw.subtypes].filter(Boolean).join(', '),
    description:     raw.description || '',
    photo_count:     raw.photos_count || 0,
  };
}

// Build a query string from a city+term combo
function buildQuery(city, term) {
  return `${term} ${city}`;
}

// Test a single query and print results to console
async function runTestQuery(query) {
  console.log(`\nQuery: "${query}"`);
  console.log('Fetching from Outscraper...');
  const raw = await searchOutscraper(query);
  console.log(`Got ${raw.length} results.\n`);
  const records = raw.map(normaliseRecord);
  for (const r of records) {
    console.log(`  ${r.name}`);
    console.log(`    City    : ${r.city}`);
    console.log(`    Phone   : ${r.phone || '(none)'}`);
    console.log(`    Website : ${r.website || '(none)'}`);
    console.log(`    Rating  : ${r.rating ?? 'N/A'} (${r.review_count} reviews)`);
    console.log(`    Place ID: ${r.place_id}`);
    console.log('');
  }
  console.log(`--- ${records.length} records returned ---\n`);
  return records;
}

if (require.main === module) {
  const query = process.argv[2] || buildQuery(config.SEARCH_CITIES[0], config.SEARCH_TERMS[0]);
  runTestQuery(query).catch(err => {
    console.error('Scraper error:', err.message);
    process.exit(1);
  });
}

module.exports = { searchOutscraper, normaliseRecord, buildQuery, runTestQuery };
