# UI Registry

> Established via `/imprint audit` on 2026-06-16.
> All UI components must match these baseline patterns.

## Baseline

| Property            | Correct class                                                               |
| ------------------- | --------------------------------------------------------------------------- |
| Card background     | `bg-card`                                                                   |
| Card border         | `border border-border`                                                      |
| Card radius         | `rounded-xl`                                                                |
| Button primary      | `.btn-primary` (bg-primary, text-primary-foreground, rounded-lg, h-9)       |
| Button outline      | `.btn-outline` (bg-transparent, border-border, rounded-lg, h-9)             |
| Button ghost        | `.btn-ghost` (bg-transparent, rounded-lg, h-9)                              |
| Button small        | `.btn-sm` (h-7, rounded-lg, px-2.5, text-[0.8rem])                          |
| Input               | `.input-field` (bg-background, border-input, rounded-lg, h-10)              |
| Select              | `.select-field` (inherits input-field, custom chevron)                      |
| Text — primary      | `text-foreground`                                                           |
| Text — secondary    | `text-muted-foreground`                                                     |
| Text — muted        | `text-muted-foreground` (smaller size or dimmer context)                    |
| Text — heading      | `font-heading`                                                              |
| Text — body         | `font-body`                                                                 |
| Badge — default     | `bg-primary text-primary-foreground rounded-4xl px-2 py-0.5 text-xs`        |
| Badge — success     | Use CSS var `var(--success)` — not `text-green-*`                           |
| Badge — destructive | `text-destructive`                                                          |
| Hover — btn         | `hover:brightness-90` (primary), `hover:bg-muted` (ghost/outline)           |
| Hover — card        | `.card-hover` (translateY(-4px) + shadow)                                   |
| Focus               | `focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring` |
| Shadow — card       | none (uses border)                                                          |
| Shadow — modal      | `shadow-2xl`                                                                |

## Components

### Primary Button (Edge `.btn-primary`)

File: `resources/css/app.css`
Last updated: 2026-06-16

| Property      | Class                                                   |
| ------------- | ------------------------------------------------------- |
| Background    | `var(--primary)` / `bg-primary`                         |
| Text          | `var(--primary-foreground)` / `text-primary-foreground` |
| Border radius | `rounded-lg` (0.5rem)                                   |
| Font          | `font-semibold text-sm`                                 |
| Min-height    | `2.25rem` (sm), `2.75rem` (default)                     |
| Padding       | `0.5rem 1rem` (sm), `0.625rem 1.25rem` (default)        |
| Hover         | `brightness(0.9)`, translateY(-1px), shadow             |
| Active        | `scale(0.97)`                                           |
| Disabled      | `opacity-50 cursor-not-allowed`                         |

**Pattern notes:**
Edge `.btn-primary` radius CHANGED from 0.625rem to 0.5rem to match shadcn Button `rounded-lg`. Use `.btn-sm` for compact contexts (tables, inline actions).

### Card (Edge)

File: `resources/views/events/index.edge`, `resources/views/home.edge`
Last updated: 2026-06-16

| Property       | Class                                                               |
| -------------- | ------------------------------------------------------------------- |
| Background     | `bg-card`                                                           |
| Border         | `border border-border`                                              |
| Border radius  | `rounded-xl`                                                        |
| Padding        | `p-5`                                                               |
| Text — title   | `font-heading text-lg font-semibold`                                |
| Text — meta    | `text-muted-foreground text-sm`                                     |
| Text — price   | `text-xl font-bold font-heading`                                    |
| Category badge | `text-[11px] font-semibold uppercase tracking-[0.8px] text-primary` |
| Hover          | `.card-hover` (translateY(-4px), shadow)                            |

### Input Field (Edge `.input-field`)

File: `resources/css/app.css`
Last updated: 2026-06-16

| Property      | Class                                                       |
| ------------- | ----------------------------------------------------------- |
| Background    | `bg-background` / `var(--background)`                       |
| Border        | `border-input` / `1px solid var(--input)`                   |
| Border radius | `rounded-lg` (0.5rem)                                       |
| Min-height    | `2.5rem` (40px) — use `min-h-11` (44px) for touch targets   |
| Padding       | `0.625rem 0.875rem`                                         |
| Text          | `text-sm text-foreground`                                   |
| Placeholder   | `text-muted-foreground`                                     |
| Focus         | `border-ring` + `box-shadow: 0 0 0 3px rgba(225,29,72,0.1)` |

**Pattern notes:**
Radius CHANGED from 0.625rem to 0.5rem (rounded-lg) to match shadcn Input.

### Modal

File: `resources/views/events/show.edge`, `inertia/components/ui/dialog.tsx`
Last updated: 2026-06-16

| Property  | Class                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| Overlay   | `bg-black/40 backdrop-blur-sm fixed inset-0`                                                                |
| Content   | `bg-card border border-border rounded-xl p-6 sm:p-8`                                                        |
| Shadow    | `shadow-2xl`                                                                                                |
| Animation | `motion-safe:animate-[modalIn_0.3s_ease-out]` (Edge) / `data-open:animate-in data-open:zoom-in-95` (shadcn) |
| Max-width | `max-w-md`                                                                                                  |

### Filter Bar

File: `resources/views/events/index.edge`
Last updated: 2026-06-16

| Property     | Class                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| Container    | `bg-card border border-border rounded-xl p-4 sm:p-5`                         |
| Label        | `text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground` |
| Input/Select | `.input-field min-h-11`, `.select-field min-h-11`                            |
| Button       | `.btn-primary min-h-11`                                                      |
| Layout       | `flex flex-col sm:flex-row gap-3 items-stretch sm:items-end`                 |

### Page Title Section

File: `resources/views/events/index.edge`
Last updated: 2026-06-16

| Property  | Class                                        |
| --------- | -------------------------------------------- |
| Title     | `font-heading text-[clamp(28px,3.5vw,38px)]` |
| Subtitle  | `text-muted-foreground text-sm mt-1`         |
| Container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`     |

### Pagination

File: `resources/views/events/index.edge`
Last updated: 2026-06-16

| Property      | Class                                                            |
| ------------- | ---------------------------------------------------------------- |
| Container     | `flex justify-center items-center gap-2 py-12 flex-wrap`         |
| Active page   | `.btn-primary.btn-sm min-w-[38px] justify-center cursor-default` |
| Inactive page | `.btn-outline.btn-sm min-w-[38px] justify-center`                |
| Prev/Next     | `.btn-outline.btn-sm` with inline SVG arrows                     |

### Empty State

File: `resources/views/events/index.edge`
Last updated: 2026-06-16

| Property    | Class                                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| Icon circle | `w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6` |
| Title       | `font-body text-xl font-semibold mb-2`                                          |
| Text        | `text-muted-foreground`                                                         |
| Container   | `text-center py-20 px-4`                                                        |

### CountrySelect (Multiselect Dropdown)

File: `inertia/components/country_select.tsx`
Last updated: 2026-06-25

| Property         | Trigger (button)                                   | Dropdown                |
| ---------------- | -------------------------------------------------- | ----------------------- |
| Background       | `bg-background`                                    | `bg-card`               |
| Border           | `border border-input`                              | `border border-border`  |
| Border radius    | `rounded-lg`                                       | `rounded-lg`            |
| Min-height       | `min-h-10`                                         | —                       |
| Padding          | `px-3 py-2`                                        | —                       |
| Font             | `text-sm`                                          | `text-sm`               |
| Shadow           | none                                               | `shadow-lg`             |
| Focus            | `focus:ring-2 focus:ring-ring focus:ring-offset-2` | —                       |
| Open state       | `border-ring`                                      | —                       |
| Empty/muted text | `text-muted-foreground`                            | `text-muted-foreground` |

**List items:**
| Property | Class |
|---|---|
| Padding | `px-3 py-2` |
| Gap | `gap-2` |
| Hover | `hover:bg-muted` |
| Selected bg | `bg-primary/5` |
| Checkbox | `h-4 w-4 rounded border-input text-primary focus:ring-primary` |
| Selected checkmark | SVG 14×14, strokeWidth 2.5, `text-primary` |

**Chips (selected in trigger):**
| Property | Class |
|---|---|
| Background | `bg-primary/10` |
| Text | `text-primary text-xs font-medium` |
| Radius | `rounded` |
| Padding | `px-2 py-0.5` |

**Removable badges (in dropdown bar):**
Uses `<Badge variant="default">` with `cursor-pointer gap-1 pr-1 text-xs` and inline × SVG (12×12).

**Pattern notes:**
Dropdown triggers use `border-input` (input-style border, matching `.input-field`) to visually communicate "this is a form control". The dropdown panel uses `border-border` (card-style). This distinction is intentional — triggers look like inputs, panels look like cards. Selected item chips use `bg-primary/10` (10% opacity primary background) rather than full `bg-primary` to keep them subtle within the trigger area — reserve full `bg-primary` badges for data display contexts.

### TipTap Email Editor

File: `inertia/components/email_editor.tsx`
Last updated: 2026-06-25

| Property            | Class                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Dialog max-width    | `max-w-3xl`                                                                                                                          |
| Toolbar container   | `border rounded-lg overflow-hidden`                                                                                                  |
| Toolbar bg          | `bg-muted/20`                                                                                                                        |
| Toolbar buttons     | `inline-flex items-center justify-center rounded h-7 w-7 text-sm hover:bg-muted`                                                     |
| Toolbar active      | `bg-muted text-primary`                                                                                                              |
| Toolbar separators  | `w-px h-5 bg-border mx-1`                                                                                                            |
| Editor area         | `prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none`                                                               |
| Variable button     | `rounded bg-background border border-border px-2 py-0.5 text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary` |
| Save/cancel buttons | `justify-end gap-2` (right-aligned)                                                                                                  |

**Pattern notes:**
TipTap editor instance uses `immediatelyRender={false}` to avoid SSR hydration mismatch. The TipTap extensions used: StarterKit (bold/italic/strike/code/heading), Placeholder, Link, TextAlign. Heading levels limited to 1-3. The editor content area uses Tailwind Typography's `prose` class for default text styling.

### WhatsApp Markdown Editor

File: `inertia/components/whatsapp_editor.tsx`
Last updated: 2026-06-25

| Property         | Class                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dialog max-width | `max-w-3xl`                                                                                                                                                     |
| Textarea         | `w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:border-ring focus:ring-3 focus:ring-ring/50` |
| Preview panel    | `rounded-lg border border-border bg-card p-4 text-sm min-h-[300px] whitespace-pre-wrap`                                                                         |
| Format buttons   | `inline-flex items-center rounded border border-border px-2 py-1 text-xs hover:bg-muted`                                                                        |
| Variable button  | Same as Email editor variable buttons                                                                                                                           |
| Layout           | `grid grid-cols-1 lg:grid-cols-2 gap-4` (textarea + preview side by side)                                                                                       |

**Pattern notes:**
WhatsApp uses Markdown-like formatting: `*bold*`, `_italic_`, `~strikethrough~`, ` ```code``` `. The preview renders these as HTML via a simple regex-based `renderMarkdownPreview()` function. No third-party Markdown library needed since WhatsApp's formatting syntax is minimal. Character counter shown below textarea.

### Tabs (shadcn base-ui)

File: `inertia/components/ui/tabs.tsx`
Last updated: 2026-06-25 (fixed `data-[orientation=horizontal]` selector)

| Property       | Class                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Root           | `group/tabs flex gap-2 data-[orientation=horizontal]:flex-col`                                                                      |
| List           | `group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground bg-muted`                   |
| Trigger        | `inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center rounded-md px-1.5 py-0.5 text-sm font-medium text-foreground/60` |
| Trigger active | `data-active:bg-background data-active:text-foreground data-active:shadow-sm`                                                       |
| Trigger hover  | `hover:text-foreground`                                                                                                             |
| Content        | `flex-1 text-sm outline-none`                                                                                                       |

**Pattern notes:**
Uses `@base-ui/react/tabs` (not Radix). The `data-[orientation=horizontal]` Tailwind variant is critical — the base-ui component sets `data-orientation="horizontal"` (not a separate `data-horizontal` attribute). Must use `group-data-[orientation=horizontal]/tabs:` for child element orientation-dependent styling, NOT `group-data-horizontal/tabs:` which would never match.

File: `resources/views/events/show.edge`, `inertia/pages/dashboard/organizer/analytics.tsx`
Last updated: 2026-06-25

| Property         | Edge (ghost, inline)                        | Inertia (outline, standalone)             |
| ---------------- | ------------------------------------------- | ----------------------------------------- |
| Variant          | `.btn-ghost.btn-sm`                         | `variant="outline" size="sm"`             |
| Border radius    | `rounded-lg`                                | `rounded-lg` (via shadcn Button)          |
| Text             | `text-muted-foreground`                     | default outline text                      |
| Hover            | `hover:text-foreground`                     | `hover:bg-muted hover:text-foreground`    |
| Icon size        | 16×16, strokeWidth 2                        | 14×14, strokeWidth 2                      |
| Gap (icon-label) | `gap-1.5` on container                      | `mr-1.5` on icon                          |
| Font             | `text-sm font-medium` (via .btn-sm)         | `text-[0.8rem] font-medium` (via size=sm) |
| Min-height       | `min-h-9` (36px)                            | `h-7`                                     |
| Padding          | `px-3`                                      | `px-2.5`                                  |
| Confirmation     | inline `<span>` with `text-success text-xs` | `toast.success()` (sonner)                |

**Pattern notes:**
Ghost variant used when inline with a title or heading (so it blends in). Outline variant used when grouped with other standalone buttons (cards, toolbars, action bars). Both use the link SVG icon (chain-link style from Lucide) at 2px stroke. Confirmation styling references `text-success` CSS var — do NOT use `text-green-*`.

### Boost Create Page

File: `inertia/pages/dashboard/organizer/boost_create.tsx`
Last updated: 2026-06-30

| Property          | Class                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------- |
| Page container    | `max-w-5xl mx-auto py-8 px-4`                                                         |
| Page title        | `<h1 className="text-2xl font-heading mb-2">`                                         |
| Page subtitle     | `<p className="text-muted-foreground mb-8">`                                          |
| Layout            | `grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8` (form + sticky preview sidebar)     |
| Form card         | Standard `<Card>` + `<CardHeader><CardTitle>` + `<CardContent className="flex flex-col gap-4">` |
| Budget presets    | `<Button variant="default|outline" size="sm">` (toggle-style, inline flex gap-2)      |
| Channel toggles   | `<Button variant="default|outline" size="sm">` (same toggle pattern as budget)        |
| Raw select (CTA)  | `flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm`     |
| Create CTA button | `<Button size="lg">` at bottom of preview sidebar                                     |

**Pattern notes:**
Budget presets and channel toggles share the same toggle-button pattern (default = selected, outline = unselected, `size="sm"`). Grid layout places form on the left and a sticky preview sidebar (400px) on the right. Raw selects in this page use `h-10` — the standard height for raw selects across the entire project (NOT `h-8` which is the shadcn Input height). The CTA select (`#cta`) does NOT use the shadcn `Select` component but a raw `<select>` with inline classes matching all other forms in the project.

**Important — overflow clipping with dropdowns:** The shadcn Card component has `overflow-hidden` in its base class (for rounded image clipping). When a Card contains a dropdown component (like CountrySelect), the `overflow-hidden` clips the absolutely-positioned dropdown panel. Fix: add `overflow-visible` to the Card's `className` prop. Example: `<Card className="overflow-visible">`. Only apply to cards that contain dropdowns — cards without dropdowns should keep the default `overflow-hidden` for proper image clipping.

### Boost Show Page

File: `inertia/pages/dashboard/organizer/boost_show.tsx`
Last updated: 2026-06-30

| Property         | Class                                                                                |
| ---------------- | ------------------------------------------------------------------------------------ |
| Page container   | `max-w-5xl mx-auto py-8 px-4`                                                        |
| Header row       | `flex items-center justify-between mb-8 flex-wrap gap-4`                              |
| Title            | `<h1 className="text-2xl font-heading mb-1">`                                        |
| Status badge     | `<Badge variant={boostStatusVariant[status] || 'outline'}>` — see Boost Status Badge |
| Action buttons   | `<Button variant="outline" size="sm">` in `flex gap-2`                                |
| Metrics grid     | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8`                          |
| Metric card      | `<Card>` with `<CardHeader className="pb-2">`                                         |
| Metric label     | `<CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">` |
| Metric value     | `<p className="text-2xl font-heading">`                                               |
| Metric subtitle  | `<p className="text-xs text-muted-foreground mt-0.5">` (below value, optional)        |
| Detail section   | `grid grid-cols-1 lg:grid-cols-2 gap-6`                                               |
| Detail card      | `<Card>` + `<CardHeader><CardTitle>` + `<CardContent className="flex flex-col gap-3 text-sm">` |
| Detail row       | `<div className="flex justify-between">` + `<span className="text-muted-foreground">` label + `<span>` value |
| Link             | `<a className="text-primary hover:underline" target="_blank">`                        |

**Pattern notes:**
Metrics are displayed as compact stat cards with uppercase tracking-wider labels and large heading-font values. The 5-column grid collapses to 3 then 2 on smaller screens. Detail rows use a consistent `flex justify-between` pattern with muted-foreground labels on the left and values on the right. The `font-mono text-xs` class is used for technical IDs (Meta campaign/ad set/ad IDs).

### Boost List (Organizer)

File: `inertia/pages/dashboard/organizer/boosts.tsx`
Last updated: 2026-06-30

| Property         | Class                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| Page container   | `max-w-5xl mx-auto py-8 px-4`                                           |
| Page title       | `<h1 className="text-2xl font-heading mb-2">`                           |
| Page subtitle    | `<p className="text-muted-foreground mb-8">`                            |
| Empty state      | `<Card><CardContent className="py-12 text-center text-muted-foreground">` |
| Table wrapper    | `rounded-lg border`                                                     |
| Table            | Standard shadcn `<Table>`                                               |
| Event link       | `<a className="font-medium hover:text-primary transition-colors">`       |
| Status badge     | `<Badge variant={...}>` — status logic matches boostStatusVariant map    |
| Financial cells  | `className="text-sm"` with `$` prefix                                   |
| Number cells     | `className="text-sm"` with `.toLocaleString()`                          |
| CTR cell         | `className="text-sm"` with `Number(...).toFixed(2)%`                    |

**Pattern notes:**
The event name links to the boost detail page (`/dashboard/boosts/${b.id}`). Empty state uses a padded Card with centered muted text. The status badge logic is slightly simplified here (only checks active/failed/default) — should ideally use `boostStatusVariant` for full consistency.

### Admin Boost Table

File: `inertia/pages/admin/boosts.tsx`
Last updated: 2026-06-30

| Property       | Class                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------- |
| Root wrapper   | `<div>` (no container class — admin layout provides wrapping)                                  |
| Page title     | `<h1 className="text-2xl font-heading mb-6">` (admin pattern: no subtitle)                     |
| Table wrapper  | `rounded-lg border`                                                                           |
| Table          | Standard shadcn `<Table>`                                                                     |
| Empty state    | `<TableCell colSpan={9} className="text-center py-8 text-muted-foreground">`                   |
| Event cell     | `className="font-medium text-sm"`                                                              |
| Data cells     | `className="text-sm"`                                                                          |
| Status badge   | `<Badge variant={boostStatusVariant[b.status] || 'outline'}>` — uses shared `boostStatusVariant` |
| Cancel button  | `<Button type="submit" variant="destructive" size="sm">` inside a `<form>` (POST with confirm) |

**Pattern notes:**
Follows the admin page heading convention: `text-2xl font-heading mb-6` with NO subtitle — this is the standard across all admin pages. Empty state uses a single TableCell with `colSpan` spanning all columns. The cancel button is a destructive `size="sm"` button wrapped in a form for POST submission.

### Boost Status Badge

File: `inertia/lib/boost_status.ts`
Last updated: 2026-06-30

| Status            | Badge variant |
| ----------------- | ------------- |
| `active`          | `default`     |
| `pending_payment` | `outline`     |
| `launching`       | `outline`     |
| `paused`          | `secondary`   |
| `completed`       | `secondary`   |
| `failed`          | `destructive` |
| `cancelled`       | `destructive` |

**Pattern notes:**
Shared constant `boostStatusVariant` used by `boost_show.tsx` and `admin/boosts.tsx`. All status maps MUST import from `~/lib/boost-status` — never redefine inline. The Badge component itself uses shadcn standard: `rounded-4xl h-5 text-xs font-medium`.

### Boost Preview Card

File: `inertia/pages/dashboard/organizer/boost_create.tsx`
Last updated: 2026-06-30

| Property         | Class                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------- |
| Section label    | `text-xs uppercase tracking-wider text-muted-foreground font-semibold`                   |
| Preview card     | `bg-muted rounded-lg overflow-hidden`                                                    |
| Cover image      | `w-full aspect-[1.91/1] object-cover`                                                    |
| Cover fallback   | `w-full aspect-[1.91/1] flex items-center justify-center text-3xl font-heading text-primary bg-secondary` |
| Card body        | `p-4 flex flex-col gap-2`                                                                |
| Headline         | `text-sm font-semibold`                                                                  |
| Body text        | `text-xs text-muted-foreground`                                                          |
| Link             | `text-xs font-semibold text-primary hover:underline`                                     |
| CTA button       | `inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-8 px-4 text-xs font-medium self-start` |

**Pattern notes:**
The preview card simulates a Facebook Feed ad appearance. The CTA button uses `rounded-lg` (not `rounded-4xl` like shadcn Badge) to match Facebook's ad button style — this is intentional and specific to Facebook ad preview. The 1.91:1 aspect ratio matches Meta's recommended image dimensions. The fallback shows the event initial letter in `text-primary` on `bg-secondary` when no cover image is available.
