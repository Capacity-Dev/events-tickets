## Complete Plan: Event Ticketing Platform (2026 Stack)

### Executive Summary

This platform is a full-stack event ticketing and management system built on **AdonisJS v7** (the current stable release as of 2026) with **React 19** for dashboard interfaces via **Inertia.js 3**, **Edge.js** for public-facing SEO-optimized pages, and **PostgreSQL** as the primary database. The system supports three user roles (Admin, Organizer, Buyer), handles complex fee calculations, guest checkout flows, QR-code ticket validation, and integrates WhatsApp Business API for transactional notifications alongside Google OAuth for seamless authentication.

---

### Phase 1: Foundation & Architecture

#### 1.1 Technology Stack Selection

**Backend Framework:** AdonisJS v7

- Full ESM (ECMAScript Modules) support, end-to-end type safety, and zero-config OpenTelemetry for observability
- Built-in VineJS for validation, Lucid ORM for database operations, and Redis for session/cache management
- Native support for Inertia.js 3 with React 19 adapters
- New Persona and Permission packages (released 2026) for role-based access control

**Frontend Public Pages:** Edge.js (AdonisJS templating engine) + Tailwind CSS v4

- Server-side rendered for optimal SEO and fast initial page loads
- OpenGraph meta tags dynamically injected for social sharing of event pages

**Frontend Dashboards:** React 19 + Inertia.js 3 + shadcn/ui components

- SPA-like experience without losing server-side routing benefits
- React 19's new compiler for automatic memoization and improved performance
- shadcn/ui for accessible, customizable UI primitives (tables, forms, dialogs, charts)

**Database:** PostgreSQL 16+

- ACID compliance for critical inventory operations
- JSONB support for flexible fee rule configurations
- Full-text search capabilities for event discovery

**Cache & Session Store:** Redis 7

- Distributed locking for ticket inventory management
- Session storage for guest checkout flows
- Rate limiting for API endpoints

**Queue System:** AdonisJS BullMQ integration

- Background job processing for PDF generation, email dispatch, and WhatsApp notifications
- Scheduled jobs for inventory cleanup

**File Storage:** AWS S3 (or MinIO for self-hosted)

- Event media uploads, ticket PDF storage, and organizer documents

**Search Engine:** Meilisearch or Algolia

- Fast, typo-tolerant event search and filtering

**Payment Processing:** Stripe (primary) + local mobile money integrations for DRC

- Stripe Checkout for card payments
- Webhook handling for asynchronous payment confirmation

**Notification Channels:**

- Email: Resend or SendGrid via AdonisJS Mail module
- WhatsApp: Meta Cloud API (Business Solution Provider model)
- SMS: Twilio or Africa's Talking for DRC coverage

**Authentication:**

- Google OAuth 2.0 (Sign in with Google)
- Email/password with bcrypt hashing
- Optional: Magic link authentication for frictionless guest checkout

**Observability:** OpenTelemetry (built into AdonisJS v7) + Grafana/Prometheus

---

#### 1.2 Project Structure

```
ticketing-platform/
├── apps/
│   ├── web/                    # AdonisJS v7 application
│   │   ├── app/
│   │   │   ├── controllers/    # HTTP request handlers
│   │   │   ├── models/         # Lucid ORM models
│   │   │   ├── services/       # Business logic (FeeProcessor, TicketGenerator)
│   │   │   ├── jobs/           # Background job classes
│   │   │   ├── middleware/     # Auth, role, guest session middleware
│   │   │   ├── validators/     # VineJS validation schemas
│   │   │   └── events/         # Event-driven architecture classes
│   │   ├── config/             # Framework configuration
│   │   ├── database/
│   │   │   ├── migrations/     # Schema evolution
│   │   │   └── seeders/        # Initial data population
│   │   ├── resources/
│   │   │   ├── views/          # Edge templates (public pages)
│   │   │   └── js/             # React 19 + Inertia entry points
│   │   ├── routes/
│   │   │   ├── public.ts       # Edge-rendered routes (SEO pages)
│   │   │   ├── auth.ts         # Authentication routes
│   │   │   ├── dashboard.ts    # Inertia-protected buyer/organizer routes
│   │   │   └── admin.ts        # Inertia-protected admin routes
│   │   └── tests/
│   └── mobile/                 # Future React Native or PWA
├── packages/
│   ├── shared-types/           # TypeScript definitions shared across apps
│   └── ui-components/          # Reusable shadcn/ui components
├── infrastructure/
│   ├── docker/                 # Docker Compose for local development
│   ├── terraform/              # Infrastructure as Code (AWS/DigitalOcean)
│   └── kubernetes/             # K8s manifests for production
└── docs/                       # API documentation, deployment guides
```

---

### Phase 2: Database Design & Core Entities

#### 2.1 User Management & Authentication

**Table: `users`**

- `id` (UUID, PK)
- `email` (unique, indexed)
- `password_hash` (nullable — for OAuth-only users)
- `google_id` (nullable, indexed — for Google OAuth linkage)
- `google_refresh_token` (encrypted at rest)
- `email_verified_at` (timestamp)
- `role_id` (FK to roles)
- `created_at`, `updated_at`, `deleted_at` (soft deletes)

**Table: `profiles`**

- `id` (UUID, PK)
- `user_id` (FK, unique)
- `first_name`, `last_name`
- `phone_number` (E.164 format, validated)
- `avatar_url`
- `locale` (default: fr_FR for DRC market)
- `timezone`
- `whatsapp_opt_in` (boolean — GDPR/compliance consent)

**Table: `roles`**

- `id` (UUID, PK)
- `name` (enum: admin, organizer, buyer)
- `permissions` (JSONB array of granular permissions)

**Table: `oauth_connections`**

- `id` (UUID, PK)
- `user_id` (FK)
- `provider` (enum: google, facebook, apple)
- `provider_user_id`
- `access_token` (encrypted)
- `refresh_token` (encrypted)
- `expires_at`
- `scopes` (JSONB)

---

#### 2.2 Event Management

**Table: `events`**

- `id` (UUID, PK)
- `organizer_id` (FK to users)
- `title` (indexed for full-text search)
- `slug` (unique, URL-friendly)
- `description` (rich text/HTML)
- `category_id` (FK)
- `venue_name`, `venue_address`, `venue_coordinates` (lat/lng)
- `start_date`, `end_date` (timestamps with timezone)
- `cover_image_url`, `gallery_images` (JSONB array)
- `status` (enum: draft, pending_approval, published, rejected, cancelled, completed)
- `is_featured` (boolean, for homepage promotion)
- `seo_meta` (JSONB: title, description, keywords)
- `created_at`, `updated_at`, `published_at`

**Table: `categories`**

- `id` (UUID, PK)
- `name` (localized)
- `slug` (unique)
- `icon_url`
- `display_order`

---

#### 2.3 Ticketing & Inventory

**Table: `ticket_types`**

- `id` (UUID, PK)
- `event_id` (FK, indexed)
- `name` (e.g., "Standard", "VIP", "Early Bird")
- `description`
- `base_price` (decimal, currency-aware)
- `currency` (default: CDF or USD for DRC)
- `quantity_total` (int, total inventory)
- `quantity_sold` (int, computed counter)
- `quantity_reserved` (int, currently held in carts)
- `max_per_order` (int, purchase limit per customer)
- `sales_start_at`, `sales_end_at` (timestamps)
- `status` (enum: active, paused, sold_out, hidden)
- `sort_order`

**Table: `ticket_inventory_locks`**

- `id` (UUID, PK)
- `ticket_type_id` (FK)
- `session_id` (string, for guest checkout)
- `user_id` (nullable FK, for authenticated users)
- `quantity` (int)
- `expires_at` (timestamp, 10-minute TTL)
- `created_at`
- _Purpose:_ Prevents overselling during high-demand releases. Cleaned by scheduled job.

---

#### 2.4 Fee Configuration Engine

**Table: `fee_rules`**

- `id` (UUID, PK)
- `name` (e.g., "Platform Default 5%", "VIP Event Surcharge")
- `type` (enum: percentage, fixed_amount, hybrid, per_lot)
- `value` (decimal — percentage as 0.05 or fixed amount)
- `secondary_value` (nullable — for hybrid: fixed + percentage)
- `applies_to` (enum: buyer, organizer, split)
- `buyer_percentage` (nullable, for split rules)
- `organizer_percentage` (nullable, for split rules)
- `min_fee` (nullable, floor amount)
- `max_fee` (nullable, cap amount)
- `is_default` (boolean, global fallback)
- `status` (active, inactive)
- `priority` (int, for rule resolution order)

**Table: `event_fee_rules`**

- `id` (UUID, PK)
- `event_id` (FK)
- `fee_rule_id` (FK)
- `override_value` (nullable, event-specific fee amount)
- `effective_from`, `effective_until` (nullable, date ranges)
- _Purpose:_ Pivot table linking specific fee rules to events. If empty, default rules apply.

**Table: `organizer_fee_profiles`**

- `id` (UUID, PK)
- `organizer_id` (FK to users)
- `fee_rule_id` (FK)
- `contract_start_date`, `contract_end_date`
- _Purpose:_ Commercial overrides for specific organizers (e.g., enterprise clients with custom commission rates).

---

#### 2.5 Orders & Transactions

**Table: `orders`**

- `id` (UUID, PK)
- `order_number` (string, human-readable, unique: ORD-2026-000001)
- `buyer_id` (nullable FK, for guest checkout)
- `guest_email` (nullable, for guest checkout)
- `guest_phone` (nullable, for WhatsApp notifications to guests)
- `status` (enum: pending, reserved, paid, failed, refunded, cancelled, expired)
- `total_gross_amount` (decimal, sum of ticket prices)
- `platform_fee_amount` (decimal, computed by FeeProcessor)
- `organizer_net_amount` (decimal, gross - platform fee - payment processor fee)
- `payment_processor_fee` (decimal, Stripe fees)
- `currency`
- `payment_intent_id` (nullable, Stripe reference)
- `payment_method` (enum: card, mobile_money, bank_transfer)
- `paid_at` (timestamp)
- `refunded_at` (timestamp)
- `cancellation_reason` (nullable)
- `ip_address`, `user_agent` (fraud prevention)
- `created_at`, `updated_at`

**Table: `order_items`**

- `id` (UUID, PK)
- `order_id` (FK)
- `ticket_type_id` (FK)
- `unit_price` (snapshot at purchase time)
- `quantity`
- `line_total` (computed)
- `attendee_details` (JSONB: name, email, phone for each ticket holder)

**Table: `tickets`**

- `id` (UUID, PK)
- `order_item_id` (FK)
- `event_id` (FK, denormalized for quick queries)
- `ticket_type_id` (FK, denormalized)
- `ticket_number` (string, unique, human-readable: TKT-XXXX-XXXX)
- `uuid` (UUID, unique, public identifier)
- `qr_token` (string, encrypted HMAC — never exposed raw)
- `status` (enum: valid, used, cancelled, refunded, expired)
- `used_at` (timestamp)
- `used_by_scanner_id` (nullable FK, user who scanned)
- `checked_in_at` (nullable, venue check-in timestamp)
- `pdf_url` (nullable, S3 path)
- `created_at`, `updated_at`

---

#### 2.6 Financial & Payout Management

**Table: `payouts`**

- `id` (UUID, PK)
- `organizer_id` (FK)
- `event_id` (nullable, FK — null for bulk payouts)
- `status` (enum: pending, processing, completed, failed)
- `amount` (decimal, net organizer revenue)
- `currency`
- `payout_method` (enum: bank_transfer, mobile_money)
- `payout_reference` (nullable, bank transfer reference)
- `requested_at`, `processed_at`, `completed_at` (timestamps)
- `admin_notes` (nullable)

**Table: `platform_revenue_logs`**

- `id` (UUID, PK)
- `order_id` (FK)
- `fee_rule_id` (FK)
- `calculated_fee_amount` (decimal)
- `fee_breakdown` (JSONB: percentage_component, fixed_component, etc.)
- `collected_at` (timestamp)

---

#### 2.7 WhatsApp & Notification Management

**Table: `whatsapp_templates`**

- `id` (UUID, PK)
- `name` (Meta template name, e.g., "ticket_confirmation_v2")
- `category` (enum: utility, authentication, marketing)
- `language_code` (e.g., fr, en_US)
- `status` (enum: pending_approval, approved, rejected)
- `meta_template_id` (Meta's internal template ID)
- `variables` (JSONB, expected variable placeholders)
- `created_at`

**Table: `notification_logs`**

- `id` (UUID, PK)
- `recipient_type` (enum: user, guest)
- `recipient_id` or `recipient_phone` / `recipient_email`
- `channel` (enum: whatsapp, email, sms)
- `template_id` (nullable FK to whatsapp_templates)
- `status` (enum: queued, sent, delivered, failed, read)
- `payload` (JSONB, message content snapshot)
- `external_message_id` (nullable, Meta's message ID)
- `error_details` (nullable, JSONB)
- `sent_at`, `delivered_at`, `read_at` (timestamps)

---

### Phase 3: Authentication & Identity

#### 3.1 Google OAuth 2.0 Integration

**Registration Flow:**

1. User clicks "Sign in with Google" on public pages or dashboard login
2. Backend generates PKCE-verified authorization URL with `state` parameter (CSRF protection) and `nonce` (replay protection)
3. Google redirects to `/auth/google/callback` with authorization code
4. Backend exchanges code for tokens (access_token + refresh_token + id_token)
5. Verify ID token signature against Google's JWKS endpoint
6. Extract claims: `sub` (Google ID), `email`, `email_verified`, `name`, `picture`
7. Check if `google_id` exists in `users` table:
   - **Exists:** Create session, redirect to intended dashboard
   - **New:** Create user record with `google_id`, auto-verify email, create profile with Google avatar, assign `buyer` role by default
8. Store refresh token encrypted in `oauth_connections` table for future token refresh
9. Redirect to onboarding (profile completion) or directly to dashboard

**Token Refresh Strategy:**

- Access tokens expire after 1 hour. Use stored refresh token to obtain new access tokens silently
- If refresh fails (user revoked access), prompt re-authentication
- Never expose tokens client-side; store server-side in encrypted database columns

**Security Measures:**

- HTTPS-only cookies with `Secure`, `HttpOnly`, `SameSite=Lax` flags
- `state` parameter validation to prevent CSRF
- Strict redirect URI validation (exact match required by Google)
- Scope minimization: only request `openid`, `email`, `profile` (no Google Drive or Calendar access unless needed)

**Role Elevation:**

- After Google login, users default to `buyer` role
- To become an `organizer`, user must complete additional KYC (business registration, bank details) and await admin approval
- Admin role is assigned manually by existing admins via admin panel

---

#### 3.2 Guest Checkout Session Management

**Purpose:** Allow ticket purchase without account creation, reducing friction.

**Implementation:**

- When user adds tickets to cart on public pages, generate a `guest_session_id` (UUID v4)
- Store session in Redis with 10-minute TTL: `guest:session:{id} -> { cart_items, email, phone, expires_at }`
- On checkout page, collect minimal info: first name, last name, email, phone (optional, for WhatsApp)
- If payment succeeds within TTL, auto-create user account from guest email (if not exists) and link order
- If TTL expires, release inventory locks via scheduled job and clear Redis key
- After purchase, send email with "Create account" magic link to convert guest to registered user

---

### Phase 4: WhatsApp Business API Integration

#### 4.1 Meta Business Account Setup

**Prerequisites:**

- Verified Meta Business Manager account
- WhatsApp Business Account (WABA) created within Business Manager
- Phone number registered (must not be active on WhatsApp consumer app)
- Display name approved by Meta

**API Access Model:**

- Use Meta's Cloud API (not on-premise) for faster deployment and lower maintenance
- Implement via official Meta Business Solution Provider (BSP) or direct Cloud API integration

#### 4.2 Authentication & Token Management

**Token Types:**

- **System User Token (Production):** Permanent token generated via Meta Business Manager. Assign to a System User with `whatsapp_business_messaging` and `whatsapp_business_management` permissions. This token does not expire and is ideal for backend transactional messaging.
- **User Access Token (60-day):** Generated via Embedded Signup if allowing organizers to connect their own WhatsApp numbers. Track expiry and notify reconnection 7 days before expiration.

**Storage:**

- Encrypt tokens at rest using AdonisJS Encryption module (AES-256-GCM or ChaCha20-Poly1305)
- Never log tokens or expose in API responses
- Rotate tokens immediately if compromise is suspected

#### 4.3 Webhook Infrastructure

**Endpoint:** `POST /webhooks/whatsapp`

- Verify signature using Meta's X-Hub-Signature-256 header (SHA-256 HMAC with app secret)
- Handle events:
  - `messages` (incoming — for support/chatbot if needed)
  - `message_statuses` (sent, delivered, read, failed)
  - `template_status_update` (approval/rejection notifications)

**Webhook Verification:**

- Meta sends GET request with `hub.challenge` during setup; respond with challenge value
- Subscribe app to WABA via Graph API after verification

#### 4.4 Message Templates & Sending Logic

**Template Categories (2026 Pricing Model):**

- **Utility:** Order confirmations, ticket delivery, event reminders (lower cost, ~$0.0018 per message in Africa region)
- **Authentication:** OTP codes, login verification (lowest cost)
- **Marketing:** Promotional campaigns, event recommendations (highest cost, ~$0.0136)
- **Service:** Free within 24h of user-initiated message

**Required Templates (Pre-approved by Meta):**

1. **Ticket Purchase Confirmation (Utility)**
   - Variables: `{{1}}` = Event Name, `{{2}}` = Ticket Type, `{{3}}` = Quantity, `{{4}}` = Total Price, `{{5}}` = Event Date, `{{6}}` = Venue, `{{7}}` = Order Number
   - Sent immediately after payment webhook confirmation

2. **Ticket QR Code Delivery (Utility)**
   - Variables: `{{1}}` = Attendee Name, `{{2}}` = Event Name, `{{3}}` = Ticket Number
   - Includes attachment: PDF ticket or image of QR code
   - Sent 2-5 minutes after purchase (after PDF generation job completes)

3. **Event Reminder (Utility)**
   - Variables: `{{1}}` = Event Name, `{{2}}` = Date, `{{3}}` = Time, `{{4}}` = Venue, `{{5}}` = Check-in Instructions
   - Sent 24 hours before event start

4. **Payment Failed / Cart Abandoned (Utility)**
   - Variables: `{{1}}` = Event Name, `{{2}}` = Cart Total, `{{3}}` = Expiry Time
   - Sent 5 minutes before cart reservation expires

5. **Check-in Confirmation (Utility)**
   - Variables: `{{1}}` = Attendee Name, `{{2}}` = Event Name, `{{3}}` = Check-in Time
   - Sent immediately after successful QR scan

**Template Pacing Compliance:**

- New marketing templates initially sent to small subset by Meta
- Monitor block rates and quality ratings
- Auto-escalate volume only if quality score remains high

#### 4.5 Sending Architecture

**Flow:**

1. Business event triggers notification (e.g., `order:paid` event emitted)
2. Event listener checks user preference (`whatsapp_opt_in` and valid phone number)
3. If within 24h of last user message: send free-form message
4. If outside 24h window: use approved template with variables populated from order data
5. Queue message via BullMQ job (`SendWhatsAppNotificationJob`)
6. Job calls Meta Graph API: `POST https://graph.facebook.com/v21.0/{phone_number_id}/messages`
7. Log response in `notification_logs` with `external_message_id`
8. Webhook updates delivery status asynchronously

**Rate Limiting:**

- Respect Meta's throughput: 80 messages/second per phone number (standard), up to 500/sec (high volume tier)
- Implement exponential backoff for API failures
- Circuit breaker pattern for Meta API downtime

**Phone Number Strategy:**

- Start with single platform number for transactional messages
- For organizers wanting their own branded WhatsApp: implement Embedded Signup flow where organizer connects their WABA via OAuth, and platform acts as tech provider

---

### Phase 5: Public-Facing Interface (Edge.js + Tailwind)

#### 5.1 Homepage & Event Discovery

**SEO-First Architecture:**

- Server-side rendered Edge templates with structured data (Schema.org Event markup)
- Dynamic OpenGraph tags: `og:title`, `og:description`, `og:image` (event cover), `og:url` for each event
- Canonical URLs and hreflang tags for French/English localization
- Sitemap.xml auto-generated and cached, updated when events publish

**Features:**

- Hero section with featured events (admin-curated)
- Category filter pills (Concerts, Sports, Conferences, etc.)
- Date range picker and location-based search
- Infinite scroll or pagination with URL state preservation
- Event cards: image, title, date, venue, price range, remaining tickets indicator
- Responsive grid (1 col mobile, 2 tablet, 3-4 desktop)

**Performance:**

- Aggressive Redis caching of homepage and category listings (5-minute TTL)
- Image optimization via CDN (CloudFront/Cloudflare) with WebP format
- Critical CSS inlined, non-critical loaded asynchronously

#### 5.2 Event Detail Page

**Content:**

- Full-width hero image with gradient overlay
- Event title, date/time block, venue with map embed (Google Maps or Mapbox)
- Organizer profile card with avatar and bio
- Rich description (sanitized HTML from WYSIWYG editor)
- Ticket type selector with real-time availability
- Social sharing buttons (pre-populated with OpenGraph data)
- Related events carousel

**Ticket Selection Widget:**

- Radio or card selection for each ticket type
- Quantity stepper (respecting `max_per_order`)
- Dynamic price calculation with fee transparency (show buyer fee breakdown before checkout)
- Real-time stock indicator: "Only 3 left!" or "Selling fast!"
- "Add to cart" triggers inventory lock and redirects to checkout

#### 5.3 Guest Checkout Tunnel

**Step 1: Cart Review**

- Summary of selected tickets with images
- Editable quantities (re-validates inventory)
- Price breakdown: subtotal + fees + total
- "Continue as guest" or "Sign in for faster checkout"

**Step 2: Attendee Information**

- Form: First name, last name, email, phone (optional, for WhatsApp)
- If multiple tickets: expand sections for each attendee's details
- Email validation via Mailgun/ZeroBounce API (optional, reduces fake emails)

**Step 3: Payment**

- Stripe Elements embedded (customizable to match brand)
- Support for cards and local payment methods (mobile money via Stripe)
- 3D Secure handling for card authentication
- Loading state with progress indicator

**Step 4: Confirmation**

- Success page with order summary
- "Download tickets" button (triggers PDF generation job)
- "Add to calendar" links (Google Calendar, iCal)
- WhatsApp opt-in checkbox: "Receive updates via WhatsApp"
- Social sharing: "I'm attending [Event]!"

**Error Handling:**

- Payment failure: graceful error message, preserve cart, allow retry
- Inventory conflict: if tickets sell out during checkout, show apology and suggest alternatives
- Session expiry: redirect to event page with cart cleared and message

---

### Phase 6: Dashboard Applications (Inertia + React 19)

#### 6.1 Buyer Dashboard (`/dashboard/buyer`)

**Layout:**

- Sidebar navigation: Orders, Tickets, Profile, Settings
- Top bar: search, notifications bell, user menu
- Mobile-responsive: collapsible sidebar, bottom nav on mobile

**Orders Page:**

- Table of past orders with filters (status, date range, event)
- Columns: Order #, Event, Date, Amount, Status, Actions
- Actions: View details, download invoice, request refund (if eligible)
- Order detail modal: full breakdown, attendee list, ticket statuses

**Tickets Page:**

- Grid of active tickets (valid or upcoming events)
- Each card: event image, title, date, ticket type, QR code thumbnail
- Click to expand: full QR code, download PDF, add to Apple Wallet / Google Wallet
- Past events: archived view with "Leave review" prompt

**Profile Settings:**

- Edit personal info, change password (if not OAuth-only)
- Notification preferences: email frequency, WhatsApp opt-in, SMS
- Connected accounts: Google unlink/relink, add other OAuth providers
- Payment methods: saved cards via Stripe Customer portal

---

#### 6.2 Organizer Dashboard (`/dashboard/organizer`)

**Event Creation Wizard:**

- Step 1: Basic info (title, description, category, slug auto-generation)
- Step 2: Media upload (cover image, gallery, drag-and-drop with preview)
- Step 3: Date/venue (datetime pickers, address autocomplete via Google Places API or Mapbox)
- Step 4: Ticket types (dynamic table: add rows for each type with price, quantity, limits)
- Step 5: Review and submit for admin approval
- Auto-save drafts to localStorage + server every 30 seconds

**Event Management:**

- List view: all events with status badges (draft, pending, published, rejected)
- Quick actions: edit, duplicate, pause sales, cancel event
- Analytics preview: tickets sold, revenue, conversion rate per event

**Ticket Manager:**

- Table of all ticket types per event
- Edit quantities, prices, visibility
- Sales velocity chart (tickets per hour/day)
- Waitlist management (if event sells out)

**Analytics Dashboard:**

- Time-series charts (Recharts or Tremor):
  - Revenue over time (cumulative and daily)
  - Tickets sold by type (stacked bar chart)
  - Conversion funnel: page views -> cart adds -> checkouts -> purchases
  - Geographic distribution of buyers (map or table)
- Date range picker (7 days, 30 days, custom)
- Export to CSV/Excel

**Check-in Module (Mobile-Optimized):**

- Dedicated route: `/dashboard/organizer/check-in/{event_id}`
- Camera access via browser QR scanner (using `html5-qrcode` library)
- Scan validation: decode QR token, verify HMAC signature, check ticket status
- Visual feedback:
  - Green: Valid ticket -> mark as used, show attendee name, ticket type, seat (if applicable)
  - Yellow: Already used -> show first scan time, prevent re-entry
  - Red: Invalid/unknown -> alert with sound, log attempt
- Offline mode: queue scans locally, sync when connection restored
- Manual entry fallback: type ticket number if QR damaged
- Real-time sync: WebSocket or Server-Sent Events showing scan count and remaining capacity

**Payout Requests:**

- View available balance (net revenue minus platform fees)
- Request payout: select amount, method (bank transfer/mobile money), submit
- Payout history table with status tracking
- Minimum threshold enforcement (e.g., $50 minimum)

---

#### 6.3 Admin Dashboard (`/admin`)

**Moderation Queue:**

- Table of pending events with organizer info, submission date
- Preview modal: full event details, media, ticket types
- Actions: Approve (publishes immediately), Reject (with reason textarea), Request Changes
- Bulk actions: approve multiple, mass email to organizers
- Auto-escalation: events pending > 48 hours highlighted

**User Management:**

- Searchable table of all users with filters (role, status, registration date)
- Edit roles, suspend accounts, view activity log
- Organizer KYC review: business docs, bank details verification

**Fee Engine Configuration:**

- Global default fee rule editor
- Table of all fee rules with toggle activation
- Create new rule: form with type selector, value inputs, conditional logic builder
- Organizer overrides: search organizer, apply custom fee rule, set date range
- Event overrides: search event, apply override, preview calculation

**Financial Oversight:**

- GMV dashboard: total sales, platform revenue, organizer payouts, processor fees
- Transaction log: all orders with filtering and export
- Payout management: view pending requests, approve/process, mark complete
- Dispute handling: refund requests, chargeback tracking

**Platform Settings:**

- Homepage curation: drag-drop featured events
- Category management: CRUD for event categories
- WhatsApp template management: view approval status, submit new templates to Meta
- Notification settings: global email templates, SMS gateway config

---

### Phase 7: Core Business Logic Services

#### 7.1 Fee Processor Service

**Responsibility:** Calculate and distribute fees for every order based on configurable rules.

**Algorithm:**

1. Receive cart input: array of `{ ticket_type_id, quantity }`
2. Fetch applicable fee rules in priority order:
   - Check `event_fee_rules` for event-specific override
   - Check `organizer_fee_profiles` for organizer-specific rule
   - Fall back to `fee_rules` where `is_default = true`
3. Calculate per rule:
   - **Percentage:** `gross * value`
   - **Fixed:** `value * quantity`
   - **Hybrid:** `(gross * percentage) + (fixed * quantity)`
   - **Per_lot:** `value` (flat per order)
4. Apply min/max caps if configured
5. Split by `applies_to`:
   - `buyer`: add to buyer total (shown transparently at checkout)
   - `organizer`: deduct from organizer net
   - `split`: divide according to `buyer_percentage` / `organizer_percentage`
6. Add payment processor fee (Stripe: typically 2.9% + $0.30, varies by region)
7. Return breakdown:
   - `buyer_total` = gross + buyer_fees
   - `platform_revenue` = sum of platform fees
   - `organizer_net` = gross - platform_fees - organizer_fees - processor_fees
   - `processor_fees` = Stripe charges

**Audit Trail:**

- Every calculation logged to `platform_revenue_logs` with full formula breakdown
- Immutable records for financial reconciliation

---

#### 7.2 Inventory & Concurrency Management

**Challenge:** Prevent overselling when multiple users attempt to purchase last tickets simultaneously.

**Strategy: Pessimistic Locking with Redis**

1. User selects tickets and clicks "Add to cart"
2. Backend attempts to acquire Redis lock: `SET inventory:{ticket_type_id} {session_id} NX EX 600` (10 min TTL)
3. If lock acquired:
   - Increment `quantity_reserved` in database within transaction
   - Verify `quantity_reserved + quantity_sold < quantity_total`
   - If valid: create `ticket_inventory_locks` record, return success
   - If invalid: release lock, return "Sold out" or "Only X remaining"
4. If lock not acquired: retry with exponential backoff (max 3 attempts), then return availability error

**Checkout Validation:**

- Before payment intent creation, re-verify inventory with database `SELECT FOR UPDATE`
- If discrepancy between Redis and DB, trust DB and abort checkout

**Cleanup Job:**

- Scheduled every minute: find `ticket_inventory_locks` where `expires_at < NOW()`
- Release Redis locks, decrement `quantity_reserved`, delete lock records
- If associated order is `pending` and expired, mark as `expired`

**High-Demand Release Strategy:**

- For popular events, implement queue system (virtual waiting room)
- Users join queue, assigned random position or first-come-first-served
- Gradually admit users to purchase to prevent stampede

---

#### 7.3 Ticket Generation & QR Security

**PDF Generation Pipeline (Background Job):**

1. Trigger: `order:paid` event emitted after Stripe webhook confirmation
2. Job `GenerateTicketPdfJob` queued with `order_id`
3. For each ticket in order:
   - Generate `qr_token`: `HMAC-SHA256(uuid + secret_key + timestamp)` using platform secret
   - Encrypt token with AES-256-GCM, store ciphertext in `tickets.qr_token`
   - Generate QR code image (PNG/SVG) containing encrypted token
   - Render HTML template with event branding, ticket details, QR image, terms
   - Convert HTML to PDF using Puppeteer or Playwright (headless Chrome)
   - Upload PDF to S3, update `tickets.pdf_url`
4. Dispatch `SendTicketEmailJob` and `SendWhatsAppTicketJob`

**QR Code Security:**

- Token is encrypted and signed; raw UUID never exposed in QR
- Scanning app decrypts token using platform secret, verifies HMAC signature
- Token includes embedded timestamp to prevent replay attacks
- One-time use: database enforces `valid -> used` state transition with timestamp

**Anti-Fraud Measures:**

- Watermark on PDF with buyer name and order number
- Unique background pattern per ticket (subtle, hard to reproduce)
- Ticket number format includes checksum digit (Luhn algorithm)

---

### Phase 8: Background Jobs & Queue System

#### 8.1 Job Definitions

**`SendTicketEmailJob`**

- Priority: High
- Delay: 0 (immediate)
- Retries: 3 with exponential backoff
- Payload: `order_id`, `buyer_email`
- Action: Send HTML email with ticket PDF attachments, confirmation details, calendar invites

**`SendWhatsAppNotificationJob`**

- Priority: High
- Delay: 0 for confirmation, 24h before event for reminders
- Retries: 5 (Meta API can be flaky)
- Payload: `order_id`, `template_name`, `variables`
- Action: Call Meta Graph API, log response

**`GenerateTicketPdfJob`**

- Priority: Normal
- Delay: 0
- Retries: 2
- Payload: `order_id`
- Action: Generate PDFs for all tickets in order

**`CleanupExpiredLocksJob`**

- Priority: Normal
- Schedule: Every minute (cron: `* * * * *`)
- Action: Release expired inventory locks, cancel abandoned orders

**`EventReminderJob`**

- Priority: Normal
- Schedule: Daily at 9:00 AM local time
- Action: Find events starting in 24h, queue WhatsApp/email reminders for attendees

**`PayoutProcessingJob`**

- Priority: Normal
- Schedule: Weekly (configurable)
- Action: Calculate organizer balances, initiate bank transfers via payment API, mark payouts complete

#### 8.2 Queue Configuration

- Separate queues by priority: `critical`, `high`, `normal`, `low`
- Implement dead-letter queue for failed jobs after max retries
- Monitor via AdonisJS OpenTelemetry

---

### Phase 9: Payment Integration

#### 9.1 Mbiyopay Integration

**Checkout Flow:**
check the documentation on https://dashboard.mbiyo.africa/docs to find how to implement

**Webhook Handling (`POST /webhooks/mbiyopay`):**

- Verify Mbiyopay signature using endpoint secret
- Handle events:
  - `payment_intent.succeeded`: Mark order as `paid`, emit `order:paid` event, queue ticket generation and notifications
  - `payment_intent.payment_failed`: Mark order as `failed`, release inventory locks, notify buyer
  - `charge.refunded`: Mark order as `refunded`, invalidate tickets, notify buyer
  - `invoice.payment_succeeded` (for subscriptions, if applicable)

**Idempotency:**

- All webhook handlers check `payment_intent_id` uniqueness to prevent double-processing
- Database transactions ensure atomicity of order status updates

#### 9.2 Local Payment Methods (DRC Context)

- **Mobile Money:** Integrate local providers (Orange Money, Airtel Money, M-Pesa) via Stripe's local methods or direct API integration

---

### Phase 9.5: Event Boosts (Facebook/Instagram Ads)

#### 9.5.1 Overview

Event organizers can pay to promote their events through Meta Ads (Facebook, Instagram, Messenger). The platform acts as an intermediary, applying a configurable markup via fee rules and managing the full Meta campaign lifecycle.

#### 9.5.2 Architecture

```
Organizer creates boost (frontend form)
       |
       v
POST /dashboard/events/:id/boost  →  EventBoost record created (status=pending_payment)
       |
       v
POST /dashboard/boosts/pay  →  paymentStatus=paid, async Meta campaign launch enqueued
       |
       v
BoostLaunchService (background):
  1. uploadImage()        →  upload event cover → image hash
  2. createCampaign()     →  POST /act_{id}/campaigns  (objective=OUTCOME_TRAFFIC)
  3. createAdSet()        →  POST /act_{id}/adsets      (budget, targeting, placements)
  4. createCreative()     →  POST /act_{id}/adcreatives  (headline, text, CTA, link)
  5. createAd()           →  POST /act_{id}/ads          (activate)
       |
       v
EventBoost updated: meta_campaign_id, meta_adset_id, meta_ad_id saved, status=active
```

**On failure mid-sequence:** previously created Meta entities are cleaned up via `cleanupCreatedEntities()`.

#### 9.5.3 Database Schema (`event_boosts`)

| Column               | Type          | Purpose                        |
|----------------------|---------------|--------------------------------|
| id                   | uuid          | Primary key                    |
| event_id             | uuid FK       | Event being promoted           |
| organizer_id         | integer FK    | Organizer who created          |
| budget               | decimal(12,2) | Total budget (incl. markup)    |
| budget_type          | string(10)    | `daily` or `lifetime`          |
| currency             | string(3)     | USD, CDF, etc.                 |
| start_date           | timestamp     | Campaign start                 |
| end_date             | timestamp     | Campaign end (nullable)        |
| target_audience      | jsonb         | Countries, cities, age, languages |
| channels             | jsonb         | `["facebook","instagram","messenger"]` |
| headline             | string        | Ad headline (max 40 chars)     |
| primary_text         | text          | Ad body (max 125 chars)        |
| call_to_action       | string(30)    | LEARN_MORE, BOOK_NOW, etc.     |
| meta_campaign_id     | string        | Meta campaign ID               |
| meta_adset_id        | string        | Meta ad set ID                 |
| meta_ad_id           | string        | Meta ad ID                     |
| meta_ad_account_id   | string        | Meta ad account ID             |
| status               | string(20)    | pending_payment, launching, active, paused, completed, failed, cancelled |
| failure_reason       | text          | Error message if failed        |
| meta_impressions     | integer       | Cached impressions             |
| meta_clicks          | integer       | Cached clicks                  |
| meta_spent           | decimal(12,2) | Cached spend (Meta side)       |
| meta_ctr             | decimal(5,4)  | Cached CTR                     |
| meta_cpc             | decimal(10,4) | Cached CPC                     |
| last_synced_at       | timestamp     | Last insights sync             |
| payment_status       | string(20)    | pending, paid                  |
| payment_reference    | string        | Payment transaction ref        |
| fee_rule_id          | uuid FK       | Fee rule applied               |
| markup_amount        | decimal(12,2) | Platform markup                |
| meta_budget          | decimal(12,2) | Net amount sent to Meta        |

#### 9.5.4 API Routes

**Organizer (authenticated):**

| Method | Path | Action | Description |
|--------|------|--------|-------------|
| GET | `/dashboard/events/:id/boost` | create | Boost creation form |
| POST | `/dashboard/events/:id/boost` | store | Create boost record |
| POST | `/dashboard/boosts/pay` | pay | Pay and trigger async Meta launch |
| GET | `/dashboard/boosts` | index | List organizer's boosts |
| GET | `/dashboard/boosts/:id` | show | Boost detail with insights |
| GET | `/dashboard/boosts/:id/status` | status | JSON poll for launch status |
| POST | `/dashboard/boosts/:id/pause` | pause | Pause Meta campaign |
| POST | `/dashboard/boosts/:id/resume` | resume | Resume Meta campaign |

**Admin (auth + admin middleware):**

| Method | Path | Action | Description |
|--------|------|--------|-------------|
| GET | `/admin/boosts` | boosts | All boosts with organizer/event |
| POST | `/admin/boosts/:id/cancel` | cancelBoost | Cancel a boost |

**Webhook (public):**

| Method | Path | Action | Description |
|--------|------|--------|-------------|
| GET/POST | `/webhooks/meta-ads` | metaAds | Meta ad status notifications |

#### 9.5.5 MetaAdsService

Wraps the **Meta Graph API** (`graph.facebook.com`):

| Method | Description |
|--------|-------------|
| `createCampaign()` | Create ad campaign |
| `createAdSet()` | Create ad set with targeting/budget |
| `createCreative()` | Create ad creative |
| `createAd()` | Create and activate ad |
| `uploadImage()` | Upload image for creative |
| `getInsights()` | Fetch impressions, clicks, spend, CTR, CPC |
| `pauseCampaign()` | Pause campaign |
| `resumeCampaign()` | Resume campaign |
| `deleteCampaign()` | Delete campaign |
| `deleteAdSet()` | Delete ad set |
| `deleteAd()` | Delete ad |
| `cleanupCreatedEntities()` | Clean up partial creations on failure |
| `isConfigured()` | Check if Meta credentials are set |

**Rate limiting:** Built-in sliding window limiter (200 calls/60s per endpoint) to stay within Meta API limits.

**Retry:** Automatic retry with exponential backoff (up to 3 attempts) on transient errors (rate limits, timeouts, network failures).

#### 9.5.6 Pricing Service

`BoostPricingService` resolves fee rules where `appliesTo = 'boost'`:
1. First checks for an organizer-specific fee profile
2. Falls back to the default active fee rule
3. Supports `percentage` and `fixed` fee types with min/max caps
4. Calculates: `metaBudget = budget - markupAmount`

#### 9.5.7 Ace Commands

| Command | Description |
|---------|-------------|
| `node ace boost:sync-insights` | Sync Meta insights for all active boosts |
| `node ace boost:process-pending` | Retry boosts stuck in `pending_payment` (paid but not launched due to server restart) |

#### 9.5.8 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `META_ADS_AD_ACCOUNT_ID` | Yes | Meta ad account ID (e.g. `act_123456`) |
| `META_ADS_ACCESS_TOKEN` | Yes | Meta Graph API access token |
| `META_PAGE_ID` | Yes | Facebook page ID for ads |
| `META_ADS_APP_ID` | No | Meta app ID |
| `META_API_VERSION` | No | API version (default: `v22.0`) |
| `META_ADS_DEFAULT_CURRENCY` | No | Default currency (default: `USD`) |
| `META_ADS_DEFAULT_CTA` | No | Default call-to-action (default: `LEARN_MORE`) |
| `META_ADS_DEFAULT_BUDGET_TYPE` | No | `daily` or `lifetime` (default: `daily`) |
| `META_WEBHOOK_VERIFY_TOKEN` | No | Token for Meta webhook verification |

#### 9.5.9 Validation (VineJS)

- `storeBoostValidator`: Validates budget (1–50000), event UUID, budget type, start/end dates, channels, targeting (countries, cities, age, languages), headline, primary text, call-to-action
- `payBoostValidator`: Validates boost UUID

#### 9.5.10 Targeting Capabilities

- **Channels:** Facebook, Instagram, Messenger (multi-select)
- **Geo-targeting:** Countries + cities
- **Age range:** Configurable min/max (13–65)
- **Languages:** Locale targeting
- **Placements:** Facebook Feed, Instagram Feed, Instagram Story, Messenger Home, Facebook Marketplace

#### 9.5.11 Status Lifecycle

```
pending_payment → launching → active ⇄ paused
                     ↓           ↓
                   failed     completed
                                ↓
                             cancelled
```

Webhook from Meta can transition `launching` → `active` (confirmation) or `launching` → `failed` (ad disapproved).

---

### Phase 10: Security & Compliance

#### 10.1 QR Code & Ticket Security

- **Encryption:** All QR tokens encrypted with AES-256-GCM before storage
- **HMAC Signing:** Tokens signed with platform-wide secret key; scanning app verifies signature
- **State Machine:** Strict `valid -> used` transition with database constraint; no reverse allowed
- **Audit Logging:** Every scan logged with scanner ID, timestamp, GPS coordinates (if mobile), device info

#### 10.2 Data Protection

- **GDPR/CCPA Compliance:**
  - Explicit consent checkboxes for marketing communications
  - Data export functionality (download all personal data as JSON)
  - Data deletion request workflow (soft delete + anonymization after retention period)
  - Cookie consent banner with granular controls
- **Encryption at Rest:** PostgreSQL with TDE (Transparent Data Encryption) or application-level encryption for sensitive fields (tokens, payment details)
- **Encryption in Transit:** TLS 1.3 for all communications, HSTS headers

#### 10.3 Application Security

- **Rate Limiting:** Redis-based rate limiting per IP and per user (login attempts, API calls, checkout initiation)
- **CSRF Protection:** AdonisJS built-in CSRF tokens for all state-changing Edge routes; Inertia.js handles CSRF automatically
- **SQL Injection Prevention:** Lucid ORM parameterized queries exclusively; no raw SQL concatenation
- **XSS Prevention:** Edge auto-escapes output; React JSX auto-escapes; sanitize HTML in event descriptions using DOMPurify
- **Dependency Scanning:** Automated Snyk or Dependabot alerts for vulnerable npm packages

#### 10.4 Fraud Prevention

- **Velocity Checks:** Flag users purchasing > 10 tickets for same event within 1 hour
- **IP Geolocation:** Alert if buyer IP differs significantly from billing address
- **Stripe Radar:** Enable machine learning fraud detection for card payments
- **Duplicate Detection:** Prevent multiple accounts with same email/phone via normalization and fuzzy matching

---

### Phase 11: Performance & Scalability

#### 11.1 Caching Strategy

**Redis Cache Layers:**

- **Page Cache:** Edge-rendered homepage and event listings cached for 5 minutes (cache key: `page:home`, `page:events:{filters}`)
- **API Cache:** Event detail API responses cached for 2 minutes
- **Rate Limit Cache:** Sliding window counters per IP/user

**Cache Invalidation:**

- On event publish/approval: purge `page:home` and related category caches
- On ticket sale: decrement cached inventory or invalidate specific event cache
- Use cache tags for bulk invalidation

#### 11.2 Database Optimization

- **Indexes:**
  - `events`: `status + start_date`, `organizer_id`, `slug` (unique)
  - `ticket_types`: `event_id + status`
  - `orders`: `buyer_id + status`, `payment_intent_id` (unique)
  - `tickets`: `uuid` (unique), `qr_token` (unique), `event_id + status`
- **Partitioning:** Partition `orders` and `tickets` by `created_at` (monthly) for large datasets
- **Read Replicas:** Route analytics/reporting queries to read replicas; write operations to primary

#### 11.3 CDN & Asset Delivery

- **Static Assets:** Vite-built JS/CSS bundles served via CloudFront/Cloudflare with far-future cache headers
- **Media:** Event images and ticket PDFs stored in S3 with CloudFront distribution; signed URLs for private PDFs
- **Edge Functions:** Use Cloudflare Workers or Lambda@Edge for A/B testing, geolocation-based pricing, or bot detection

---

### Phase 12: Deployment & DevOps

#### 12.1 Environment Setup

**Development:**

- Docker Compose: PostgreSQL, Redis, MinIO (S3 mock), Mailpit (email catching)
- Hot reload for AdonisJS and Vite
- Ngrok or localtunnel for webhook testing (Stripe, Meta)

**Staging:**

- Mirror production architecture on smaller instances
- Mbiyopay Sandbox, Meta WhatsApp sandbox
- Seeded with synthetic data (1000 events, 100k orders)

**Production:**

- PostgreSQL via AWS RDS or Google Cloud SQL
- S3 for object storage
- Cloudflare for DNS, CDN, and DDoS protection

#### 12.2 CI/CD Pipeline

**GitHub Actions / GitLab CI:**

1. **Lint & Type Check:** ESLint, Prettier, TypeScript strict mode
2. **Test:** Unit tests (Jest/Vitest), integration tests (AdonisJS HTTP tests), E2E tests (Playwright)
3. **Build:** Vite production build, Docker image build
4. **Security Scan:** Trivy container scan, npm audit
5. **Deploy:** Helm chart deployment to Kubernetes with blue-green or canary strategy
6. **Smoke Tests:** Post-deployment health checks on critical endpoints

#### 12.3 Monitoring & Alerting

- **Metrics:** Prometheus + Grafana for request latency, error rates, queue depths, cache hit rates
- **Logs:** Centralized logging via ELK stack or Datadog; structured JSON logs from AdonisJS Pino
- **Traces:** OpenTelemetry distributed tracing across AdonisJS, PostgreSQL, Redis, and external APIs
- **Alerts:** PagerDuty or Opsgenie for:
  - Error rate > 1% for 5 minutes
  - Queue depth > 1000 jobs
  - Payment webhook failures
  - Meta API downtime
  - Database connection pool exhaustion

---

### Phase 13: Mobile & Progressive Web App

#### 13.1 PWA for Public Pages

- **Service Worker:** Cache static assets and offline page for event browsing
- **Manifest:** Installable app icon, theme color matching brand
- **Push Notifications:** Web Push API for event reminders (fallback to WhatsApp/SMS)

#### 13.2 Organizer Check-in App

- **Standalone PWA:** Installable on organizer smartphones
- **Camera Integration:** `getUserMedia` API for QR scanning
- **Offline Capability:** Service Worker caches event ticket data; syncs scans when online
- **Background Sync:** Queue scans during network outages, auto-upload when restored

---

### Phase 14: Localization & Regional Adaptations

#### 14.1 Democratic Republic of Congo (DRC) Specifics

- **Languages:** French (primary), (future i18n)
- **Currency:** Congolese Franc (CDF) primary, USD accepted for international events
- **Payment:** Mobile money dominance (Orange Money, Airtel Money); card penetration low
- **KYC:** Organizer verification may require additional business registration documents per local law
- **Connectivity:** Design for low-bandwidth; optimize images, enable offline check-in, use SMS fallback when WhatsApp fails

#### 14.2 International Expansion Ready

- **Multi-currency:** Store base prices in USD, convert display prices using real-time exchange rates API
- **Tax Handling:** Configurable tax rules per jurisdiction (VAT, sales tax, withholding tax)
- **Compliance:** GDPR (EU), CCPA (California), LGPD (Brazil) — data processing agreements and regional data residency options

---

### Phase 15: Launch & Post-Launch

#### 15.1 Soft Launch Checklist

- [ ] Admin fee rules configured with transparent pricing
- [ ] First organizer onboarded and event approved
- [ ] Stripe live mode activated, webhook endpoint verified
- [ ] Meta WhatsApp Business account verified, templates approved
- [ ] Google OAuth app verified (no "unverified app" warning)
- [ ] Load testing: simulate 1000 concurrent checkout attempts
- [ ] Security audit: penetration test by third party
- [ ] Disaster recovery: database backups tested, runbook documented

### Technology Versions Summary (as of June 2026)

| Component          | Version / Technology                   |
| ------------------ | -------------------------------------- |
| Backend Framework  | AdonisJS v7                            |
| Frontend Public    | Edge.js + Tailwind CSS v4              |
| Frontend Dashboard | React 19 + Inertia.js 3 + shadcn/ui    |
| Database           | PostgreSQL 16                          |
| Queue              |                                        |
| Validation         | VineJS                                 |
| ORM                | Lucid ORM                              |
| Bundler            | Vite 6                                 |
| Authentication     | Google OAuth 2.0 + Custom JWT sessions |
| Payments           | Mbiyopay                               |
| WhatsApp           | Meta Cloud API v21.0                   |
| Search             | Meilisearch 1.x                        |
| File Storage       | AWS S3 / MinIO                         |
