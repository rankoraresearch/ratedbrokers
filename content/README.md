# Broker Content Files

This directory contains the **source of truth** for all broker data on RatedBrokers.

## Structure

```
content/
  brokers/
    ic-markets.md      ← One file per broker
    pepperstone.md
    xm.md
    ...
  _template.md         ← Template for adding a new broker
  README.md            ← This file
```

## File Format

Each `.md` file has two parts:

1. **YAML frontmatter** (between `---` markers) — all structured data:
   - Basic info (name, score, type, spread, etc.)
   - Regulations, platforms, accounts
   - Scoring breakdown (6 categories, weights must sum to 100)
   - Spread comparison, deposits, timeline
   - Pros, cons, FAQ
   - Author info, similar brokers
   - `status`: `active`, `suspended`, or `under-review`
   - `last_verified`: date of last data check

2. **Markdown body** — long-form review text organized by `## Heading` sections:
   - Overview, Scoring, Regulation, Costs, Spreads, Deposits
   - Platforms, Mobile, Support, Education, Trustpilot, Country, Verdict

## How to Add a New Broker

1. Copy `_template.md` to `brokers/your-broker-slug.md`
2. Set `slug:` to match the filename (without `.md`)
3. Fill in all YAML fields
4. Write the Markdown content sections
5. Run `npm run brokers:validate` to check for errors
6. Run `npm run brokers:build` to generate JS files

## How to Edit an Existing Broker

1. Open `brokers/<slug>.md`
2. Edit YAML fields or Markdown content
3. Update `last_verified` date
4. Run `npm run brokers:validate`

## Validation Rules

The validator checks:
- All required fields are present (name, slug, score, type, spread, min_deposit, regulations, platforms)
- Score is between 0 and 10
- min_deposit is >= 0
- Regulation tiers are 1, 2, or 3
- Score weights sum to 100
- Spread values count matches spread_competitors count
- Similar broker slugs reference existing files
- Required content sections exist (Overview, Scoring, Verdict)

## Build Pipeline

```
npm run brokers:validate  → Validate all MD files
npm run brokers:build     → Validate + generate JS files
npm run dev               → Build brokers + start dev server
npm run build             → Build brokers + production build
```

**Important:** The generated JS files in `src/data/brokers/` are in `.gitignore`.
Never edit them directly — always edit the MD files.
