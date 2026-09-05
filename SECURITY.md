# Security & Privacy Notes

This repository is a portfolio showcase, not the production Berlin planner.

## Publication principles

The public showcase should contain product-relevant material only.

It must not contain:

- `.env` files
- Supabase secrets
- Google API keys
- authentication tokens
- private trip notes
- personal packing data
- account emails
- private user identifiers
- production logs
- raw database exports

## External API handling

The production product routes Google Places calls through server-side endpoints so credentials are not exposed in client code.

The showcased Google Places sample demonstrates:

- server-side environment access
- input sanitization
- bounded query length
- Berlin-specific location bias
- restricted field masks
- graceful empty-result behavior

## Authorization model

The live product uses authenticated identities, trip membership and database-level RLS to separate shared trip state from personal data.

The showcase documents the model but does not include operational credentials or personal records.

## Screenshot review

Before making this repository public, screenshots should be checked for:

- email addresses
- private notes
- personal packing items
- account/profile details
- information that identifies private collaborators unnecessarily

## Code sample policy

Selected source samples are included only where they demonstrate product-relevant patterns.

They should not contain:

- hardcoded credentials
- production-only identifiers
- personal data
- private exports

## Final publication check

Before publication:

1. scan for credential-like strings
2. inspect screenshots manually
3. confirm the production repository remains private
4. confirm no production history was imported
5. verify the showcase is descriptive, not deployable
