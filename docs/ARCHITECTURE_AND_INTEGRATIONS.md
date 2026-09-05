# Architecture & Integrations

## Product architecture

The production planner separates product state from external place services.

```text
Next.js + React UI
        ↓
Trip planning flows
        ↓
Supabase Auth + PostgreSQL + RLS + Realtime
        ↓
Trips, members, locations, days, packing, tasks, notes

Leaflet + OpenStreetMap
        ↓
Interactive geographic visualization

Server-side API routes
        ↓
Google Places
        ↓
Search, place metadata, ratings, photos, Google Maps references
```

## Why Leaflet + OpenStreetMap

The map is primarily a product surface for visualizing trip state. Leaflet gives the application direct control over markers, tooltips, overlays and walking zones, while OpenStreetMap provides the geographic base layer.

This is useful because the most important information on the map comes from the planner itself:

- trip-day assignment
- category
- stop order
- favorite state
- visited state
- relative price
- selected state

Those are product concepts, not mapping-provider concepts.

## Google Places as an enrichment layer

Google Places is used where external place data adds value:

- searching for a place
- resolving a Google Place ID
- retrieving ratings
- retrieving real location photos
- providing Google Maps references

The planner remains usable as its own product model rather than treating Google Places as the source of truth for itinerary state.

## Server-side API boundary

Google API calls run through Next.js server routes.

Benefits:

- the API key remains server-side
- request input can be validated and normalized
- field masks can be kept narrow
- location bias can be applied consistently
- errors and fallbacks can be normalized for the UI
- cache behavior can be controlled by the application

## Search behavior

The place search route:

1. reads a server-side API key
2. sanitizes the user query
3. rejects very short input
4. tries a Berlin-specific query first
5. applies a Berlin-centered location bias
6. requests only the required fields
7. returns a normalized list of places
8. applies shared-cache headers to successful results

## Photo matching

Photo resolution is intentionally stricter than text search.

A place photo is useful only when the application is confident the image belongs to the intended location.

The production flow can:

1. resolve directly by Place ID when available
2. otherwise generate search-query variants
3. use the saved coordinates as a local search bias
4. rank candidates by geographic distance
5. accept only candidates within a strict distance threshold
6. select a landscape-oriented image when possible
7. return attribution information with the photo

This is a product-quality decision as much as an engineering decision. A wrong photo damages user trust more than no photo.

## Supabase data model

The production architecture separates domain concepts instead of storing the entire planner as one JSON document.

Key model groups include:

- profiles
- trips
- trip members
- locations
- trip days
- day/location ordering
- packing items
- tasks
- notes

This makes ownership, authorization and realtime updates easier to reason about.

## Authentication and membership

The live product uses separate authenticated identities for both travelers.

The startup flow is conceptually:

```text
Session
  ↓
Profile
  ↓
Trip membership
  ↓
Shared trip state + personal state
  ↓
Realtime subscriptions
```

Realtime channels are opened only after the authenticated user has a valid trip membership.

## Authorization

Privacy is enforced in the database using RLS.

Important design principles include:

- no hardcoded user identity in client code
- no ownership inferred from a display name
- browser storage is not a source of authorization truth
- personal records remain tied to authenticated user identity
- join behavior is handled atomically
- trip join codes are stored as hashes rather than plain text

## Realtime collaboration

Realtime synchronization lets both devices reflect changes to shared product state without requiring manual refreshes.

This is especially useful for:

- itinerary changes
- visited status
- shared tasks
- shared notes

The product still distinguishes realtime shared data from personal information that belongs to only one traveler.

## Technology context

The current production project includes:

- Next.js
- React
- TypeScript
- Supabase
- PostgreSQL
- RLS
- Realtime
- Leaflet
- OpenStreetMap
- Google Places API
- Vercel-oriented deployment

The showcase focuses on how these tools support product behavior rather than presenting the stack as the product itself.
