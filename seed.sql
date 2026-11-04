-- ==================== DonghuaLand Seed Data ====================
-- Admin password: admin1122
-- Hash of 'admin1122' with salt 'donghua-salt-2024' using SHA-256
-- Pre-computed: run node -e "const c=require('crypto');console.log(Buffer.from(c.createHash('sha256').update('admin1122:donghua-salt-2024').digest()).toString('base64'))"
-- Result: GiPKiJgWdTnE5swPfQlb/9YP7g3eMhRQScIHb3w9tFo=
INSERT OR IGNORE INTO admins (username, email, password_hash) VALUES 
('admin', 'admin@donghualand.vip', 'GiPKiJgWdTnE5swPfQlb/9YP7g3eMhRQScIHb3w9tFo=');

-- Default settings
INSERT OR IGNORE INTO settings (key, value) VALUES 
('site_name', 'DonghuaLand'),
('maintenance_mode', '0'),
('registration_enabled', '1'),
('demo_video_mode', '1'),
('comments_enabled', '1'),
('comments_require_login', '1'),
('comments_auto_approve', '1');

-- Insert some popular Chinese anime (Donghua)
INSERT OR IGNORE INTO anime (
  title, title_native, title_english, slug, description, 
  cover_image, banner_image, status, type, release_year,
  genres, studios, rating, vote_count, is_featured, is_trending, is_popular, view_count
) VALUES 
(
  'Renegade Immortal', '仙逆', 'Renegade Immortal',
  'renegade-immortal',
  'Wang Lin is a very smart boy with loving parents. Although he and his parents are shunned by the rest of their relatives, his parents have always held high hope for him. Wang Lin works hard to become an immortal but fails to enter a cultivation school. He eventually finds a dimension-splitting stone and starts his long journey to become an immortal.',
  'https://image.tmdb.org/t/p/w500/9vBqv4a2KArKzjS0oHLYj7u2Q4e.jpg',
  'https://image.tmdb.org/t/p/original/9vBqv4a2KArKzjS0oHLYj7u2Q4e.jpg',
  'Ongoing', 'ONA', 2023,
  '["Action", "Adventure", "Fantasy", "Historical"]',
  '["Sparkly Key Animation"]',
  8.5, 12500, 1, 1, 1, 85000
),
(
  'Battle Through The Heavens Season 5', '斗破苍穹年番', 'Battle Through the Heavens S5',
  'battle-through-the-heavens-season-5',
  'Fifth season of Doupo Cangqiong. Xiao Yan continues his cultivation journey, facing new enemies and challenges as he searches for his missing mother.',
  'https://image.tmdb.org/t/p/w500/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg',
  'https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg',
  'Ongoing', 'ONA', 2022,
  '["Action", "Adventure", "Fantasy", "Martial Arts"]',
  '["B.C May Animation"]',
  8.4, 18900, 0, 1, 1, 120000
),
(
  'Swallowed Star', '吞噬星空', 'Swallowed Star',
  'swallowed-star',
  'After a global catastrophe, monsters emerged and humanity had to evolve or perish. Luo Feng, an exceptional young talent, survives and must now build his power in a new dangerous world.',
  'https://image.tmdb.org/t/p/w500/7QMsOTMUSwF0Q8e5BV7kS1GMSQK.jpg',
  'https://image.tmdb.org/t/p/original/7QMsOTMUSwF0Q8e5BV7kS1GMSQK.jpg',
  'Ongoing', 'ONA', 2023,
  '["Action", "Adventure", "Fantasy", "Sci-Fi"]',
  '["Sparkly Key Animation"]',
  8.4, 15300, 0, 1, 1, 98000
),
(
  'Soul Land 2: The Peerless Tang Clan', '斗罗大陆Ⅱ绝世唐门', 'Soul Land II',
  'soul-land-2-the-peerless-tang-clan',
  'A strange continent in another world. No magic, no battle qi, no martial arts, only martial spirits. Ten thousand years after the Tang clan was founded on the Douluo Continent.',
  'https://image.tmdb.org/t/p/w500/5mTrTWwI0iHs97BAGanCQa2D7Gb.jpg',
  'https://image.tmdb.org/t/p/original/5mTrTWwI0iHs97BAGanCQa2D7Gb.jpg',
  'Ongoing', 'ONA', 2023,
  '["Action", "Adventure", "Fantasy", "Martial Arts"]',
  '["Sparkly Key Animation"]',
  8.1, 9800, 0, 0, 1, 76000
),
(
  'Tales of Herding Gods', '牧神记', 'Celestial Shepherd Chronicles',
  'tales-of-herding-gods',
  'In the Disabled Elderly Village, there live nine elderly people with unpredictable origins and the young man Qin Mu they raised. One day, the cows that Qin Mu was herding came across a piece of divine metal, initiating the young man''s journey to the outside world.',
  'https://image.tmdb.org/t/p/w500/vB8o2p4ETnrfiWEgVxHmHWP9yRl.jpg',
  'https://image.tmdb.org/t/p/original/vB8o2p4ETnrfiWEgVxHmHWP9yRl.jpg',
  'Ongoing', 'ONA', 2024,
  '["Action", "Adventure", "Fantasy", "Historical"]',
  '["Tencent Animation"]',
  8.3, 7600, 0, 1, 1, 54000
),
(
  'Sword and Fairy 3', '仙剑奇侠传三', 'Chinese Paladin 3',
  'sword-and-fairy-3',
  'A thousand years ago, the divine general Fei Peng and the Demon Sovereign Chong Lou engaged in a fierce battle in the New Immortal Realm. The divine sword Zhao Dan fell to the mortal world. A millennium later, Jing Tian and his companions embark on an adventure to collect the Five Spirit Orbs.',
  'https://image.tmdb.org/t/p/w500/9dJfDFg6Lgm9xBOaJxqkXqcjn6k.jpg',
  'https://image.tmdb.org/t/p/original/9dJfDFg6Lgm9xBOaJxqkXqcjn6k.jpg',
  'Ongoing', 'ONA', 2025,
  '["Action", "Adventure", "Fantasy", "Historical", "Martial Arts"]',
  '["WeTV"]',
  8.7, 5200, 0, 1, 1, 42000
),
(
  'Soul Land', '斗罗大陆', 'Douluo Dalu',
  'soul-land',
  'Tang San, a proud disciple of the Tang Outer Sect, is expelled after stealing core knowledge of the sect. He sacrifices himself by jumping off the forbidden area cliff. Unexpectedly, he is reincarnated in the Douluo Continent, a world where everyone possesses a Martial Soul.',
  'https://image.tmdb.org/t/p/w500/kEf8PjYXFbQ1hfMNPNQNI1KJdXh.jpg',
  'https://image.tmdb.org/t/p/original/kEf8PjYXFbQ1hfMNPNQNI1KJdXh.jpg',
  'Completed', 'ONA', 2018,
  '["Action", "Adventure", "Fantasy", "Martial Arts"]',
  '["Tencent Animation"]',
  8.8, 45000, 0, 0, 1, 320000
),
(
  'The Daily Life of the Immortal King', '仙王的日常生活', 'Daily Life of the Immortal King',
  'daily-life-immortal-king',
  'Wang Ling, a cultivation genius who has defeated powerful enemies since he was a baby, now just wants to eat instant noodles and get through high school. But the universe refuses to leave him alone.',
  'https://image.tmdb.org/t/p/w500/2JVwxlNBpKJFkWnkfTq3EiWJRiv.jpg',
  'https://image.tmdb.org/t/p/original/2JVwxlNBpKJFkWnkfTq3EiWJRiv.jpg',
  'Ongoing', 'ONA', 2020,
  '["Action", "Fantasy", "Comedy", "Slice of Life"]',
  '["Bilibili Animation"]',
  8.0, 22000, 0, 0, 1, 180000
),
(
  'Heaven Official''s Blessing', '天官赐福', 'Tian Guan Ci Fu',
  'heavens-official-blessing',
  'Eight hundred years ago, Xie Lian was the Crown Prince of the Xian Le kingdom, a beloved cultivator who ascended to the heavens. However, he was cast down to the mortal realm three times. Now he ascends for the fourth time with no followers.',
  'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
  'https://image.tmdb.org/t/p/original/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
  'Ongoing', 'ONA', 2020,
  '["Action", "Fantasy", "Romance", "Supernatural"]',
  '["Bilibili Animation"]',
  8.9, 38000, 0, 0, 1, 250000
),
(
  'Link Click', '时光代理人', 'Shiguang Dailiren',
  'link-click',
  'Lu Guang and Cheng Xiaoshi run a small photo studio. Cheng Xiaoshi has the ability to enter photos and experience the moments within them. Together with Lu Guang who can see the future by looking at photos, they take jobs to help their clients.',
  'https://image.tmdb.org/t/p/w500/3R2a1fYsyf5ADKNT3bCi8o4SXi1.jpg',
  'https://image.tmdb.org/t/p/original/3R2a1fYsyf5ADKNT3bCi8o4SXi1.jpg',
  'Ongoing', 'ONA', 2021,
  '["Mystery", "Drama", "Supernatural", "Sci-Fi"]',
  '["Bilibili Animation"]',
  9.1, 42000, 0, 1, 1, 290000
);

-- Insert weekly schedule
INSERT OR IGNORE INTO schedule (anime_id, day_of_week, air_time)
SELECT id, 'Monday', '20:00' FROM anime WHERE slug = 'renegade-immortal';
INSERT OR IGNORE INTO schedule (anime_id, day_of_week, air_time)
SELECT id, 'Tuesday', '19:00' FROM anime WHERE slug = 'swallowed-star';
INSERT OR IGNORE INTO schedule (anime_id, day_of_week, air_time)
SELECT id, 'Wednesday', '21:00' FROM anime WHERE slug = 'sword-and-fairy-3';
INSERT OR IGNORE INTO schedule (anime_id, day_of_week, air_time)
SELECT id, 'Thursday', '20:00' FROM anime WHERE slug = 'battle-through-the-heavens-season-5';
INSERT OR IGNORE INTO schedule (anime_id, day_of_week, air_time)
SELECT id, 'Friday', '20:00' FROM anime WHERE slug = 'tales-of-herding-gods';
INSERT OR IGNORE INTO schedule (anime_id, day_of_week, air_time)
SELECT id, 'Saturday', '21:00' FROM anime WHERE slug = 'link-click';
INSERT OR IGNORE INTO schedule (anime_id, day_of_week, air_time)
SELECT id, 'Sunday', '20:00' FROM anime WHERE slug = 'heavens-official-blessing';

-- Insert sample episodes for Sword and Fairy 3 (demo video)
INSERT OR IGNORE INTO episodes (anime_id, episode_number, title, video_url, air_date)
SELECT id, 1, 'The Fallen General', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '2025-01-01' FROM anime WHERE slug = 'sword-and-fairy-3';
INSERT OR IGNORE INTO episodes (anime_id, episode_number, title, video_url, air_date)
SELECT id, 2, 'The Demonic Sword', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '2025-01-08' FROM anime WHERE slug = 'sword-and-fairy-3';
INSERT OR IGNORE INTO episodes (anime_id, episode_number, title, video_url, air_date)
SELECT id, 3, 'Five Spirit Orbs', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '2025-01-15' FROM anime WHERE slug = 'sword-and-fairy-3';

-- Insert sample episodes for Link Click (demo video)
INSERT OR IGNORE INTO episodes (anime_id, episode_number, title, video_url, air_date)
SELECT id, 1, 'Entering the Photo', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '2021-04-30' FROM anime WHERE slug = 'link-click';
INSERT OR IGNORE INTO episodes (anime_id, episode_number, title, video_url, air_date)
SELECT id, 2, 'The Milk Tea Girl', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '2021-05-07' FROM anime WHERE slug = 'link-click';
INSERT OR IGNORE INTO episodes (anime_id, episode_number, title, video_url, air_date)
SELECT id, 3, 'Three Rules', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '2021-05-14' FROM anime WHERE slug = 'link-click';

-- Update episode counts
UPDATE anime SET episode_count = (SELECT COUNT(*) FROM episodes WHERE anime_id = anime.id);

-- Sample comments (optional demo)
-- These won't insert until users exist, so skip for now
