require('dotenv').config();

module.exports = {
  // Agency
  AGENCY_NAME:    'RemodelerRank',
  AGENCY_EMAIL:   'hey@remodelerrank.com',
  AGENCY_PHONE:   '9259409484',
  AGENCY_SITE:    'remodelerrank.com',
  CALENDLY_URL:   process.env.CALENDLY_URL || 'https://calendly.com/hey-remodelerrank/review-meeting-15-minutes',

  // Anthropic
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,

  // Outscraper
  OUTSCRAPER_API_KEY: process.env.OUTSCRAPER_API_KEY,
  OUTSCRAPER_URL:     'https://api.app.outscraper.com/maps/search-v3',
  OUTSCRAPER_LIMIT:   30,
  QUERIES_PER_NIGHT:  parseInt(process.env.QUERIES_PER_NIGHT || '20', 10),
  LEADS_PER_NIGHT:    parseInt(process.env.LEADS_PER_NIGHT   || '120', 10),

  // Apollo
  APOLLO_API_KEY: process.env.APOLLO_API_KEY,

  // Google
  GOOGLE_SHEETS_ID:          process.env.GOOGLE_SHEETS_ID,
  GOOGLE_OAUTH_CLIENT_ID:    process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET:process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REFRESH_TOKEN:process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  SHEET_TAB_NAME:            process.env.SHEET_TAB_NAME || 'Leads',
  REPORTS_DRIVE_FOLDER_ID: (() => {
    const raw = process.env.REPORTS_DRIVE_FOLDER_ID || '';
    const match = raw.match(/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : raw;
  })(),

  // Gmail
  GMAIL_FROM: process.env.GMAIL_FROM || 'hey@remodelerrank.com',

  // OpenPhone
  OPENPHONE_API_KEY: process.env.OPENPHONE_API_KEY,
  JENNIFER_PHONE:    process.env.JENNIFER_PHONE || '9259409484',

  // App
  PORT: parseInt(process.env.PORT || '3000', 10),

  // 57-city target geography
  SEARCH_CITIES: [
    // Contra Costa County
    'Walnut Creek CA', 'Concord CA', 'Pleasant Hill CA', 'Lafayette CA',
    'Orinda CA', 'Moraga CA', 'Alamo CA', 'Danville CA', 'San Ramon CA',
    'Dublin CA', 'Pleasanton CA', 'Livermore CA', 'Brentwood CA',
    'Antioch CA', 'Pittsburg CA', 'Martinez CA', 'Clayton CA',
    'Hercules CA', 'Pinole CA', 'El Cerrito CA',
    // Alameda County
    'Fremont CA', 'Newark CA', 'Union City CA', 'Hayward CA',
    'Castro Valley CA', 'San Leandro CA', 'Oakland CA', 'Berkeley CA',
    'Alameda CA', 'Emeryville CA',
    // Solano County
    'Vacaville CA', 'Fairfield CA', 'Vallejo CA', 'Benicia CA',
    'Dixon CA', 'Suisun City CA', 'Rio Vista CA',
    // Marin County
    'San Rafael CA', 'Novato CA', 'Mill Valley CA', 'Corte Madera CA',
    'Larkspur CA', 'Tiburon CA', 'Sausalito CA',
    // Yolo County
    'Davis CA', 'Woodland CA', 'West Sacramento CA',
    // Santa Clara (northern)
    'Milpitas CA', 'Santa Clara CA', 'Sunnyvale CA', 'Mountain View CA',
    // San Mateo (northern)
    'San Mateo CA', 'Redwood City CA', 'San Carlos CA', 'Belmont CA',
    'Foster City CA', 'Burlingame CA',
  ],

  // 16 search terms - combined with cities to form queries
  SEARCH_TERMS: [
    'kitchen remodeling contractor',
    'bathroom remodeling contractor',
    'home remodeling contractor',
    'general contractor remodeling',
    'kitchen and bath contractor',
    'home renovation contractor',
    'ADU contractor',
    'room addition contractor',
    'whole home remodel',
    'kitchen renovation company',
    'bathroom renovation company',
    'residential remodeling contractor',
    'home improvement contractor',
    'design build contractor',
    'custom home remodeling',
    'licensed remodeling contractor',
  ],
};
