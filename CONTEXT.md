# CONTEXT.md

Business context for Ulrex General Contracting. `CLAUDE.md` covers *how the code
works*; this file covers *who the business is and what it wants*. Read both.

Anything marked **[unconfirmed]** has not been verified with the client yet — do
not present it publicly on the site until it is.

## Identity

| | |
| --- | --- |
| **Business name** | Ulrex General Contracting |
| **Short brand** | Ulrex (header lockup: `ULREX` / `GENERAL CONTRACTING`) |
| **Domain** | [ulrexgc.com](https://ulrexgc.com) |
| **Email** | info@ulrexgc.com |
| **Phone** | +1 (210) 956-7200 |
| **Tagline** | Building. Innovating. Excellence. |
| **Positioning line** | Built with intent. Finished with pride. |

"Ulrex General Contracting" is the correct, current name. The original client
brief in `PROMPT.md` calls the company **"Ulrick Elite General Contracting"** —
that name is **outdated**. Do not reintroduce it anywhere in copy, metadata, or
assets.

## What they do

A full-service general contractor working both residential and commercial
scopes. Five service lines, in the order they appear on the site:

1. **Residential remodeling & additions** — kitchens, bathrooms, additions,
   whole-home updates.
2. **Commercial construction** — retail build-outs, office environments, tenant
   improvements, scheduled around the client's operating hours.
3. **Roofing & exterior restoration** — roofing, siding, framing repairs,
   storm-damage mitigation.
4. **Specialty & custom work** — custom cabinetry, concrete, driveways,
   structural modifications, house leveling, complex one-offs.
5. **Residential painting** — interior and exterior, prep-heavy process,
   premium coatings.

Storm/insurance restoration is a real revenue line, not a footnote — South Texas
hail and wind work sits behind service line 3.

## Where they operate

- **Based in San Antonio, Texas.** The 210 area code on the contact number is
  the anchor for this.
- **Service area:** San Antonio metro plus the surrounding region — nearby Hill
  Country and the I-35 corridor.
- No street address is published on the site today. **[unconfirmed]** whether
  there is a public office/yard address to add; needed if local SEO or a Google
  Business Profile is pursued.

## Who they serve

- **Homeowners** in the San Antonio area planning a remodel, addition, roof
  replacement, or repaint — often after storm damage.
- **Commercial tenants and property owners** needing build-outs and tenant
  improvements delivered on an operating schedule.
- **Bilingual market.** The site ships English and Spanish side by side and the
  contact section advertises "English + Spanish" service. This is a deliberate
  commercial decision for the San Antonio market, not a nicety — every piece of
  copy added anywhere must exist in both languages.

## How they want to sound

The differentiator the site sells is **process and communication**, not price and
not scale. Recurring themes across the copy:

- Clarity over chaos — align the scope, say what comes next, surface problems
  before they become surprises.
- Finish-minded — details planned from day one, not patched at the end.
- Accountable — clear updates, honest answers, respect for the property.
- Craft — "Built like our name is on it. Because it is."

Tone is confident and plainspoken. Short declaratives. No superlative-stacking,
no "#1 in Texas", no exclamation points, no hard-sell urgency. Spanish copy is
written natively, not translated word-for-word — match that register.

Visual identity: navy `#061426`, gold `#d6aa55` / `#e2be6c`, paper `#f3efe7`;
blueprint-grid textures, mono uppercase eyebrows with wide tracking, and a
hand-built three.js house that assembles in five construction stages. The
aesthetic is meant to read premium-industrial — a contractor you'd hire for a
$200k remodel, not a handyman listing.

## Current state of the site

Single-page static marketing site (Next.js static export, hosted on Hostinger).
Sections: Header → Hero → Services → About → Projects → Reviews → Contact →
Footer. There is **no backend, no form, and no lead capture** — the only
conversion paths today are the `mailto:` and `tel:` links.

### Content authenticity — important

**The projects and reviews currently on the site are placeholder.** All of it:

- Project case studies ("The Gather Kitchen", "Commerce Reframed",
  "Weatherproof Renewal", "Built Beyond Standard", "A Cleaner Canvas") in
  `components/home-page.tsx`.
- Every testimonial and client name in `components/ui/marquee-01.tsx`
  (M. Reynolds, J. Castillo, A. Thompson, S. Walker, D. Bennett, R. Morgan).
- The stock imagery in `public/` (`kitchen.webp`, `commercial.webp`,
  `roofing.webp`, `craft.webp`, `painting.webp`, `team.webp`).

Treat these as filler awaiting real client material. Do not add new invented
testimonials, client names, project names, star ratings, review counts, years of
experience, or "projects completed" figures — fabricated social proof is the one
thing that can actually damage the business. When real content arrives, it
replaces this wholesale.

Also **[unconfirmed]** and therefore absent from the site: Texas license
numbers, insurance/bonding details, trade certifications, founding year, crew
size, ownership, and business hours. These are standard trust signals for a
contractor site and are worth collecting from the client.

## Direction

**Next milestone: a lead intake form that feeds a CRM.**

Per `TODO.md`, the form section of
[restorerightcontractors.com](https://restorerightcontractors.com/) is the
reference for the component — a multi-step quote/intake flow. The form is the
component the CRM will be built around and the source it pulls lead data from.

The immediate architectural tension to solve: the site is a **hard static
export** (`output: "export"`, no route handlers, no server actions, no
middleware — see `CLAUDE.md`). A form that submits therefore needs either a
third-party endpoint, an external API, or a change to the hosting model. Decide
this before building the UI, because it determines whether Hostinger static
hosting survives.

Longer term, and not yet scheduled: replacing placeholder content with real
projects and reviews, and local SEO for the San Antonio service area.

## Open questions for the client

1. Public business address, and whether a Google Business Profile exists.
2. Texas license number(s), insurance and bonding details, trade certifications.
3. Founding year, ownership, crew size — the "About" section currently has no
   concrete facts to stand on.
4. Business hours, and whether emergency/storm response is offered after hours.
5. Real project photography and permission to use client names in testimonials.
6. Where leads should land: an existing CRM, a shared inbox, or a system to be
   built.
