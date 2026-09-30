# Portfolio Case Study Schema

Source: contractor-portfolio-lookbook-master-brief.md. This is the PUBLIC-facing
record - only fields with real, approved content get filled. Never fabricate a
testimonial or metric; leave the field out entirely rather than writing a
placeholder that could get mistaken for real.

One file per client at `clients/<slug>/portfolio-case-study/case-study.json`. This
is the single source the public portfolio site, the lookbook, and the iPad
presentation all render from - fill it once, render it three ways.

```json
{
  "project_id": "",
  "company_name": "",
  "location": "",
  "industry": "",
  "year": "",
  "relationship_type": "client | prospect",
  "paid_or_spec": "paid | spec",
  "live_or_concept": "live | concept",

  "business_summary": "",
  "business_problem": "",
  "audit_findings": "",
  "strategy": "",
  "services": [],
  "result": "",

  "brand_dna": "clients/<slug>/brand-dna/brand-dna.md",
  "design_territory": "clients/<slug>/design-territories/chosen-territory.md",
  "signature_visual": "",

  "before_assets": [],
  "after_assets": [],
  "photography": [],
  "mobile_assets": [],
  "social_assets": [],
  "google_assets": [],
  "detail_assets": [],

  "campaign_headline": "",
  "supporting_copy": "",
  "project_labels": [],

  "testimonial": "",
  "metrics": {},
  "permissions": "",
  "live_url": ""
}
```

## Field-to-existing-asset map

Do not re-collect what the pipeline already has. Pull from:

| Schema field | Existing source (when the client already went through the pipeline) |
|---|---|
| business_summary, audit_findings | `clients/<slug>/website/DISCOVERY.md`, `clients/<slug>/website/SITE-AUDIT.md`, or the new `audit/audit-dossier.md` |
| before_assets | `clients/<slug>/before.png`, `clients/<slug>/photos/raw/` |
| after_assets | `clients/<slug>/after.png`, `clients/<slug>/photos/final/` |
| photography | `clients/<slug>/photos/final/portfolio/`, ranked via `photos/review/grades.json` |
| result / metrics | `clients/<slug>/reports/*-monthly-report.html` - real numbers only, never invented. If no post-launch data exists yet, `result` must say "proposed" / "concept" / "expected improvement", never a number. |
| live_url | the deployed client site, if launched |
| testimonial | only if the client has actually given one, in writing, with permission to publish - `permissions` field must confirm this before `testimonial` is used anywhere public |

## Rendering surfaces

One `case-study.json` feeds three outputs, once each field is approved:

1. **Public portfolio site** (website repo) - the case-study page + homepage grid entry.
2. **Physical lookbook** - the 2-4 page spread (Page A/B/C/D structure per the brief).
3. **iPad presentation** - the swipeable before/after view for in-person selling.

Internal-only fields never cross into the public renderer: `audit_findings` detail,
raw `strategy` notes, and anything still in `clients/<slug>/audit/` or
`clients/<slug>/design-territories/` before a territory is selected and approved
stays internal. Only promote content into `case-study.json` once it is meant to be
public - this is the deliberate INTERNAL vs PUBLIC line the brief calls for.
