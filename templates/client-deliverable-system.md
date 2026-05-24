# Client Deliverable System

Master checklist for onboarding, building, and launching a new client site.

**Critical rule:** All platform data (GBP, Yelp, Houzz, etc.) is copy-pasted from the verified data collection doc - never retyped from memory. NAP consistency is non-negotiable.

---

## Phase 1 - Data Collection

Complete and get client sign-off before writing a single line of code.

### 1.1 NAP (Name, Address, Phone)

These three fields must be identical everywhere: site, GBP, Yelp, Houzz, Apple Maps, Facebook, BuildZoom.

| Field | Verified Value |
|---|---|
| Legal business name | |
| DBA / trade name (if different) | |
| Street address | |
| City, State, ZIP | |
| Primary phone | |
| Secondary phone (if any) | |
| Website URL (final - not staging) | |

Get the client to confirm this in writing (email or the signed verification form).

### 1.2 CSLB License

| Field | Value |
|---|---|
| License number | |
| License type | |
| Expiration date | |
| Bond / insurance on file | |

Verify at cslb.ca.gov before publishing.

### 1.3 Services

List every service the client wants on the site. Get specifics - "kitchen remodeling" is not specific enough if they want ADU and room additions listed separately.

- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

### 1.4 Service Area

Cities and counties they serve. These go in the footer, the service area section, and the LocalBusiness schema.

Primary city: _______________
Counties: _______________
Additional cities: _______________

### 1.5 Business Details

| Field | Value |
|---|---|
| Year founded | |
| Number of projects completed | |
| Owner name | |
| Years of experience | |
| Specialties or notable projects | |
| Awards or certifications | |
| Hours | |

### 1.6 Brand Voice

Ask the client 3-5 questions before writing any copy:
1. "Describe your best client in one sentence."
2. "What do most remodeling contractors get wrong that you do differently?"
3. "What do clients always compliment you on?"
4. "What projects are you most proud of?"
5. "What is the one thing you never want said about your company?"

Record the answers verbatim. Use their words when writing headlines and intro copy.

### 1.7 Assets Collected

- [ ] Logo file (SVG preferred, PNG acceptable) - saved to /clients/[slug]/logo.png
- [ ] Project photos (minimum 10, ideally 20+) - saved to /clients/[slug]/photos/
- [ ] Team / owner photo (optional but recommended)
- [ ] Before/after photo sets (optional)
- [ ] Any existing reviews they want featured
- [ ] Google Analytics property ID (if they have one)

### 1.8 Login Credentials (store in 1Password, never in this doc or the repo)

- [ ] Domain registrar login given to Jennifer or transfer completed
- [ ] GBP owner access granted to hey@remodelerrank.com
- [ ] Yelp business account login or invitation sent

**Sign-off:** Client confirms all data above is accurate: _________________ Date: _________

---

## Phase 2 - Build + Approval

### 2.1 Pre-Build

- [ ] Slug confirmed: `[city]-[name]` pattern (e.g., `walnut-creek-elite-remodeling`)
- [ ] Folder created: /clients/[slug]/
- [ ] Photos renamed and converted to WebP (see photo-pipeline/SKILL.md)
- [ ] Brand voice doc reviewed before writing any copy

### 2.2 Site Build Checklist

- [ ] Mini-site mockup built (see mini-site/SKILL.md)
- [ ] Client reviews mockup - collect feedback
- [ ] Full site built from approved mockup
- [ ] All copy written using client's brand voice
- [ ] All photos placed with correct filenames (see photo-filename-protection/SKILL.md)
- [ ] LocalBusiness schema added to homepage
- [ ] Meta titles and descriptions written for all pages
- [ ] Contact form or Calendly integration working
- [ ] Mobile tested on iPhone and Android
- [ ] Staging link sent to client for approval

### 2.3 Client Approval

- [ ] Client approves content in writing (email confirmation)
- [ ] Any revision requests addressed and re-confirmed
- [ ] Final approval received before DNS switch

---

## Phase 3 - Launch + Platform Buildout

Complete all items within 48 hours of DNS switch.

### 3.1 DNS Launch

- [ ] Pre-launch checklist complete (see pre-launch/SKILL.md)
- [ ] DNS pointed to Netlify (or hosting provider)
- [ ] SSL confirmed live
- [ ] All redirects working

### 3.2 Google Business Profile

All fields below copy-pasted from the Phase 1 data collection doc.

- [ ] Business name set (exact match to verified NAP)
- [ ] Address set (exact match)
- [ ] Phone set (exact match)
- [ ] Website set to final URL
- [ ] Category set (primary: "General Contractor" or "Remodeling Contractor")
- [ ] Secondary categories added
- [ ] Business description written (750 chars max, keyword-rich, no links)
- [ ] Hours set
- [ ] Services added with descriptions
- [ ] Photos uploaded: logo, exterior, project photos (minimum 10)
- [ ] First post published (opening announcement or project feature)

### 3.3 Yelp

- [ ] Claim or create Yelp listing
- [ ] Business name, address, phone set (exact NAP match)
- [ ] Website set
- [ ] Categories set
- [ ] Description added
- [ ] Photos uploaded (minimum 5)
- [ ] Hours set

### 3.4 Houzz

- [ ] Create or claim Houzz Pro profile
- [ ] Business name, address, phone (exact NAP match)
- [ ] Website set
- [ ] Services and specialties selected
- [ ] Project photos uploaded with descriptions
- [ ] License number added

### 3.5 Apple Maps (via Apple Business Connect)

- [ ] Claim listing at businessconnect.apple.com
- [ ] Business name, address, phone (exact NAP match)
- [ ] Website set
- [ ] Hours set
- [ ] Logo/photo uploaded

### 3.6 BuildZoom

- [ ] Claim contractor profile at buildzoom.com
- [ ] CSLB license number entered
- [ ] Business info verified (exact NAP match)
- [ ] Website set

### 3.7 Facebook Business Page (if applicable)

- [ ] Page created or claimed
- [ ] Business name (exact match)
- [ ] Address, phone, website
- [ ] Category: "Home improvement contractor" or similar
- [ ] About section written
- [ ] Logo and cover photo uploaded
- [ ] First post published

### 3.8 Instagram (if applicable)

- [ ] Business profile created or converted
- [ ] Bio written (150 chars max, includes city and phone)
- [ ] Website link set
- [ ] First 3-6 posts published (project photos)
- [ ] Connected to Facebook page

### 3.9 Google Search Console + Analytics

- [ ] Search Console property verified
- [ ] Sitemap submitted
- [ ] GA4 data flowing (confirm via Realtime view)

### 3.10 Post-Launch Client Handoff

- [ ] Send client the launch confirmation email
- [ ] Include: site URL, GBP link, Yelp link, how to add photos, how to request a review
- [ ] First monthly report scheduled (sends on the 1st)
- [ ] 30-day check-in call booked

---

## Tier Reference

| Tier | Build | Monthly | Platform Buildout |
|---|---|---|---|
| Launch | $2,500 | $0 | GBP + all listings |
| Presence | $2,500 | $497 | GBP + all listings |
| Active | $2,500 | $897 | GBP + all listings + monthly content |
| Growth | $2,500 | $1,497 | GBP + all listings + full content + ads |
