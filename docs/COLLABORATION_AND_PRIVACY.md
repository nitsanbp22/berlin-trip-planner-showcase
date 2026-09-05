# Collaboration & Privacy Model

Berlin Trip Planner was designed for two travelers who share one trip but do not necessarily share every piece of personal information.

That makes collaboration a product-model question, not only a UI question.

## Shared trip data

Shared state includes the information required to coordinate the trip itself:

- trip membership
- saved locations
- daily itinerary structure
- stop order
- shared planning state
- visited and favorite behavior where appropriate

Both users need a consistent view of this state.

## Personal data

Some information belongs to one traveler even though it exists inside the same product.

Examples include:

- packing items
- personal notes
- personal tasks

These records are tied to the authenticated user rather than inferred from a name, browser or device.

## Flexible shared/personal data

Notes and tasks can support either personal or shared use cases.

This avoids forcing one global privacy rule on data that has different meanings depending on context.

## Authorization principles

The production design follows several rules:

1. Authentication identifies the user.
2. Trip membership determines access to shared trip information.
3. Personal record ownership is enforced by user identity.
4. RLS provides the database-level authorization boundary.
5. Client-side visibility is not treated as a security control.
6. Local browser storage is not the source of truth for permissions.

## Why this matters for UX

Privacy rules influence interface behavior.

A user needs to understand:

- whether an item is private or shared
- whether a change affects only their device or the shared trip
- which content another traveler can see
- whether an action is changing trip structure or only personal organization

The product therefore treats ownership as part of the information architecture, not hidden implementation detail.

## Realtime behavior

Shared state can update between devices in realtime after trip membership is established.

The main principle is that synchronization should follow authorization boundaries:

- shared state can synchronize between trip members
- personal state remains scoped to its owner

## Product takeaway

Collaborative software should not assume that a shared workspace means fully shared data.

The more useful question is:

**Which object is shared, with whom, and under what user expectation?**

That question shaped both the database model and the interaction design of the planner.
