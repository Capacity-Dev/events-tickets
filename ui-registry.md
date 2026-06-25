# UI Registry

> Established via `/imprint audit` on 2026-06-16.
> All UI components must match these baseline patterns.

## Baseline

| Property | Correct class |
|---|---|
| Card background | `bg-card` |
| Card border | `border border-border` |
| Card radius | `rounded-xl` |
| Button primary | `.btn-primary` (bg-primary, text-primary-foreground, rounded-lg, h-9) |
| Button outline | `.btn-outline` (bg-transparent, border-border, rounded-lg, h-9) |
| Button ghost | `.btn-ghost` (bg-transparent, rounded-lg, h-9) |
| Button small | `.btn-sm` (h-7, rounded-lg, px-2.5, text-[0.8rem]) |
| Input | `.input-field` (bg-background, border-input, rounded-lg, h-10) |
| Select | `.select-field` (inherits input-field, custom chevron) |
| Text — primary | `text-foreground` |
| Text — secondary | `text-muted-foreground` |
| Text — muted | `text-muted-foreground` (smaller size or dimmer context) |
| Text — heading | `font-heading` |
| Text — body | `font-body` |
| Badge — default | `bg-primary text-primary-foreground rounded-4xl px-2 py-0.5 text-xs` |
| Badge — success | Use CSS var `var(--success)` — not `text-green-*` |
| Badge — destructive | `text-destructive` |
| Hover — btn | `hover:brightness-90` (primary), `hover:bg-muted` (ghost/outline) |
| Hover — card | `.card-hover` (translateY(-4px) + shadow) |
| Focus | `focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring` |
| Shadow — card | none (uses border) |
| Shadow — modal | `shadow-2xl` |

## Components

### Primary Button (Edge `.btn-primary`)

File: `resources/css/app.css`
Last updated: 2026-06-16

| Property | Class |
|---|---|
| Background | `var(--primary)` / `bg-primary` |
| Text | `var(--primary-foreground)` / `text-primary-foreground` |
| Border radius | `rounded-lg` (0.5rem) |
| Font | `font-semibold text-sm` |
| Min-height | `2.25rem` (sm), `2.75rem` (default) |
| Padding | `0.5rem 1rem` (sm), `0.625rem 1.25rem` (default) |
| Hover | `brightness(0.9)`, translateY(-1px), shadow |
| Active | `scale(0.97)` |
| Disabled | `opacity-50 cursor-not-allowed` |

**Pattern notes:**
Edge `.btn-primary` radius CHANGED from 0.625rem to 0.5rem to match shadcn Button `rounded-lg`. Use `.btn-sm` for compact contexts (tables, inline actions).

### Card (Edge)

File: `resources/views/events/index.edge`, `resources/views/home.edge`
Last updated: 2026-06-16

| Property | Class |
|---|---|
| Background | `bg-card` |
| Border | `border border-border` |
| Border radius | `rounded-xl` |
| Padding | `p-5` |
| Text — title | `font-heading text-lg font-semibold` |
| Text — meta | `text-muted-foreground text-sm` |
| Text — price | `text-xl font-bold font-heading` |
| Category badge | `text-[11px] font-semibold uppercase tracking-[0.8px] text-primary` |
| Hover | `.card-hover` (translateY(-4px), shadow) |

### Input Field (Edge `.input-field`)

File: `resources/css/app.css`
Last updated: 2026-06-16

| Property | Class |
|---|---|
| Background | `bg-background` / `var(--background)` |
| Border | `border-input` / `1px solid var(--input)` |
| Border radius | `rounded-lg` (0.5rem) |
| Min-height | `2.5rem` (40px) — use `min-h-11` (44px) for touch targets |
| Padding | `0.625rem 0.875rem` |
| Text | `text-sm text-foreground` |
| Placeholder | `text-muted-foreground` |
| Focus | `border-ring` + `box-shadow: 0 0 0 3px rgba(225,29,72,0.1)` |

**Pattern notes:**
Radius CHANGED from 0.625rem to 0.5rem (rounded-lg) to match shadcn Input.

### Modal

File: `resources/views/events/show.edge`, `inertia/components/ui/dialog.tsx`
Last updated: 2026-06-16

| Property | Class |
|---|---|
| Overlay | `bg-black/40 backdrop-blur-sm fixed inset-0` |
| Content | `bg-card border border-border rounded-xl p-6 sm:p-8` |
| Shadow | `shadow-2xl` |
| Animation | `motion-safe:animate-[modalIn_0.3s_ease-out]` (Edge) / `data-open:animate-in data-open:zoom-in-95` (shadcn) |
| Max-width | `max-w-md` |

### Filter Bar

File: `resources/views/events/index.edge`
Last updated: 2026-06-16

| Property | Class |
|---|---|
| Container | `bg-card border border-border rounded-xl p-4 sm:p-5` |
| Label | `text-[11px] font-semibold uppercase tracking-[0.5px] text-muted-foreground` |
| Input/Select | `.input-field min-h-11`, `.select-field min-h-11` |
| Button | `.btn-primary min-h-11` |
| Layout | `flex flex-col sm:flex-row gap-3 items-stretch sm:items-end` |

### Page Title Section

File: `resources/views/events/index.edge`
Last updated: 2026-06-16

| Property | Class |
|---|---|
| Title | `font-heading text-[clamp(28px,3.5vw,38px)]` |
| Subtitle | `text-muted-foreground text-sm mt-1` |
| Container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |

### Pagination

File: `resources/views/events/index.edge`
Last updated: 2026-06-16

| Property | Class |
|---|---|
| Container | `flex justify-center items-center gap-2 py-12 flex-wrap` |
| Active page | `.btn-primary.btn-sm min-w-[38px] justify-center cursor-default` |
| Inactive page | `.btn-outline.btn-sm min-w-[38px] justify-center` |
| Prev/Next | `.btn-outline.btn-sm` with inline SVG arrows |

### Empty State

File: `resources/views/events/index.edge`
Last updated: 2026-06-16

| Property | Class |
|---|---|
| Icon circle | `w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6` |
| Title | `font-body text-xl font-semibold mb-2` |
| Text | `text-muted-foreground` |
| Container | `text-center py-20 px-4` |

### Secondary Icon Button (Copy / Share)

File: `resources/views/events/show.edge`, `inertia/pages/dashboard/organizer/analytics.tsx`
Last updated: 2026-06-25

| Property | Edge (ghost, inline) | Inertia (outline, standalone) |
|---|---|---|
| Variant | `.btn-ghost.btn-sm` | `variant="outline" size="sm"` |
| Border radius | `rounded-lg` | `rounded-lg` (via shadcn Button) |
| Text | `text-muted-foreground` | default outline text |
| Hover | `hover:text-foreground` | `hover:bg-muted hover:text-foreground` |
| Icon size | 16×16, strokeWidth 2 | 14×14, strokeWidth 2 |
| Gap (icon-label) | `gap-1.5` on container | `mr-1.5` on icon |
| Font | `text-sm font-medium` (via .btn-sm) | `text-[0.8rem] font-medium` (via size=sm) |
| Min-height | `min-h-9` (36px) | `h-7` |
| Padding | `px-3` | `px-2.5` |
| Confirmation | inline `<span>` with `text-success text-xs` | `toast.success()` (sonner) |

**Pattern notes:**
Ghost variant used when inline with a title or heading (so it blends in). Outline variant used when grouped with other standalone buttons (cards, toolbars, action bars). Both use the link SVG icon (chain-link style from Lucide) at 2px stroke. Confirmation styling references `text-success` CSS var — do NOT use `text-green-*`.
