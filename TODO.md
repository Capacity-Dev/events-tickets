# Event Ticketing Platform — TODO

## Guest (Public — no auth)

### Backend
- [x] `GET /` — homepage with featured events (Edge.js)
- [x] `GET /events` — paginated listing with category filters, date range, search (Edge.js)
- [x] `GET /events/:slug` — event detail page with ticket types, venue, description (Edge.js)
- [ ] Event search API (full-text, category, date)
- [ ] Redis page caching for homepage + listings (5min TTL)
- [x] Schema.org structured data on event pages
- [x] Dynamic OpenGraph meta tags per event
- [ ] Sitemap.xml generation

### Frontend (Edge.js + Tailwind)
- [x] Homepage: hero section, featured events grid, category pills
- [x] Event listing page: responsive grid, filter bar, pagination/infinite scroll
- [x] Event detail page: hero image, date/venue block, ticket type selector with live availability

---

## User (Authenticated — Buyer + Organizer)

### Backend — Buyer
- [ ] `GET /dashboard/buyer/orders` — order history
- [ ] `GET /dashboard/buyer/tickets` — active tickets grid
- [ ] `POST /orders` — create order (cart → checkout)
- [ ] `POST /orders/:id/pay` — initiate payment
- [ ] `GET /orders/:id` — order detail
- [ ] Guest checkout: session-based cart with 10min TTL (Redis)
- [ ] Inventory locking via Redis + DB transactions

### Backend — Organizer
- [ ] `GET /dashboard/organizer/events` — list my events
- [ ] Event creation flow (create, edit, update, delete/cancel)
- [ ] `POST /dashboard/organizer/events/:id/publish` — submit for approval
- [ ] `GET /dashboard/organizer/events/:id/analytics` — sales/revenue charts
- [ ] `GET /dashboard/organizer/check-in/:eventId` — QR scanner page
- [ ] `POST /dashboard/organizer/payouts` — request payout

### Backend — Shared / Auth
- [ ] Email/password signup + login + logout (done)
- [ ] Google OAuth 2.0 (`/auth/google`, `/auth/google/callback`)
- [ ] Profile settings: name, avatar, notification prefs

### Frontend (Inertia.js + React + shadcn/ui) — Buyer
- [ ] Orders page: table with filters (status, date), expandable rows
- [ ] Tickets page: grid of ticket cards, QR thumbnail, download PDF
- [ ] Profile settings form

### Frontend (Inertia.js + React + shadcn/ui) — Organizer
- [ ] Events list: table with status badges, quick actions (edit, duplicate, pause)
- [ ] Event creation wizard (multi-step): basic info → media → date/venue → ticket types → review
- [ ] Event edit form (same wizard, pre-filled)
- [ ] Analytics dashboard: revenue chart, tickets-by-type chart, date range picker
- [ ] Check-in module: camera QR scanner, scan result feedback (green/yellow/red)
- [ ] Payout request form + history

### Frontend — Shared UI
- [ ] Layout: sidebar nav + top bar, user menu
- [ ] Toast notifications (sonner) for flash messages and errors
- [ ] Loading states, empty states, error boundaries

---

## Admin (Platform administrators)

### Backend
- [ ] `GET /admin/events/pending` — moderation queue
- [ ] `POST /admin/events/:id/approve` — approve event
- [ ] `POST /admin/events/:id/reject` — reject event (with reason)
- [ ] `GET /admin/users` — user management (search, filter, paginate)
- [ ] `PATCH /admin/users/:id/role` — change user role
- [ ] `POST /admin/users/:id/suspend` — suspend user
- [ ] `GET /admin/fee-rules` — list fee rules
- [ ] `POST /admin/fee-rules` — create fee rule
- [ ] `PUT /admin/fee-rules/:id` — update fee rule
- [ ] `GET /admin/finances/orders` — transaction log
- [ ] `GET /admin/finances/payouts` — payout management
- [ ] `POST /admin/finances/payouts/:id/process` — approve payout
- [ ] CRUD categories
- [ ] `PUT /admin/settings/homepage` — feature/unfeature events
- [ ] `POST /admin/whatsapp/templates` — manage WhatsApp templates

### Frontend (Inertia.js + React + shadcn/ui)
- [ ] Moderation queue: table of pending events, preview modal, approve/reject
- [ ] User management: searchable table, role editor, suspend dialog
- [ ] Fee engine: rule list, rule editor form (type selector, value inputs)
- [ ] Financial dashboard: GMV summary cards, transaction log, payout approval
- [ ] Category CRUD table
- [ ] Platform settings: homepage curator (drag-drop featured events)

---

## Database Migrations (Foundation)

- [x] Create `roles` table (admin, organizer, buyer)
- [x] Add `role_id` to `users` table
- [x] Create `profiles` table (linked to users)
- [x] Create `categories` table
- [x] Create `events` table (status, dates, venue, media, SEO)
- [x] Create `ticket_types` table (price, inventory, sales window, status)
- [ ] Create `orders` + `order_items` tables
- [ ] Create `tickets` table (QR token, status, check-in tracking)
- [ ] Create `ticket_inventory_locks` table (session-based reservation)
- [ ] Create `fee_rules` + `event_fee_rules` + `organizer_fee_profiles` tables
- [ ] Create `payouts` + `platform_revenue_logs` tables
- [ ] Create `whatsapp_templates` + `notification_logs` tables
