import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

// Routes
import { animeRoutes } from './routes/anime'
import { episodeRoutes } from './routes/episodes'
import { userRoutes } from './routes/users'
import { adminRoutes } from './routes/admin'
import { searchRoutes } from './routes/search'
import { tmdbRoutes } from './routes/tmdb'
import { commentRoutes } from './routes/comments'
import { uploadRoutes } from './routes/upload'

// Page templates
import { homePage } from './pages/home'
import { animePage } from './pages/anime'
import { watchPage } from './pages/watch'
import { searchPage } from './pages/search'
import { loginPage } from './pages/login'
import { registerPage } from './pages/register'
import { adminPage } from './pages/adminPanel'
import { notFoundPage } from './pages/404'
import { watchlistPage } from './pages/watchlist'
import { profilePage } from './pages/profile'
import { historyPage } from './pages/history'
import { settingsPage } from './pages/settings'
import { schedulePage } from './pages/schedule'
import { aboutPage, contactPage, privacyPage, termsPage, dmcaPage } from './pages/staticPages'

// Demo data (used when DB is empty/unavailable)
import { DEMO_ANIME, getDemoEpisodes, DEMO_SCHEDULE } from './utils/demoData'

type Bindings = {
  DB: D1Database
  TMDB_API_KEY: string
  JWT_SECRET: string
  ADMIN_SECRET: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Static files
app.use('/static/*', serveStatic({ root: './' }))

// API Routes
app.route('/api/anime', animeRoutes)
app.route('/api/episodes', episodeRoutes)
app.route('/api/users', userRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/search', searchRoutes)
app.route('/api/tmdb', tmdbRoutes)
app.route('/api/comments', commentRoutes)
app.route('/api/upload', uploadRoutes)

// Helper: get demo data with recent_ep field
function demoAnimeWithLatestEp(anime: any): any {
  const ep = getDemoEpisodes(anime.id, anime.slug, Math.min(anime.latest_ep || 12, 12))
  return {
    ...anime,
    latest_ep: anime.latest_ep || ep.length,
    latest_ep_date: ep[ep.length - 1]?.created_at,
    total_eps: ep.length
  }
}

// Frontend Pages
app.get('/', async (c) => {
  const db = c.env?.DB
  try {
    if (!db) throw new Error('No DB')
    
    const featured = await db.prepare(`
      SELECT * FROM anime WHERE is_featured = 1 ORDER BY updated_at DESC LIMIT 5
    `).all()
    
    const trending = await db.prepare(`
      SELECT * FROM anime WHERE is_trending = 1 ORDER BY view_count DESC LIMIT 10
    `).all()
    
    const recent = await db.prepare(`
      SELECT a.*, MAX(e.created_at) as latest_ep_date, MAX(e.episode_number) as latest_ep,
      COUNT(e.id) as total_eps
      FROM anime a LEFT JOIN episodes e ON a.id = e.anime_id
      GROUP BY a.id ORDER BY latest_ep_date DESC LIMIT 20
    `).all()
    
    const popular = await db.prepare(`
      SELECT * FROM anime ORDER BY view_count DESC LIMIT 12
    `).all()
    
    const ongoing = await db.prepare(`
      SELECT a.*, MAX(e.episode_number) as latest_ep
      FROM anime a LEFT JOIN episodes e ON a.id = e.anime_id
      WHERE a.status = 'Ongoing'
      GROUP BY a.id ORDER BY a.updated_at DESC LIMIT 12
    `).all()
    
    const schedule = await db.prepare(`
      SELECT s.*, a.title, a.cover_image, a.slug, a.status
      FROM schedule s JOIN anime a ON s.anime_id = a.id
      ORDER BY s.day_of_week
    `).all()

    const hasData = (featured.results?.length || 0) + (trending.results?.length || 0) + (popular.results?.length || 0) > 0
    if (!hasData) throw new Error('Empty DB')

    return c.html(homePage({
      featured: featured.results as any[],
      trending: trending.results as any[],
      recent: recent.results as any[],
      popular: popular.results as any[],
      ongoing: ongoing.results as any[],
      schedule: schedule.results as any[],
    }))
  } catch(e) {
    const featured = DEMO_ANIME.filter(a => a.is_featured).slice(0, 5)
    const trending = DEMO_ANIME.filter(a => a.is_trending).slice(0, 10)
    const recent = DEMO_ANIME.map(demoAnimeWithLatestEp).slice(0, 12)
    const popular = [...DEMO_ANIME].sort((a,b) => b.view_count - a.view_count).slice(0, 12)
    const ongoing = DEMO_ANIME.filter(a => a.status === 'Ongoing').map(demoAnimeWithLatestEp).slice(0, 12)
    
    return c.html(homePage({
      featured,
      trending,
      recent,
      popular,
      ongoing,
      schedule: DEMO_SCHEDULE,
    }))
  }
})

app.get('/anime/:slug', async (c) => {
  const slug = c.req.param('slug')
  const db = c.env?.DB
  
  const demoAnime = DEMO_ANIME.find(a => a.slug === slug)
  
  try {
    if (!db) throw new Error('No DB')
    const anime = await db.prepare('SELECT * FROM anime WHERE slug = ?').bind(slug).first()
    if (!anime) {
      if (demoAnime) {
        const episodes = getDemoEpisodes(demoAnime.id, slug, demoAnime.latest_ep || 12)
        const related = DEMO_ANIME.filter(a => a.slug !== slug).slice(0, 8)
        return c.html(animePage({ anime: demoAnime, episodes, related }))
      }
      return c.html(notFoundPage(), 404)
    }
    
    const episodes = await db.prepare(
      'SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC'
    ).bind((anime as any).id).all()
    
    const related = await db.prepare(`
      SELECT * FROM anime WHERE id != ? ORDER BY RANDOM() LIMIT 8
    `).bind((anime as any).id).all()
    
    await db.prepare('UPDATE anime SET view_count = view_count + 1 WHERE id = ?').bind((anime as any).id).run()

    let eps = episodes.results as any[]
    if (eps.length === 0) {
      eps = getDemoEpisodes((anime as any).id, slug, 12)
    }
    
    return c.html(animePage({ anime: anime as any, episodes: eps, related: related.results as any[] }))
  } catch(e) {
    if (demoAnime) {
      const episodes = getDemoEpisodes(demoAnime.id, slug, demoAnime.latest_ep || 12)
      const related = DEMO_ANIME.filter(a => a.slug !== slug).slice(0, 8)
      return c.html(animePage({ anime: demoAnime, episodes, related }))
    }
    return c.html(notFoundPage(), 404)
  }
})

app.get('/watch/:watchpath{.+-episode-[0-9]+}', async (c) => {
  const watchpath = c.req.param('watchpath')
  const epMatch = watchpath.match(/^(.+)-episode-(\d+)$/)
  if (!epMatch) return c.html(notFoundPage(), 404)
  const slug = epMatch[1]
  const epNum = parseInt(epMatch[2])
  const db = c.env?.DB
  
  const demoAnime = DEMO_ANIME.find(a => a.slug === slug)
  
  try {
    if (!db) throw new Error('No DB')
    const anime = await db.prepare('SELECT * FROM anime WHERE slug = ?').bind(slug).first()
    if (!anime) {
      if (demoAnime) {
        return serveDemoWatchPage(c, demoAnime, slug, epNum)
      }
      return c.html(notFoundPage(), 404)
    }
    
    const episode = await db.prepare(
      'SELECT * FROM episodes WHERE anime_id = ? AND episode_number = ?'
    ).bind((anime as any).id, epNum).first()
    
    if (!episode) {
      if (demoAnime) return serveDemoWatchPage(c, demoAnime, slug, epNum)
      return c.html(notFoundPage(), 404)
    }
    
    const allEpisodes = await db.prepare(
      'SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC'
    ).bind((anime as any).id).all()
    
    let allEps = allEpisodes.results as any[]
    if (allEps.length === 0) {
      allEps = getDemoEpisodes((anime as any).id, slug, 12)
    }
    
    const prevEp = allEps.find((e: any) => e.episode_number === epNum - 1) || null
    const nextEp = allEps.find((e: any) => e.episode_number === epNum + 1) || null
    
    await db.prepare('UPDATE episodes SET view_count = view_count + 1 WHERE id = ?').bind((episode as any).id).run()
    
    return c.html(watchPage({ 
      anime: anime as any, 
      episode: episode as any, 
      allEpisodes: allEps,
      prevEp,
      nextEp
    }))
  } catch(e) {
    if (demoAnime) return serveDemoWatchPage(c, demoAnime, slug, epNum)
    return c.html(notFoundPage(), 404)
  }
})

function serveDemoWatchPage(c: any, anime: any, slug: string, epNum: number) {
  const totalEps = anime.latest_ep || 12
  const allEps = getDemoEpisodes(anime.id, slug, Math.min(totalEps, 12))
  const episode = allEps.find((e: any) => e.episode_number === epNum) || allEps[0]
  if (!episode) return c.html(notFoundPage(), 404)
  const prevEp = allEps.find((e: any) => e.episode_number === epNum - 1) || null
  const nextEp = allEps.find((e: any) => e.episode_number === epNum + 1) || null
  return c.html(watchPage({ anime, episode, allEpisodes: allEps, prevEp, nextEp }))
}

app.get('/search', async (c) => {
  const q = c.req.query('q') || ''
  const status = c.req.query('status') || ''
  const genre = c.req.query('genre') || ''
  const type = c.req.query('type') || ''
  const year = c.req.query('year') || ''
  const page = parseInt(c.req.query('page') || '1')
  const perPage = 24
  const db = c.env?.DB
  
  try {
    if (!db) throw new Error('No DB')
    let query = 'SELECT a.*, MAX(e.episode_number) as latest_ep FROM anime a LEFT JOIN episodes e ON a.id = e.anime_id WHERE 1=1'
    let countQuery = 'SELECT COUNT(DISTINCT a.id) as total FROM anime a WHERE 1=1'
    const params: any[] = []
    const countParams: any[] = []
    
    if (q) {
      const cond = ' AND (a.title LIKE ? OR a.title_native LIKE ? OR a.title_english LIKE ?)'
      query += cond; countQuery += cond
      params.push(`%${q}%`, `%${q}%`, `%${q}%`)
      countParams.push(`%${q}%`, `%${q}%`, `%${q}%`)
    }
    if (status) { const cond = ' AND a.status = ?'; query += cond; countQuery += cond; params.push(status); countParams.push(status) }
    if (genre) { const cond = ' AND a.genres LIKE ?'; query += cond; countQuery += cond; params.push(`%${genre}%`); countParams.push(`%${genre}%`) }
    if (type) { const cond = ' AND a.type = ?'; query += cond; countQuery += cond; params.push(type); countParams.push(type) }
    if (year) { const cond = ' AND a.release_year = ?'; query += cond; countQuery += cond; params.push(parseInt(year)); countParams.push(parseInt(year)) }
    
    query += ' GROUP BY a.id ORDER BY a.view_count DESC LIMIT ? OFFSET ?'
    params.push(perPage, (page - 1) * perPage)
    
    const [results, countRes] = await Promise.all([
      db.prepare(query).bind(...params).all(),
      db.prepare(countQuery).bind(...countParams).first()
    ])
    const total = (countRes as any)?.total || 0
    
    if (total === 0 && !q && !status && !genre && !type && !year) throw new Error('Empty DB')
    
    return c.html(searchPage({ 
      results: results.results as any[], 
      total, page, perPage,
      q, status, genre, type
    }))
  } catch(e) {
    let results = DEMO_ANIME.map(demoAnimeWithLatestEp)
    if (q) results = results.filter(a => 
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      (a.title_native || '').toLowerCase().includes(q.toLowerCase())
    )
    if (status) results = results.filter(a => a.status === status)
    if (genre) results = results.filter(a => (a.genres || '').toLowerCase().includes(genre.toLowerCase()))
    if (type) results = results.filter(a => a.type === type)
    if (year) results = results.filter(a => String(a.release_year) === year)
    
    const total = results.length
    const paginated = results.slice((page-1)*perPage, page*perPage)
    
    return c.html(searchPage({ 
      results: paginated, 
      total, page, perPage,
      q, status, genre, type
    }))
  }
})

// Quick search API
app.get('/api/search/quick', async (c) => {
  const q = c.req.query('q') || ''
  const db = c.env?.DB
  try {
    if (!db || !q) throw new Error('No DB')
    const results = await db.prepare(`
      SELECT id, title, title_native, slug, cover_image, type, status, release_year
      FROM anime WHERE title LIKE ? OR title_native LIKE ? OR title_english LIKE ?
      ORDER BY view_count DESC LIMIT 8
    `).bind(`%${q}%`, `%${q}%`, `%${q}%`).all()
    if (!results.results?.length) throw new Error('No results')
    return c.json({ data: results.results })
  } catch {
    const filtered = q ? DEMO_ANIME.filter(a =>
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      (a.title_native || '').toLowerCase().includes(q.toLowerCase())
    ).slice(0, 8) : DEMO_ANIME.slice(0, 8)
    return c.json({ data: filtered })
  }
})

app.get('/user/login', (c) => c.html(loginPage()))
app.get('/user/register', (c) => c.html(registerPage()))

// Admin panel
app.get('/admin', async (c) => {
  return c.html(adminPage('dashboard'))
})
app.get('/admin/:section', async (c) => {
  const section = c.req.param('section')
  return c.html(adminPage(section))
})
app.get('/admin/:section/:id', async (c) => {
  const section = c.req.param('section')
  return c.html(adminPage(section))
})

// Schedule page
app.get('/schedule', async (c) => {
  return c.html(schedulePage())
})

// Static pages
app.get('/about', (c) => c.html(aboutPage()))
app.get('/contact', (c) => c.html(contactPage()))
app.get('/privacy', (c) => c.html(privacyPage()))
app.get('/terms', (c) => c.html(termsPage()))
app.get('/dmca', (c) => c.html(dmcaPage()))

// User pages
app.get('/user/watchlist', (c) => c.html(watchlistPage()))
app.get('/user/profile', (c) => c.html(profilePage()))
app.get('/user/history', (c) => c.html(historyPage()))
app.get('/user/settings', (c) => c.html(settingsPage()))
app.get('/user/membership', (c) => c.redirect('/user/register'))

// Schedule API
app.get('/api/schedule', async (c) => {
  const db = c.env?.DB
  try {
    if (!db) throw new Error('No DB')
    const data = await db.prepare(`
      SELECT s.*, a.title, a.cover_image, a.slug, a.status
      FROM schedule s JOIN anime a ON s.anime_id = a.id
      ORDER BY s.day_of_week, s.air_time
    `).all()
    if (!data.results?.length) throw new Error('Empty')
    return c.json({ success: true, data: data.results })
  } catch(e: any) {
    return c.json({ success: true, data: DEMO_SCHEDULE })
  }
})

// 404
app.notFound((c) => c.html(notFoundPage(), 404))

export default app
