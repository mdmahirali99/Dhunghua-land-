# 🐉 DonghuaLand

A fully-featured Chinese anime (Donghua) streaming website built with **Hono**, **Cloudflare Workers**, and **D1 SQLite** database. Supports user accounts, comments, image uploads via Cloudinary, TMDB integration, and a complete admin panel.

---

## 🌟 Features

### ✅ Currently Completed Features

#### 🎬 Content
- Browse Chinese anime (Donghua) by genre, status, type, year
- Episode streaming (embed URL, direct MP4, or demo video fallback)
- Featured / Trending / Popular sections on homepage
- Weekly airing schedule
- Full-text search with filters
- Anime detail pages with episode list

#### 👤 User System
- User registration & login (JWT-based auth)
- **Profile photo upload** (via Cloudinary)
- **Cover/banner image upload** (via Cloudinary)
- Bio/description on profile
- Watchlist (add/remove anime)
- Watch history (client-side + server-side)
- Settings page with real API calls (username, bio, password change)
- Account preferences (video quality, autoplay, subtitles)

#### 💬 Comments System
- Comments on watch/episode pages and anime pages
- **Threaded replies** (one level deep)
- **Like/unlike comments**
- Spoiler tags with blur reveal
- Admin moderation (approve / reject / delete)
- Auto-approve or manual review mode (configurable)
- Users can delete their own comments
- Admin can delete any comment

#### 🛡 Admin Panel (`/admin`)
- **Login**: username `admin`, password `admin1122`
- Dashboard with live stats (anime, episodes, users, views, comments)
- Full anime CRUD (add/edit/delete)
- **TMDB auto-fill** (uses server-side TMDB_API_KEY secret — no key input needed)
- Episode management (add/edit/delete with embed URLs or direct video)
- **Image upload to Cloudinary** from admin (covers, banners, thumbnails)
- User management (view, ban/unban)
- Comments moderation (approve/reject/delete)
- Weekly schedule management
- Site settings (maintenance mode, registration toggle, demo video mode)
- Admin password change

#### 🖼 Image Hosting (Cloudinary)
- All images hosted on Cloudinary (free tier: 25GB storage, 25GB bandwidth/month)
- Profile photos (max 5MB)
- Cover/banner images (max 10MB)
- Admin uploads for anime covers, banners, episode thumbnails (max 20MB)
- Server-side upload (API keys never exposed to browser)

#### 🔒 Security
- JWT tokens for authentication (30-day expiry)
- Passwords hashed with SHA-256 + salt
- Cloudinary API keys stored as server secrets (never in frontend)
- TMDB API key stored as server secret
- Admin credentials hardcoded + overridable via DB

---

## 📁 Project Structure

```
donghualand/
├── migrations/
│   └── 0001_initial_schema.sql    # D1 database schema
├── public/
│   └── static/
│       ├── app.js                 # Frontend JavaScript
│       ├── admin.js               # Admin panel JavaScript
│       ├── style.css              # Global styles
│       └── favicon.svg            # Site favicon
├── src/
│   ├── index.ts                   # Main app entry + page routes
│   ├── routes/
│   │   ├── anime.ts               # Anime CRUD API
│   │   ├── episodes.ts            # Episode CRUD API
│   │   ├── users.ts               # User auth + profile API
│   │   ├── admin.ts               # Admin API (auth + management)
│   │   ├── comments.ts            # Comments CRUD + moderation API
│   │   ├── upload.ts              # Cloudinary image upload API
│   │   ├── search.ts              # Search API
│   │   └── tmdb.ts                # TMDB proxy API
│   ├── pages/
│   │   ├── layout.ts              # Base HTML layout
│   │   ├── home.ts                # Homepage
│   │   ├── anime.ts               # Anime detail page
│   │   ├── watch.ts               # Watch page (player + comments)
│   │   ├── search.ts              # Search results page
│   │   ├── profile.ts             # User profile (with image upload)
│   │   ├── settings.ts            # Account settings
│   │   ├── adminPanel.ts          # Admin panel HTML
│   │   ├── login.ts               # Login page
│   │   ├── register.ts            # Register page
│   │   ├── watchlist.ts           # Watchlist page
│   │   ├── history.ts             # Watch history page
│   │   ├── schedule.ts            # Schedule page
│   │   ├── staticPages.ts         # About/Privacy/Terms/DMCA
│   │   ├── components.ts          # Shared components
│   │   └── 404.ts                 # 404 page
│   └── utils/
│       ├── auth.ts                # JWT + password hashing
│       ├── helpers.ts             # Slugify, formatDate, etc.
│       └── demoData.ts            # Demo anime data (DB fallback)
├── seed.sql                       # Initial data + admin user
├── wrangler.jsonc                 # Cloudflare Workers config
├── package.json                   # Dependencies + scripts
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite build config
├── ecosystem.config.cjs           # PM2 config (sandbox dev)
├── .env.example                   # Environment variables template
└── .gitignore                     # Git ignore rules
```

---

## 🗄 Database Schema

### Tables
| Table | Purpose |
|-------|---------|
| `admins` | Admin accounts |
| `users` | User accounts (with profile_image, cover_image, bio) |
| `anime` | Anime catalog |
| `episodes` | Episodes per anime |
| `comments` | User comments (with replies via parent_id) |
| `comment_likes` | User likes on comments |
| `watchlist` | User watchlist entries |
| `watch_history` | User watch history |
| `schedule` | Weekly airing schedule |
| `settings` | Site configuration key-value |

---

## 🚀 Deployment Guide

### Step 1: Prerequisites
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free)
- [Node.js 18+](https://nodejs.org/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

```bash
npm install -g wrangler
wrangler login
```

### Step 2: Create D1 Database
```bash
cd donghualand
npx wrangler d1 create donghualand-production
```
Copy the `database_id` from the output and update `wrangler.jsonc`:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "donghualand-production",
    "database_id": "PASTE-YOUR-ID-HERE"   // ← update this
  }
]
```

### Step 3: Run Database Migrations
```bash
# Apply schema to production D1
npx wrangler d1 migrations apply donghualand-production

# Seed initial data (anime + admin user)
npx wrangler d1 execute donghualand-production --file=./seed.sql
```

### Step 4: Build the Project
```bash
npm install
npm run build
```

### Step 5: Create Cloudflare Pages Project
```bash
npx wrangler pages project create donghualand --production-branch main
```

### Step 6: Deploy
```bash
npx wrangler pages deploy dist --project-name donghualand
```

### Step 7: Set Secrets
Set these as Cloudflare Pages secrets (required):
```bash
# Required: JWT signing secret
npx wrangler pages secret put JWT_SECRET --project-name donghualand
# Enter: any random strong string (e.g. run: openssl rand -hex 32)

# Optional but recommended: TMDB for anime auto-fill
npx wrangler pages secret put TMDB_API_KEY --project-name donghualand
# Enter: your TMDB v3 API key from https://www.themoviedb.org/settings/api

# Required for image uploads: Cloudinary credentials
npx wrangler pages secret put CLOUDINARY_CLOUD_NAME --project-name donghualand
npx wrangler pages secret put CLOUDINARY_API_KEY --project-name donghualand
npx wrangler pages secret put CLOUDINARY_API_SECRET --project-name donghualand
# Get these from: https://console.cloudinary.com/settings/api-keys
```

### Step 8: Bind D1 to Pages Project (via Cloudflare Dashboard)
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → `donghualand`
2. Click **Settings** → **Functions** → **D1 database bindings**
3. Add binding: Variable name = `DB`, D1 database = `donghualand-production`
4. Re-deploy: `npm run deploy`

---

## 🔑 Admin Access

| Field | Value |
|-------|-------|
| URL | `/admin` |
| Username | `admin` |
| Password | `admin1122` |

> **Note:** The admin password can be changed from Admin Panel → Settings → Admin Account Password. The change is stored in the D1 database.

---

## 🖼 Getting Cloudinary (Free)

1. Visit [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up (no credit card required)
3. Free plan includes: **25GB storage**, **25GB bandwidth/month**
4. Find your credentials at: Dashboard → API Keys
5. Note your **Cloud Name**, **API Key**, and **API Secret**

---

## 🎬 Getting TMDB API Key (Free)

1. Visit [themoviedb.org](https://www.themoviedb.org/) and create account
2. Go to Settings → API → Create → Developer
3. Copy your **API Key (v3 auth)** (NOT the read access token)
4. Set it as: `npx wrangler pages secret put TMDB_API_KEY --project-name donghualand`

---

## 🔌 API Reference

### Authentication
```
POST /api/users/register    Register new user
POST /api/users/login       Login
GET  /api/users/me          Get current user (requires token)
PUT  /api/users/profile     Update username/bio (requires token)
POST /api/users/change-password   Change password (requires token)
POST /api/users/watchlist   Toggle anime in watchlist
GET  /api/users/watchlist   Get user's watchlist
```

### Anime
```
GET  /api/anime             List anime (with pagination, filters)
GET  /api/anime/:id         Get single anime + episodes
POST /api/anime             Create anime (admin)
PUT  /api/anime/:id         Update anime (admin)
DELETE /api/anime/:id       Delete anime (admin)
```

### Comments
```
GET  /api/comments?anime_id=X&episode_id=Y   Get comments
POST /api/comments          Post comment (requires token)
PUT  /api/comments/:id      Edit comment (owner only)
DELETE /api/comments/:id    Delete comment (owner/admin)
POST /api/comments/:id/like  Like/unlike comment (requires token)
```

### Image Upload
```
POST /api/upload/profile-image   Upload user profile photo (requires token)
POST /api/upload/cover-image     Upload user cover image (requires token)
POST /api/upload/admin           Upload any image to Cloudinary (admin only)
```

### Admin
```
POST /api/admin/login        Admin login
GET  /api/admin/stats        Dashboard stats
GET  /api/admin/anime        List all anime
POST /api/admin/anime        Add anime
PUT  /api/admin/anime/:id    Update anime
DELETE /api/admin/anime/:id  Delete anime
GET  /api/admin/episodes     List episodes
POST /api/admin/episodes     Add episode
PUT  /api/admin/episodes/:id Update episode
DELETE /api/admin/episodes/:id Delete episode
GET  /api/admin/users        List users
POST /api/admin/users/:id/ban    Ban user
POST /api/admin/users/:id/unban  Unban user
DELETE /api/admin/users/:id  Delete user
GET  /api/admin/comments     List all comments (with filters)
PATCH /api/admin/comments/:id Moderate comment (approve/reject/delete)
DELETE /api/admin/comments/:id Delete comment
GET  /api/admin/settings     Get site settings
POST /api/admin/settings     Update settings
GET  /api/admin/cloudinary-status   Check Cloudinary config status
POST /api/admin/change-password     Change admin password
GET  /api/admin/schedule     Get schedule
POST /api/admin/schedule     Add schedule entry
DELETE /api/admin/schedule/:id Remove schedule entry
```

### TMDB Proxy (server-side key)
```
GET /api/tmdb/search?q=title          Search TV shows
GET /api/tmdb/search/anime?q=title    Search anime (zh+en)
GET /api/tmdb/tv/:id                  Get show details
```

---

## 💻 Local Development

### Setup
```bash
git clone <your-repo-url>
cd donghualand
npm install
```

### Create local .dev.vars
```bash
cp .env.example .dev.vars
# Edit .dev.vars with your actual keys
```

### Setup local database
```bash
npm run db:migrate:local
npm run db:seed:local
```

### Start dev server
```bash
npm run build
# Then start with wrangler:
npx wrangler pages dev dist --d1=donghualand-production --local --ip 0.0.0.0 --port 3000
```

Or use PM2 (in sandbox):
```bash
pm2 start ecosystem.config.cjs
```

---

## 🌐 Pages & Routes

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/anime/:slug` | Anime detail page |
| `/watch/:slug-episode-N` | Watch episode (with comments) |
| `/search` | Search with filters |
| `/schedule` | Weekly airing schedule |
| `/user/login` | Sign in |
| `/user/register` | Register |
| `/user/profile` | User profile (with image upload) |
| `/user/settings` | Account settings |
| `/user/watchlist` | Watchlist |
| `/user/history` | Watch history |
| `/admin` | Admin panel (admin/admin1122) |
| `/about`, `/privacy`, `/terms`, `/dmca` | Static pages |

---

## ⚙️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Hono** | Backend framework (Cloudflare Workers) |
| **Cloudflare Workers** | Edge serverless runtime |
| **Cloudflare Pages** | Hosting + deployment |
| **Cloudflare D1** | SQLite database (globally distributed) |
| **Cloudinary** | Image hosting (profiles, covers, thumbnails) |
| **TMDB API** | Anime metadata auto-fill |
| **Vite** | Build tool |
| **TypeScript** | Type safety |
| **TailwindCSS CDN** | Utility styling |
| **FontAwesome** | Icons |

---

## 🔐 Security Notes

1. **Never expose** Cloudinary API keys in frontend code
2. **Never expose** TMDB API key in frontend code
3. JWT tokens expire after **30 days**
4. Admin login checks hardcoded credentials **AND** database records
5. Image uploads are validated for type and size on the server

---

## 📝 GitHub Push Instructions

```bash
cd donghualand
git add .
git commit -m "Add comments, Cloudinary image upload, profile images, settings API"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 🚀 After GitHub Push — Deploy to Cloudflare

```bash
# 1. Login to Cloudflare
wrangler login

# 2. Create D1 database (if not done)
npm run db:create
# → Copy the database_id to wrangler.jsonc

# 3. Apply migrations
npm run db:migrate:prod

# 4. Seed initial data
npm run db:seed:prod

# 5. Build + Deploy
npm run deploy

# 6. Set secrets (one by one)
npx wrangler pages secret put JWT_SECRET --project-name donghualand
npx wrangler pages secret put TMDB_API_KEY --project-name donghualand
npx wrangler pages secret put CLOUDINARY_CLOUD_NAME --project-name donghualand
npx wrangler pages secret put CLOUDINARY_API_KEY --project-name donghualand
npx wrangler pages secret put CLOUDINARY_API_SECRET --project-name donghualand

# 7. Bind D1 in Cloudflare Dashboard (Workers & Pages → Settings → Functions → D1 bindings)

# 8. Re-deploy after binding
npm run deploy
```

---

## 🗺 Roadmap / Not Yet Implemented

- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] User notifications (new episode, replies)
- [ ] Comment report/spam system
- [ ] Rating system (user star ratings per anime)
- [ ] Mobile app / PWA
- [ ] Video quality switcher
- [ ] Custom video player with subtitles
- [ ] Social login (Google, Discord)
- [ ] Anime request system

---

## 📄 License

This project is for educational/personal use. Respect copyright laws for any content you stream.

---

*Built with ❤️ using Hono + Cloudflare Workers + D1*
