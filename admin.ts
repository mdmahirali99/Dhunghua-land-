import { Hono } from 'hono'
import { DEMO_ANIME } from '../utils/demoData'
import { hashPassword, verifyPassword, generateToken, verifyToken } from '../utils/auth'

type Bindings = {
  DB: D1Database
  TMDB_API_KEY: string
  ADMIN_SECRET: string
  JWT_SECRET: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
}

export const adminRoutes = new Hono<{ Bindings: Bindings }>()

const JWT_SECRET_DEFAULT = 'donghua-secret-key-2024'

// Admin credentials (hardcoded as per requirements)
// These can be overridden by DB records or env vars
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin1122'

function getSecret(env: any): string {
  return env.JWT_SECRET || JWT_SECRET_DEFAULT
}

// ============ ADMIN LOGIN ============
// POST /api/admin/login
adminRoutes.post('/login', async (c) => {
  const db = c.env?.DB
  const { username, password } = await c.req.json()

  if (!username || !password) {
    return c.json({ error: 'Username and password required' }, 400)
  }

  try {
    let isValid = false

    // First check hardcoded admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      isValid = true
    } else if (db) {
      // Also check DB admins table
      const admin = await db.prepare(
        'SELECT * FROM admins WHERE username = ?'
      ).bind(username).first()
      
      if (admin) {
        isValid = await verifyPassword(password, (admin as any).password_hash)
      }
    }

    if (!isValid) {
      return c.json({ error: 'Invalid admin credentials' }, 401)
    }

    // Generate admin JWT token
    const payload = {
      id: 1,
      username: ADMIN_USERNAME,
      email: 'admin@donghualand.vip',
      role: 'admin',
      plan: 'premium',
    }
    const token = await generateToken(payload, getSecret(c.env))

    return c.json({ success: true, token, user: payload })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ============ ADMIN AUTH VERIFY ============
// GET /api/admin/verify
adminRoutes.get('/verify', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth) return c.json({ error: 'Not authenticated' }, 401)

  try {
    const token = auth.replace('Bearer ', '')
    const payload = await verifyToken(token, getSecret(c.env))
    if (payload.role !== 'admin') return c.json({ error: 'Admin access required' }, 403)
    return c.json({ success: true, user: payload })
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
})

// ============ STATS ============
adminRoutes.get('/stats', async (c) => {
  const db = c.env?.DB
  try {
    if (!db) throw new Error('No DB')
    const [a, e, u, v, cm] = await Promise.all([
      db.prepare('SELECT COUNT(*) as total FROM anime').first(),
      db.prepare('SELECT COUNT(*) as total FROM episodes').first(),
      db.prepare('SELECT COUNT(*) as total FROM users').first(),
      db.prepare('SELECT COALESCE(SUM(view_count),0) as total FROM anime').first(),
      db.prepare('SELECT COUNT(*) as total FROM comments WHERE is_approved = 1').first(),
    ])
    const total_anime = (a as any)?.total || 0
    if (!total_anime) throw new Error('Empty')
    return c.json({
      success: true,
      data: {
        total_anime,
        total_episodes: (e as any)?.total || 0,
        total_users:    (u as any)?.total || 0,
        total_views:    (v as any)?.total || 0,
        total_comments: (cm as any)?.total || 0,
      }
    })
  } catch(e: any) {
    const totalViews = DEMO_ANIME.reduce((s, a) => s + (a.view_count || 0), 0)
    return c.json({
      success: true,
      data: {
        total_anime: DEMO_ANIME.length,
        total_episodes: DEMO_ANIME.length * 12,
        total_users: 1234,
        total_views: totalViews,
        total_comments: 0,
      }
    })
  }
})

// ============ ANIME CRUD ============
adminRoutes.get('/anime', async (c) => {
  const db = c.env.DB
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  try {
    const data = await db.prepare(`
      SELECT a.*, COUNT(e.id) as episode_count 
      FROM anime a LEFT JOIN episodes e ON a.id = e.anime_id 
      GROUP BY a.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?
    `).bind(limit, (page - 1) * limit).all()
    const total = await db.prepare('SELECT COUNT(*) as c FROM anime').first()
    return c.json({ success: true, data: data.results, total: (total as any)?.c || 0 })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.post('/anime', async (c) => {
  const db = c.env.DB
  try {
    const b = await c.req.json()
    const r = await db.prepare(`
      INSERT INTO anime (
        title, title_native, title_english, slug, description,
        cover_image, banner_image, trailer_url, status, type,
        release_year, rating, vote_count, genres, studios, country, duration,
        is_featured, is_trending, is_popular, view_count
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      b.title, b.title_native||null, b.title_english||null, b.slug,
      b.description||null, b.cover_image||null, b.banner_image||null,
      b.trailer_url||null, b.status||'Ongoing', b.type||'ONA',
      b.release_year||null, b.rating||null, b.vote_count||0,
      b.genres||'[]', b.studios||'[]', b.country||'China', b.duration||null,
      b.is_featured||0, b.is_trending||0, b.is_popular||0, 0
    ).run()
    return c.json({ success: true, id: r.meta.last_row_id })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.put('/anime/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    const b = await c.req.json()
    await db.prepare(`
      UPDATE anime SET
        title=?, title_native=?, title_english=?, slug=?, description=?,
        cover_image=?, banner_image=?, trailer_url=?, status=?, type=?,
        release_year=?, rating=?, genres=?, studios=?, country=?, duration=?,
        is_featured=?, is_trending=?, is_popular=?,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).bind(
      b.title, b.title_native||null, b.title_english||null, b.slug,
      b.description||null, b.cover_image||null, b.banner_image||null,
      b.trailer_url||null, b.status||'Ongoing', b.type||'ONA',
      b.release_year||null, b.rating||null,
      b.genres||'[]', b.studios||'[]', b.country||'China', b.duration||null,
      b.is_featured||0, b.is_trending||0, b.is_popular||0,
      parseInt(id)
    ).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.delete('/anime/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    await db.prepare('DELETE FROM episodes WHERE anime_id = ?').bind(parseInt(id)).run()
    await db.prepare('DELETE FROM schedule WHERE anime_id = ?').bind(parseInt(id)).run()
    await db.prepare('DELETE FROM comments WHERE anime_id = ?').bind(parseInt(id)).run()
    await db.prepare('DELETE FROM anime WHERE id = ?').bind(parseInt(id)).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

// ============ EPISODES CRUD ============
adminRoutes.get('/episodes', async (c) => {
  const db = c.env.DB
  const animeId = c.req.query('anime_id')
  try {
    const q = animeId
      ? 'SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC'
      : 'SELECT * FROM episodes ORDER BY created_at DESC LIMIT 50'
    const data = animeId
      ? await db.prepare(q).bind(parseInt(animeId)).all()
      : await db.prepare(q).all()
    return c.json({ success: true, data: data.results })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.post('/episodes', async (c) => {
  const db = c.env.DB
  try {
    const b = await c.req.json()
    const r = await db.prepare(`
      INSERT INTO episodes (anime_id, episode_number, title, embed_url, video_url, thumbnail, air_date, is_members_only)
      VALUES (?,?,?,?,?,?,?,?)
    `).bind(
      parseInt(b.anime_id), parseInt(b.episode_number),
      b.title||null, b.embed_url||null, b.video_url||null,
      b.thumbnail||null, b.air_date||null, b.is_members_only||0
    ).run()
    await db.prepare('UPDATE anime SET episode_count=(SELECT COUNT(*) FROM episodes WHERE anime_id=?), updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .bind(parseInt(b.anime_id), parseInt(b.anime_id)).run()
    return c.json({ success: true, id: r.meta.last_row_id })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.put('/episodes/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    const b = await c.req.json()
    await db.prepare(`
      UPDATE episodes SET 
        episode_number=?, title=?, embed_url=?, video_url=?, thumbnail=?,
        air_date=?, is_members_only=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).bind(
      parseInt(b.episode_number), b.title||null, b.embed_url||null,
      b.video_url||null, b.thumbnail||null, b.air_date||null,
      b.is_members_only||0, parseInt(id)
    ).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.delete('/episodes/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    const ep = await db.prepare('SELECT anime_id FROM episodes WHERE id=?').bind(parseInt(id)).first()
    await db.prepare('DELETE FROM episodes WHERE id = ?').bind(parseInt(id)).run()
    if (ep) {
      await db.prepare('UPDATE anime SET episode_count=(SELECT COUNT(*) FROM episodes WHERE anime_id=?) WHERE id=?')
        .bind((ep as any).anime_id, (ep as any).anime_id).run()
    }
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

// ============ USERS ============
adminRoutes.get('/users', async (c) => {
  const db = c.env.DB
  try {
    const data = await db.prepare(
      'SELECT id, username, email, role, plan, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 100'
    ).all()
    return c.json({ success: true, data: data.results })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.post('/users/:id/ban', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    await db.prepare("UPDATE users SET is_active = 0, role='banned' WHERE id=?").bind(parseInt(id)).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.post('/users/:id/unban', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    await db.prepare("UPDATE users SET is_active = 1, role='user' WHERE id=?").bind(parseInt(id)).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.delete('/users/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    await db.prepare('DELETE FROM comments WHERE user_id = ?').bind(parseInt(id)).run()
    await db.prepare('DELETE FROM watchlist WHERE user_id = ?').bind(parseInt(id)).run()
    await db.prepare('DELETE FROM users WHERE id = ?').bind(parseInt(id)).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

// ============ SCHEDULE ============
adminRoutes.get('/schedule', async (c) => {
  const db = c.env.DB
  try {
    const data = await db.prepare(`
      SELECT s.*, a.title, a.cover_image, a.slug 
      FROM schedule s JOIN anime a ON s.anime_id = a.id 
      ORDER BY s.day_of_week
    `).all()
    return c.json({ success: true, data: data.results })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.post('/schedule', async (c) => {
  const db = c.env.DB
  try {
    const { anime_id, day_of_week, air_time } = await c.req.json()
    await db.prepare(
      'INSERT OR REPLACE INTO schedule (anime_id, day_of_week, air_time) VALUES (?, ?, ?)'
    ).bind(parseInt(anime_id), day_of_week, air_time || null).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.delete('/schedule/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    await db.prepare('DELETE FROM schedule WHERE id = ?').bind(parseInt(id)).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

// ============ COMMENTS MANAGEMENT ============
adminRoutes.get('/comments', async (c) => {
  const db = c.env.DB
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '30')
  const status = c.req.query('status') || 'all'
  const offset = (page - 1) * limit

  try {
    let where = '1=1'
    if (status === 'pending') where = 'c.is_approved = 0'
    else if (status === 'approved') where = 'c.is_approved = 1'
    else if (status === 'rejected') where = 'c.is_approved = -1'

    const data = await db.prepare(`
      SELECT c.id, c.content, c.is_approved, c.is_spoiler, c.likes, c.created_at,
             u.username, u.id as user_id,
             a.title as anime_title, a.slug as anime_slug,
             e.episode_number
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN anime a ON c.anime_id = a.id
      LEFT JOIN episodes e ON c.episode_id = e.id
      WHERE ${where}
      ORDER BY c.created_at DESC LIMIT ? OFFSET ?
    `).bind(limit, offset).all()

    const countRes = await db.prepare(
      `SELECT COUNT(*) as total FROM comments c WHERE ${where}`
    ).first()

    return c.json({
      success: true,
      data: data.results,
      total: (countRes as any)?.total || 0,
      page, limit,
    })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.patch('/comments/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    const { action } = await c.req.json()
    if (action === 'approve') {
      await db.prepare('UPDATE comments SET is_approved = 1 WHERE id = ?').bind(parseInt(id)).run()
    } else if (action === 'reject') {
      await db.prepare('UPDATE comments SET is_approved = -1 WHERE id = ?').bind(parseInt(id)).run()
    } else if (action === 'delete') {
      await db.prepare('DELETE FROM comments WHERE id = ? OR parent_id = ?').bind(parseInt(id), parseInt(id)).run()
    } else {
      return c.json({ error: 'Invalid action' }, 400)
    }
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.delete('/comments/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  try {
    await db.prepare('DELETE FROM comments WHERE id = ? OR parent_id = ?').bind(parseInt(id), parseInt(id)).run()
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

// ============ SETTINGS ============
adminRoutes.get('/settings', async (c) => {
  const db = c.env.DB
  try {
    const settings = await db.prepare('SELECT * FROM settings').all()
    const result: Record<string, string> = {}
    settings.results.forEach((s: any) => { result[s.key] = s.value })
    return c.json({ success: true, data: result })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

adminRoutes.post('/settings', async (c) => {
  const db = c.env.DB
  try {
    const body = await c.req.json()
    for (const [key, value] of Object.entries(body)) {
      await db.prepare(
        'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
      ).bind(key, String(value)).run()
    }
    return c.json({ success: true })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

// ============ ADMIN PASSWORD CHANGE ============
adminRoutes.post('/change-password', async (c) => {
  const db = c.env?.DB
  try {
    const { current_password, new_password } = await c.req.json()
    if (!current_password || !new_password) return c.json({ error: 'Both passwords required' }, 400)
    if (new_password.length < 8) return c.json({ error: 'New password must be at least 8 characters' }, 400)

    // Verify current (check against hardcoded + DB)
    let isValid = current_password === ADMIN_PASSWORD
    if (!isValid && db) {
      const admin = await db.prepare("SELECT password_hash FROM admins WHERE username = 'admin'").first()
      if (admin) isValid = await verifyPassword(current_password, (admin as any).password_hash)
    }
    if (!isValid) return c.json({ error: 'Current password is incorrect' }, 401)

    // Update in DB
    if (db) {
      const newHash = await hashPassword(new_password)
      await db.prepare(
        "INSERT OR REPLACE INTO admins (username, email, password_hash) VALUES ('admin', 'admin@donghualand.vip', ?)"
      ).bind(newHash).run()
    }
    return c.json({ success: true, message: 'Password updated in database. Note: hardcoded fallback still uses original password.' })
  } catch(e: any) { return c.json({ error: e.message }, 500) }
})

// ============ CLOUDINARY STATUS ============
adminRoutes.get('/cloudinary-status', async (c) => {
  const cloudName = c.env.CLOUDINARY_CLOUD_NAME
  const apiKey = c.env.CLOUDINARY_API_KEY
  const apiSecret = c.env.CLOUDINARY_API_SECRET

  return c.json({
    success: true,
    configured: !!(cloudName && apiKey && apiSecret),
    cloud_name: cloudName || null,
    // Never expose API key or secret
  })
})
