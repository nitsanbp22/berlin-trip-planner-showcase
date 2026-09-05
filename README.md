# Berlin Trip Planner | Collaborative Map-Based Travel Planning Product

**Live travel planning product | Product, UI/UX, Maps & Integrations Showcase**

Berlin Trip Planner is a private collaborative travel product I built for a real trip to Berlin. It brought places, daily planning, maps, favorites, visited status, packing, tasks and notes into one shared experience that could be used both before the trip and while moving through the city.

> This repository is a curated portfolio showcase. The private live product, personal trip data, credentials and production history are intentionally excluded.

## Why I built it

Trip planning tends to fragment quickly across Google Maps, saved posts, messages, notes, screenshots and spreadsheets. That makes it difficult to answer simple questions during the trip:

- What do we actually want to do today?
- Which places are close to each other?
- What have we already visited?
- Which places are optional rather than essential?
- What should each person pack or remember?
- Which information is shared and which is personal?

The product goal was to turn that fragmented planning process into one usable system for two travelers.

## Product scope

The live product includes:

- 100+ curated places across Berlin and nearby destinations
- six planned trip days with ordered stops
- interactive map with category-specific markers
- day-specific map context and walking areas
- favorites and visited states
- relative price indicators for food locations
- hotel context
- Google Places search
- Google Places photos, ratings and Google Maps links
- personal packing lists
- personal and shared tasks
- personal and shared notes
- email OTP authentication
- Supabase-backed permissions and realtime synchronization
- responsive mobile and desktop use

## My role

I designed and built the product end to end, including:

- defining the planning problem and product scope
- deciding what information belonged in one shared system
- information architecture for places, days, notes, packing and tasks
- map and list interaction design
- mobile UX for use while traveling
- shared versus personal data behavior
- search, filtering, favorites and visited flows
- integration of external place data
- data modeling and Supabase implementation
- authentication and permissions
- full-stack implementation, QA and iteration during actual use

The technical implementation matters here because it enabled the product behavior, but the core case study is about designing a travel-planning workflow around real user needs.

## Core product journey

```text
Collect places
      ↓
Review and organize
      ↓
Assign places to trip days
      ↓
Explore list + map context
      ↓
Use the planner during the trip
      ↓
Mark visited / update plans
      ↓
Keep shared and personal trip information synchronized
```

## Map and place experience

The map uses **Leaflet with OpenStreetMap tiles** as the geographic interface.

Google Places is used as a complementary data source for:

- place search
- place identity
- ratings
- real location photos
- Google Maps destination links

This separation was deliberate. The product owns the planning experience, while external place services enrich the underlying location data.

### Why the map is more than a pin board

Map markers communicate several layers of product state:

- category
- assigned trip day
- stop order within a day
- relative price
- favorite status
- visited status
- selected location

The map can also display curated walking areas so the user can reason about neighborhoods and walkable clusters rather than isolated POIs.

## Google Places integration

Google Places requests are routed through server endpoints instead of exposing the API key in client code.

The integration includes:

- query sanitization and length limits
- Berlin-specific location bias
- Hebrew language responses where supported
- limited field masks to avoid unnecessary data transfer
- server-side API key access
- cache headers for reusable place results
- coordinate-aware matching for photos
- strict distance validation before accepting a photo match

Selected example: [`googlePlacesSearch.ts`](code-samples/googlePlacesSearch.ts)

## Collaboration and privacy model

The product was built for two authenticated users, but not every piece of trip information should be shared.

The data model separates:

**Shared trip state**
- trip membership
- locations
- trip days
- ordered daily stops
- favorites and visited state

**Personal state**
- packing items tied to a user
- personal tasks
- personal notes

**Flexible state**
- tasks and notes that can be personal or shared

Privacy is enforced through the data layer and RLS, rather than relying only on what the interface hides.

Read more: [Collaboration & Privacy Model](docs/COLLABORATION_AND_PRIVACY.md)

## Product decisions worth discussing

### One product for planning and in-trip use

A planner can be excellent before departure but frustrating on the street. Mobile interaction, fast access to the current day, clear map state and visited actions were treated as first-class use cases.

### Map + list instead of map-only

Maps are strong for spatial reasoning but weak for comparing details. Lists are strong for scanning details but weak for understanding distance. The product keeps both representations connected.

### External data should enrich, not control, the UX

Google Places provides useful place data, but the core trip model remains independent. If a place cannot be matched confidently, the product should degrade gracefully rather than show misleading information.

### Shared does not mean identical

Two travelers share the trip, but they do not necessarily share packing lists, every task or every note. The product model reflects that distinction.

### Dense information needs progressive context

With more than 100 places, showing everything with equal visual weight would make the product unusable. Day filters, categories, map state, optional places and status indicators reduce cognitive load.

## Architecture at a glance

```text
Next.js / React
      ↓
Product UI and planning flows
      ↓
Supabase Auth + PostgreSQL + RLS + Realtime
      ↓
Trip, member, location, day, packing, task and note models

Leaflet + OpenStreetMap
      ↓
Interactive spatial planning layer

Server routes
      ↓
Google Places API
      ↓
Search, ratings, photos and Google Maps references
```

The current production project uses Next.js, React, TypeScript, Supabase, PostgreSQL, Leaflet, OpenStreetMap and Google Places.

Read more: [Architecture & Integrations](docs/ARCHITECTURE_AND_INTEGRATIONS.md)

## Selected code samples

- [`BerlinMap.tsx`](code-samples/BerlinMap.tsx) shows the map layer, dynamic markers, trip-day context and walking zones.
- [`googlePlacesSearch.ts`](code-samples/googlePlacesSearch.ts) shows a server-side Google Places search route with input validation and Berlin-specific location bias.

The showcase is not intended to be runnable. These samples were selected because they demonstrate product-relevant implementation decisions without copying the production system or its data.

## Security and showcase scope

This repository intentionally excludes:

- production environment files
- Supabase credentials
- Google API credentials
- private trip records
- personal notes and packing data
- authenticated user data
- production deployment configuration
- the original Git history

See [SHOWCASE_SCOPE.md](SHOWCASE_SCOPE.md) and [SECURITY.md](SECURITY.md).

## Case study

For a deeper view of the product reasoning, see:

[Product Case Study](docs/PRODUCT_CASE_STUDY.md)

## Status

**Live private product, used during a real Berlin trip.**

The showcase documents the product and engineering decisions without exposing the private operational application.
