# Retouch Africa — Full Site Build

## Context

`website-snapshot.PNG` is the design reference for **Retouch Africa**, a creative community/education platform for African retouchers, photographers, and digital artists (workshops, mentorship, community) — not a solo photographer's portfolio. The working directory is currently empty (no repo, no code): this is a **greenfield build**.

Confirmed decisions (already agreed with user, not open for re-debate):
- Build the full site: Home, About, Workshop, Facilitators, Gallery, Partners, Community, Contact, plus a password-protected `/admin`.
- Placeholder content/images for now, matching the snapshot's structure and tone; real content swapped in later.
- Stack: latest Next.js (App Router, TypeScript), latest Tailwind CSS, **Motion** (`motion` npm package, formerly Framer Motion) **+ GSAP/ScrollTrigger** for scroll-driven effects.
- CMS: no third-party headless CMS — a **self-built admin panel** inside the Next.js app, backed by **PostgreSQL via Prisma**.
- Deployment: **Coolify on a self-hosted VPS** (Docker-based, not Vercel).
- Contact / Join Community forms write to the database (viewable in `/admin/submissions`); optional SMTP email notification as a non-blocking nice-to-have.

## Visual/content reference (from snapshot)

- **Header**: "RETOUCH AFRICA" logo (white + gold), nav: Home/About/Workshop/Facilitators/Gallery/Partners/Community/Contact, "JOIN THE COMMUNITY" outline button.
- **Hero**: full-bleed dark photo, "WELCOME TO" eyebrow, large serif "RETOUCH AFRICA" (white/gold), tagline + body copy, "UPCOMING WORKSHOP" (solid gold) and "WATCH HIGHLIGHTS" (outline) CTAs.
- **Our Story** (white bg): eyebrow + "A Community. A Vision. A Movement." heading, body copy, "LEARN MORE ABOUT US" button; 3 icon columns (Mission/Vision/Impact).
- **Upcoming Workshop** (black bg): eyebrow + workshop title, summary, 3 info items (duration/location/seats), "VIEW DETAILS & REGISTER" CTA, 3 stacked photos, live **countdown** (days/hours/mins/secs) to `startDate`.
- **Facilitators** (white bg): "Meet the Experts", 3-across cards (photo, name, role, bio, socials), "VIEW ALL FACILITATORS".
- **Gallery** (black bg): "Moments That Inspire", horizontal photo strip, "VIEW FULL GALLERY".
- **Partners** (white bg): eyebrow + logo row, "BECOME A PARTNER".
- **Footer/CTA** (black bg, gold glow): "Be Part of Africa's Retouching Future", "JOIN THE COMMUNITY" CTA, social icons, contact email/handles, copyright.

Design language: serif display headings (Cormorant Garamond) over clean sans body (Inter), near-black/white palette with warm gold accent, small-caps gold "eyebrow" labels, outline + solid-gold buttons, moody B&W photography.

## Pinned Versions (checked against npm/official sources on 2026-08-28)

| Package / Runtime | Version to pin | Notes |
|---|---|---|
| Node.js | **24.x** (`node:24-alpine` in Docker) | Active LTS as of mid-2026; used as the container base image |
| Next.js | **^16.3.3** | Latest Active-LTS release; App Router, `output: "standalone"` |
| React / React DOM | **^19.2.8** | Version `create-next-app@latest` installs alongside Next 16 |
| Tailwind CSS | **^4.3.3** | v4 CSS-first config (no `tailwind.config.ts` needed; theme lives in `globals.css`) |
| TypeScript | **^5.7** (whatever `create-next-app@latest` pins) | — |
| motion | **^13.1.1** | The renamed Framer Motion; import from `motion/react` |
| gsap | **^3.15.0** | Includes `ScrollTrigger` plugin |
| @gsap/react | **^2.1.2** | Provides `useGSAP()` |
| prisma / @prisma/client | **^7.8.0** (stable) | **Not** 8.0.0-rc — that's an active release candidate, too new to build production on |
| PostgreSQL | **16.x** for local dev is fine; **postgres:18-alpine** is current stable for the Coolify service | 18.6 is the latest stable line as of Aug 2026; 16 remains supported if the VPS/Coolify's existing Postgres tooling is already on 16 |
| iron-session | **^8.0.4** | Mature/stable, no breaking changes pending |
| bcryptjs | **^3.x** (latest) | — |
| zod | **^4.x** (latest) | — |
| sharp | **^0.34.x** (latest) | Peer dep already required by `next/image` |
| nodemailer (optional) | **^6.x** (latest) | Only if SMTP notifications are enabled |

These will be re-verified against actual `npm view <pkg> version` output at scaffold time (step 1 of Build Order) in case anything shipped a patch between now and implementation — the versions above are current as of today, not hand-waved guesses.

## Stack & Scaffolding

```bash
npx create-next-app@latest retouchafrica --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --turbopack
```

This installs Next.js ^16.3.3 with React ^19.2.8 and Tailwind ^4.3.3 automatically (see version table above).

Dependencies (pin to the versions in the table above):
- Animation: `motion@^13.1.1`, `gsap@^3.15.0`, `@gsap/react@^2.1.2`
- Data: `prisma@^7.8.0`, `@prisma/client@^7.8.0`
- Auth: `iron-session@^8.0.4`, `bcryptjs`, `@types/bcryptjs`
- Validation/forms: `zod`, `react-hook-form`, `@hookform/resolvers`
- Uploads: `sharp`
- Utilities: `clsx`, `date-fns`
- Optional email: `nodemailer`

Fonts via `next/font/google`: **Cormorant Garamond** (display serif, `font-display`) + **Inter** (body/UI, `font-sans`), applied as CSS var classes on `<html>`.

**Auth approach**: `iron-session` (encrypted signed cookie) + single `AdminUser` row (bcrypt-hashed password), not NextAuth — there's exactly one admin, no OAuth providers, so a hand-rolled session (~40 lines) is simpler to own than a full auth framework.

## Folder Structure

```
app/
  layout.tsx, page.tsx, globals.css
  about/page.tsx
  workshop/page.tsx, workshop/[slug]/page.tsx
  facilitators/page.tsx, facilitators/[slug]/page.tsx
  gallery/page.tsx
  partners/page.tsx
  community/page.tsx
  contact/page.tsx
  admin/
    layout.tsx (auth guard + shell), login/page.tsx, page.tsx (dashboard)
    workshops/ facilitators/ gallery/ partners/  (each: page.tsx list, new/page.tsx, [id]/edit/page.tsx)
    settings/page.tsx (SiteSettings singleton form)
    submissions/page.tsx
components/
  layout/ (Header, Footer, MobileNav)
  shared/ (EyebrowHeading, SectionHeading, Button, CTASection, Countdown, SocialIcons)
  home/ (Hero, OurStory, UpcomingWorkshop, FacilitatorsPreview, GalleryPreview, PartnersStrip)
  facilitators/FacilitatorCard.tsx
  gallery/GalleryGrid.tsx
  forms/ (ContactForm, JoinCommunityForm)
  admin/ (AdminSidebar, DataTable, ImageUploadField, forms/*)
  motion/ (FadeIn, StaggerChildren, GsapScrollReveal)
lib/
  prisma.ts, session.ts, auth.ts, uploads.ts, mail.ts, constants.ts
  actions/ (workshops, facilitators, gallery, partners, settings, submissions, auth)
  validation/ (zod schemas)
prisma/
  schema.prisma, seed.ts, migrations/
public/uploads/  (gitignored; bind-mounted volume in production)
Dockerfile, docker-compose.yaml, docker-entrypoint.sh, .env.example, middleware.ts
next.config.ts (output: "standalone")
```

## Data Model (Prisma / PostgreSQL)

Models: `AdminUser`, `SiteSettings` (singleton, `id=1`, holds hero/story/mission/vision/impact/footer copy), `SocialLink` (shared by site-wide footer and per-`Facilitator`, `platform` enum), `Workshop` (slug, copy fields, `durationLabel`/`locationLabel`/`venueLabel`/`seatsLabel`, `startDate` countdown target, `galleryImages String[]`, `isFeatured`, `isPublished`), `Facilitator` (slug, name, role, bio, photoUrl, order, socialLinks), `GalleryImage` (imageUrl, caption, category, order), `Partner` (name, logoUrl, websiteUrl, order), `Submission` (type: `CONTACT`|`JOIN_COMMUNITY`|`PARTNER_INQUIRY`, name/email/phone/message, status: `NEW`|`READ`|`ARCHIVED`).

All content models carry `isPublished` (stage before publishing) and `order` (manual ordering). Full schema drafted during exploration — write it out in `prisma/schema.prisma` at implementation time following this shape.

## Admin Panel

- Login at `/admin/login` → Server Action verifies `AdminUser` via bcrypt → `iron-session` cookie (`ra_admin_session`, `secure` in prod).
- `middleware.ts` guards all `/admin/**` except `/admin/login`; every mutating Server Action also calls `requireAdmin()` as defense-in-depth.
- No public signup route; the one `AdminUser` is created by `prisma/seed.ts` from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars.
- CRUD kept low-tech: no admin framework. Generic `DataTable` component + per-entity `new`/`[id]/edit` pages using native `<form action={serverAction}>` (React 19 form actions) with zod validation and `revalidatePath()` after writes.
- Image uploads: **local filesystem** under `public/uploads/<folder>/<cuid>.<ext>` via `lib/uploads.ts` (`saveUpload`/`deleteUpload`), using `sharp` for resizing — not S3, since this is a low-traffic self-hosted site and Coolify's persistent volumes solve the "files lost on redeploy" problem directly. Upgrade path to S3-compatible storage later stays behind the same function signature.
- `submissions/page.tsx`: read-only table of leads, filterable by type/status, mark read/archive.

## Public Site Data Flow

- All 8 public pages are React Server Components fetching directly via Prisma (`lib/prisma.ts` singleton) — no API layer for reads.
- Client Components limited to: `Countdown` (ticking timer), `ContactForm`/`JoinCommunityForm`, `MobileNav`, and Motion/GSAP wrappers.
- Revalidation: on-demand via `revalidatePath()` in every admin mutation (targeting `/` plus the specific affected routes). `SiteSettings` fetched through a cached/tagged (`unstable_cache`) helper so a settings edit only busts that one cache tag.
- **Deviation from the original plan**: pages use `export const dynamic = "force-dynamic"` rather than `revalidate = 3600` — `next build` prerenders any route without an explicit dynamic API into a static page, which requires a live `DATABASE_URL` *at Docker build time*. Coolify (like most container platforms) injects env vars only at container runtime, not during the image build, so build-time prerendering against Prisma isn't viable here. `force-dynamic` makes every content page render per-request instead, which is the right trade-off for a low-traffic site: no build-time DB dependency, and `revalidatePath` still keeps things fresh instantly after an edit.

## Animation Architecture (Motion + GSAP)

Rule: **Motion** owns component-level/interaction animation (entrances, hover/tap, staggered mount reveals, mobile nav open/close, optional route-transition fades via `AnimatePresence`). **GSAP + ScrollTrigger** owns scroll-position-driven animation (hero parallax, scroll-scrubbed section reveals, optional pinning in the Upcoming Workshop section). Never drive the same DOM node's transform from both libraries in the same interaction.

Use `@gsap/react`'s `useGSAP(() => {...}, { scope: containerRef })` for every GSAP effect — the `scope` option auto-reverts tweens/ScrollTriggers on unmount, which matters under the App Router's client-side remounts. Default to Motion's `whileInView` for simple "fade up once when scrolled into view" (About icons, gallery grid, partner logos); reserve GSAP for anything genuinely tied to scroll *position* (hero parallax, pinning).

## Deployment (Coolify / VPS)

- `next.config.ts`: `output: "standalone"`.
- Multi-stage `Dockerfile` (deps → builder incl. `prisma generate` + `next build` → runner on `node:24-alpine`, non-root user, copies `.next/standalone` + `.next/static` + `public/` + Prisma client artifacts).
- `docker-entrypoint.sh` runs `npx prisma migrate deploy` then `node server.js` on every container start (safe for Coolify's stop-old/start-new single-instance deploy model; revisit only if moving to zero-downtime multi-instance deploys).
- `docker-compose.yaml` as the Coolify reference: `app` service only — Postgres runs as a separate Coolify resource, referenced via `DATABASE_URL`. The `uploads_data` volume (mounted at `/app/public/uploads`) **must be configured as persistent storage in Coolify**, or a redeploy wipes every uploaded image.
- Env vars: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`/`ADMIN_PASSWORD` (seed-only), `NEXT_PUBLIC_SITE_URL`, `UPLOADS_DIR`, `PORT`/`HOSTNAME`, optional `SMTP_*`/`NOTIFY_EMAIL_TO`.
- Optional SMTP notification (`lib/mail.ts`, `nodemailer`) fires after the `Submission` row is already committed — a mail failure never loses a lead; the admin Submissions view is the source of truth regardless.

## Build Order

1. **Scaffold** — Next.js + Tailwind + fonts + design tokens + placeholder Header/Footer. Verify: `npm run dev` renders styled shell.
2. **Prisma schema + seed** — write `schema.prisma`, run `prisma migrate dev`, seed realistic placeholder data (1 admin, 1 featured workshop ~2-4 weeks out, 3-4 facilitators, 8-10 gallery images, 5-6 partners, `SiteSettings` defaults). Verify: `prisma studio` shows seeded data.
3. **Admin auth** — session/auth libs, `/admin/login`, `middleware.ts` guard. Verify: unauth redirect works, seeded admin can log in.
4. **Admin CRUD** — `DataTable`, `ImageUploadField`, then Workshops → Facilitators → Gallery → Partners → Settings → Submissions. Verify: full create/edit/delete cycle per entity, uploads land in `public/uploads/`.
5. **Public pages** — shared components (Header, Footer, Button, EyebrowHeading, CTASection, Countdown) then all 8 pages wired to Prisma with seed data; wire both forms to `Submission`. Verify: every nav link resolves, forms create rows visible in `/admin/submissions`, countdown ticks correctly.
6. **Animation polish** — Motion first (buttons/nav/stagger), then GSAP/ScrollTrigger (hero parallax, scroll reveals). Verify: no duplicate-ScrollTrigger warnings across navigation, smooth on mobile viewport.
7. **Dockerize** — `Dockerfile`, `docker-entrypoint.sh`, `docker-compose.yaml`, `.env.example`; `docker compose up --build` locally against a fresh volume. Verify: site fully functional containerized, uploads persist across `docker compose restart`.
8. **Deploy to Coolify** — push to watched git remote, configure app + Postgres in Coolify, set env vars as secrets, attach persistent volumes, point domain. Verify: HTTPS prod URL loads, admin login works, a real submission appears in `/admin/submissions`, a redeploy doesn't lose data/uploads.

Each milestone is a natural commit-sized checkpoint — verify one before starting the next.
