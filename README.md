# Synapse Express Example

All 16 SDK endpoints with [@pyrx/synapse](https://www.npmjs.com/package/@pyrx/synapse) + Express.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env`
3. `npm run dev`

## Endpoints

### Core
- `POST /api/track` — Track event
- `POST /api/track/batch` — Batch track events
- `POST /api/identify` — Identify contact
- `POST /api/identify/batch` — Batch identify
- `POST /api/send` — Send transactional email

### Contacts
- `GET /api/contacts` — List contacts (?page, ?limit, ?tag, ?search)
- `GET /api/contacts/:id` — Get contact
- `PUT /api/contacts/:externalId` — Update contact
- `DELETE /api/contacts/:externalId` — Delete contact

### Templates
- `GET /api/templates` — List templates
- `POST /api/templates` — Create template
- `GET /api/templates/:slug` — Get template
- `PUT /api/templates/:slug` — Update template
- `DELETE /api/templates/:slug` — Delete template
- `POST /api/templates/:slug/preview` — Preview template

## Learn more

- [Synapse Documentation](https://synapse.pyrx.tech/developers)
