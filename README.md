# UBUNTU-GEN Cultural Connect — African Cultural Heritage Platform

**UBUNTU-GEN Cultural Connect** is a digital cultural heritage platform for preserving, documenting and
showcasing African regalia, artifacts, ethnic communities, traditions and oral
history. It combines a public heritage "museum" experience (browse, search,
bookmark) with a contributor **Studio** (posts, blogs, vlogs, personal pages)
and an **Admin Console** for managing all site content and users.

---

## Table of Contents

- [Overview](#overview)
- [Feature Summary](#feature-summary)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the App](#running-the-app)
  - [Development](#development)
  - [Production build & preview](#production-build--preview)
  - [Type checking / linting](#type-checking--linting)
- [Project Structure](#project-structure)
- [How the App Works](#how-the-app-works)
  - [Routing & access control](#routing--access-control)
  - [Authentication](#authentication)
  - [Public heritage site (5 tabs)](#public-heritage-site-5-tabs)
  - [Bookmarks (My Saved Archives)](#bookmarks-my-saved-archives)
  - [Contributor Studio](#contributor-studio)
  - [Admin Console](#admin-console)
  - [Data layer](#data-layer)
- [Database Schema (Supabase)](#database-schema-supabase)
- [Storage Buckets](#storage-buckets)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

The platform targets students, researchers, cultural institutions, tourists and
local communities. Visitors can explore royal regalia, browse digital artifact
records (some with audio soundscapes), and learn about ethnic communities,
their clans, totems and traditions. Registered contributors share their own
cultural stories; administrators curate the archive and manage users.

---

## Feature Summary

**Public site (no sign-in required)**
- Home: hero, featured regalia, ethnic spotlights, latest artifacts
- Regalia Gallery: category filter + search, detail modal
- Ethnic Communities: region filter + search, lineage & totem modal
- Digital Artifact Archive: search + sort, load-more, significance modal
- My Saved Archives: localStorage-backed bookmark collection
- Community Stories feed and public member profiles
- Audio soundscapes (Web Audio API synthesizer), notifications and an Ethical
  Preservation Charter

**Contributor Studio (sign-in required)**
- Profile editing (avatar upload, username, bio, personal info, role badge)
- Posts: create/edit/publish/unpublish/delete (blog, post, vlog types)
- Pages: create/edit/make public or private/delete

**Admin Console (admin role required)**
- Platform-wide stats dashboard
- Full CRUD Content Manager (regalia, artifacts, communities, posts, pages)
- User management (promote/demote to admin)

---

## Technology Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, TypeScript, Vite 6 |
| Styling    | Tailwind CSS v4, Google Fonts (Libre Caslon Text, Hanken Grotesk), Material Symbols |
| Routing    | react-router-dom v7 |
| Backend    | Supabase (Postgres + Auth + Storage) |
| Motion     | motion (framer-motion successor) for animations |
| Audio      | Web Audio API (synthesized soundscapes, no audio files) |

> Note: the old README mentioned Express/MySQL/Cloudinary. The current app is
> fully serverless: Supabase provides auth, the database and file storage.

---

## Prerequisites

- **Node.js** (18+) and **npm**
- A **Supabase** project (free tier is fine)
  - Auth provider enabled for **Email** and (optional) **Apple**
  - The tables and storage buckets listed below created

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Required for Gemini AI API calls (injected at runtime on AI Studio).
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# The URL where this app is hosted (Cloud Run / AI Studio service URL).
APP_URL="MY_APP_URL"

# Supabase project settings (Dashboard -> Project Settings -> API).
VITE_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

- `VITE_*` variables are read by `src/lib/supabase.ts` **at build time** and
  must be present for the app to start (it throws a clear error otherwise).
- `GEMINI_API_KEY` is a runtime secret; on AI Studio it is injected from the
  Secrets panel and must **not** be committed. `.env*` files are gitignored,
  only `.env.example` is tracked.

---

## Installation

```bash
npm install
```

---

## Running the App

### Development

```bash
npm run dev
```

Starts the Vite dev server on **http://localhost:3000** (hosted on `0.0.0.0`,
so it is reachable from the local network too). Hot module replacement is on by
default; set `DISABLE_HMR=true` to turn it off (used by AI Studio).

### Production build & preview

```bash
npm run build      # type-checks nothing; produces optimized static files in dist/
npm run preview    # serves the built dist/ locally for a production preview
```

### Type checking / linting

```bash
npm run lint       # runs tsc --noEmit across the project
```

Clean generated output:

```bash
npm run clean      # removes dist/ and server.js (if any)
```

---

## Project Structure

```text
.
├── index.html                  # HTML shell; #root mount point, fonts
├── package.json                # scripts + dependencies
├── tsconfig.json               # TypeScript config ('@' path alias)
├── vite.config.ts              # Vite config (React + Tailwind plugins, alias)
├── .env.example                # documented env var template
├── .gitignore                  # ignores node_modules, dist, .env*, logs...
├── assets/                     # extra static assets
└── src/
    ├── main.tsx                # React bootstrap (StrictMode + root render)
    ├── App.tsx                 # router + route guards
    ├── types.ts                # shared domain types
    ├── index.css               # design tokens, typography, patterns
    ├── data/
    │   └── mockData.ts         # seed/reference cultural content + notifications
    ├── lib/
    │   ├── supabase.ts         # Supabase client singleton
    │   ├── auth.tsx            # AuthProvider + useAuth (session/profile/role)
    │   ├── guards.tsx          # Protected / Admin / PublicOnly route wrappers
    │   ├── content.ts          # CRUD data-access layer for all content
    │   └── useContent.ts       # React hooks for regalia/artifacts/communities
    ├── site/
    │   └── SiteApp.tsx         # public site shell (5 tabs + modals + state)
    ├── components/
    │   ├── TopAppBar.tsx       # fixed header (menu, brand, account, bell)
    │   ├── BottomNavBar.tsx    # mobile bottom tab bar
    │   ├── HeaderDrawer.tsx    # slide-in nav menu
    │   ├── Footer.tsx          # site footer
    │   ├── ItemDetailModal.tsx # regalia/artifact detail modal
    │   ├── LineageModal.tsx    # community lineage & totems modal
    │   ├── JoinCommunityModal.tsx # contribution form modal
    │   ├── NotificationModal.tsx  # archive updates modal
    │   ├── AudioPlayerWidget.tsx  # Web Audio soundscape player
    │   ├── ui/form.tsx         # reusable form primitives (Input, Button...)
    │   └── dashboard/
    │       └── DashboardShell.tsx  # studio/admin layout (sidebar + content)
    └── views/
        ├── HomeView.tsx        # Home tab
        ├── GalleryView.tsx     # Regalia Gallery tab
        ├── CommunitiesView.tsx # Ethnic Communities tab
        ├── SearchView.tsx      # Digital Artifact Archive tab
        ├── SavedView.tsx       # My Saved Archives tab
        ├── auth/
        │   ├── AuthPage.tsx    # sign in / sign up
        │   └── ProfilePage.tsx # profile editor
        ├── dashboard/
        │   ├── UserDashboard.tsx # Contributor Studio overview
        │   ├── PostsView.tsx   # My Posts list
        │   ├── PostEditor.tsx  # create/edit post
        │   ├── PagesView.tsx   # My Pages list
        │   └── PageEditor.tsx  # create/edit page
        ├── admin/
        │   ├── AdminDashboard.tsx # stats overview
        │   ├── ContentManager.tsx # full CRUD content manager
        │   └── UsersManager.tsx   # role management
        └── public/
            ├── CommunityFeed.tsx   # /stories feed
            └── PublicProfile.tsx   # /u/:userName profile
```

---

## How the App Works

### Routing & access control

`src/App.tsx` defines all routes. Sensitive routes are wrapped in guards from
`src/lib/guards.tsx`:

| Guard             | Behavior                                                                 |
|-------------------|--------------------------------------------------------------------------|
| `ProtectedRoute`  | signed in → render; else redirect to `/auth` (remembers the target path) |
| `AdminRoute`      | signed in + `role === 'admin'` → render; else redirect to `/dashboard`   |
| `PublicOnlyRoute` | signed out → render; else redirect to `/dashboard` (used on `/auth`)     |

While the session is being restored, guards render a branded `LoadingScreen`.

### Authentication

`src/lib/auth.tsx` exposes an `AuthProvider` + `useAuth()` hook:

- Session is persisted in localStorage (PKCE flow) and restored on boot.
- `useAuth` also holds the user's `profiles` row (name, avatar, role) and
  refreshes it whenever the session/user changes.
- Operations: `signUpWithEmail`, `signInWithEmail`, `signInWithApple`,
  `signOut`, `updateProfile`, `refreshProfile`, plus derived `isAdmin`.
- The `profiles` table stores the `role` used by the admin guards.

### Public heritage site (5 tabs)

`SiteApp` renders one of five views based on `activeTab` and owns shared UI
state (bookmarks, selected items, modals):

1. **Home** — hero + featured regalia carousel + community spotlights + latest artifacts.
2. **Gallery** — regalia grid with category chips and search; bookmark overlay.
3. **Communities** — region-filtered community rows; lineage/totem modal.
4. **Search** — artifact archive with search, sort and incremental "load more".
5. **Saved** — the user's bookmarked regalia + artifacts.

Every item click opens `ItemDetailModal` (artifacts may include an audio
soundscape via `AudioPlayerWidget`); community clicks open `LineageModal`.

### Bookmarks (My Saved Archives)

Bookmarks are stored in `localStorage` under `ubuntu_gen_saved_items` (an array of
ids; legacy saves under `ntanda_saved_items` are migrated automatically) and owned
by `SiteApp` (`savedItemIds`). This means saved items persist
across reloads on the same browser — no account required. The badge on the
bottom "Saved" tab shows the current count.

### Contributor Studio

After signing in, users reach `/dashboard`:

- **Profile** (`/profile`) — set username, bio, avatar (uploaded to the
  `avatars` storage bucket) and personal info.
- **Posts** (`/dashboard/posts`) — list, publish/unpublish, edit, delete.
  `PostEditor` creates/edits blog/post/vlog entries with optional cover image
  upload (to the `content` bucket) and media URLs.
- **Pages** (`/dashboard/pages`) — personal pages that can be public/private.
  Public pages and published posts appear on `/stories` and on the author's
  public profile `/u/:userName`.

### Admin Console

Admins (role `admin`) get extra sidebar links:

- **Admin Dashboard** — live row counts across all tables; tiles deep-link to
  the content manager tabs.
- **Content Manager** — tabbed full CRUD for regalia, artifacts, communities,
  posts and pages. Field definitions are declared centrally in `FIELD_DEFS`
  which drives both the form and the save payload.
- **User Management** — browse users and promote/demote roles. The signed-in
  admin cannot change their own role.

### Data layer

- `src/lib/content.ts` — the single data-access layer (posts, pages, regalia,
  artifacts, communities, profiles, file uploads). All functions return
  `{ data | error }` and never throw on query failures.
- `src/lib/useContent.ts` — hooks that load regalia/artifacts/communities on
  mount and map DB rows (`origin_region` → `originRegion`) into the UI types.

---

## Database Schema (Supabase)

Create these tables in your Supabase project (SQL editor or dashboard). The
`profiles` table is linked to `auth.users` via a trigger so a row is created
for every new user. Enable **Row Level Security** so users can only modify
their own records and anonymous visitors can only read public content.

| Table         | Purpose                                                        | Key columns |
|---------------|----------------------------------------------------------------|-------------|
| `profiles`    | User profiles & roles                                          | `id` (FK auth.users), `user_name`, `full_name`, `email`, `avatar_url`, `bio`, `role` ('user'/'admin'), `personal_info` (jsonb), timestamps |
| `posts`       | User posts / blogs / vlogs                                     | `author_id`, `title`, `slug`, `excerpt`, `content`, `content_type`, `cover_image`, `media_urls` (jsonb), `status` (draft/published/archived) |
| `pages`       | Personal heritage pages                                        | `author_id`, `title`, `slug`, `description`, `content`, `cover_image`, `is_public` |
| `regalia`     | Royal regalia collection items                                 | `title`, `tribe`, `category`, `description`, `image`, `era`, `material`, `origin_region`, `spiritual_significance`, `is_featured` |
| `artifacts`   | Digital artifact records                                       | `title`, `culture`, `ref_number`, `estimated_age`, `location`, `image`, `description`, `material`, `significance_details`, `historical_context`, `audio_track` |
| `communities` | Ethnic communities (clans, totems, traditions)                 | `name`, `region`, `description`, `avatar_image`, `banner_image`, `population`, `language`, `royalty_leader`, `totems` (jsonb), `key_traditions` (jsonb) |

> Tip: seed the archive from the data in `src/data/mockData.ts` (or via the
> Admin → Content Manager). The `slug` column is used as the stable bookmark
> id when present.

---

## Storage Buckets

Create two public buckets in Supabase Storage:

| Bucket     | Used for                     | Written by                        |
|------------|------------------------------|-----------------------------------|
| `content`  | Post/page covers, admin media | `ProfilePage` (avatars), `PostEditor`, `PageEditor`, `ContentManager` |
| `avatars`  | User profile photos          | `ProfilePage`                     |

`src/lib/content.ts` → `uploadContentFile` handles uploads and returns the
public URL to store on the row.

---

## Deployment

The app is a static SPA, so it can be hosted on any static host or on the AI
Studio / Cloud Run pipeline:

1. Set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` at build time.
2. Run `npm run build` to produce the `dist/` folder.
3. Deploy `dist/` (configure SPA fallback so `/dashboard`, `/stories`, etc.
   serve `index.html`). On AI Studio, `APP_URL` is injected automatically.

---

## Troubleshooting

- **"Supabase environment variables are missing"** — copy `.env.example` to
  `.env.local` and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, then
  restart the dev server.
- **Sign-up but no session / confirm email message** — email confirmation is
  enabled; check the confirmation link, then sign in.
- **"Type '…' is not assignable" on a new field** — add/update the field in
  `src/types.ts` and in the relevant `FIELD_DEFS` block in `ContentManager.tsx`.
- **Bookmarks disappear** — bookmarks live in `localStorage`; clearing browser
  storage or switching browsers resets them (by design).
- **Images 404** — seed data images are remote AI Studio URLs; replace them
  with URLs in your own storage buckets or the Content Manager.

---

## License

This project is licensed under the MIT License.

> **"Preserving Africa's Heritage, Inspiring Future Generations."**
