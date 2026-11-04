import { layout } from './layout'

export function adminPage(section: string = 'dashboard') {
  const nav = [
    { id: 'dashboard', icon: 'fas fa-chart-pie', label: 'Dashboard' },
    { id: 'anime', icon: 'fas fa-dragon', label: 'Anime List' },
    { id: 'add-anime', icon: 'fas fa-plus-circle', label: 'Add Anime' },
    { id: 'episodes', icon: 'fas fa-film', label: 'Episodes' },
    { id: 'users', icon: 'fas fa-users', label: 'Users' },
    { id: 'comments', icon: 'fas fa-comments', label: 'Comments' },
    { id: 'schedule', icon: 'fas fa-calendar-alt', label: 'Schedule' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Settings' },
  ]

  const adminCSS = `
<style>
.admin-layout { display:flex; min-height:calc(100vh - var(--hh)); }
.admin-sidebar {
  width:220px; flex-shrink:0;
  background:var(--bg2); border-right:1px solid var(--border);
  padding:16px 0; overflow-y:auto;
  position:sticky; top:var(--hh); height:calc(100vh - var(--hh));
}
.admin-logo-row { padding:4px 18px 18px; border-bottom:1px solid var(--border); margin-bottom:8px; }
.admin-logo-row a { font-size:16px; font-weight:800; color:var(--text1); display:flex; align-items:center; gap:8px; }
.admin-logo-row a i { color:var(--purple2); }
.admin-logo-row .sub { font-size:10px; color:var(--text3); text-transform:uppercase; letter-spacing:1px; margin-top:3px; font-weight:700; }
.admin-nav-item {
  display:flex; align-items:center; gap:10px;
  padding:9px 18px; font-size:13px; font-weight:500; color:var(--text3);
  cursor:pointer; transition:var(--trans);
}
.admin-nav-item:hover { color:var(--text1); background:rgba(255,255,255,0.04); }
.admin-nav-item.active { color:var(--purple2); background:var(--purple-dim); border-right:2px solid var(--purple); }
.admin-nav-item i { width:16px; text-align:center; font-size:13px; }
.admin-nav-sep { height:1px; background:var(--border); margin:8px 0; }
.admin-main { flex:1; padding:24px; overflow-x:hidden; min-width:0; }
.admin-page { display:none; }
.admin-page.active { display:block; }
.admin-page-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; flex-wrap:wrap; gap:12px; }
.admin-page-title { font-size:20px; font-weight:800; color:var(--text1); }
.admin-btn {
  display:inline-flex; align-items:center; gap:7px;
  padding:8px 18px; border-radius:var(--r8);
  font-size:13px; font-weight:700; cursor:pointer; transition:var(--trans);
}
.admin-btn-purple { background:var(--purple); color:#fff; border:none; }
.admin-btn-purple:hover { background:var(--purple2); }
.admin-btn-outline { background:transparent; color:var(--text2); border:1px solid var(--border2); }
.admin-btn-outline:hover { border-color:var(--purple); color:var(--purple2); }
.admin-btn-danger { background:rgba(232,64,64,0.1); color:var(--red); border:1px solid rgba(232,64,64,0.3); }
.admin-btn-danger:hover { background:var(--red); color:#fff; }

.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
.stat-card { background:var(--bg3); border:1px solid var(--border); border-radius:var(--r12); padding:18px; display:flex; align-items:center; gap:14px; }
.stat-icon { width:46px; height:46px; border-radius:var(--r10); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.si-purple { background:var(--purple-dim); color:var(--purple2); }
.si-green  { background:rgba(0,208,132,0.12); color:var(--green); }
.si-blue   { background:rgba(52,152,219,0.12); color:var(--blue); }
.si-gold   { background:rgba(241,196,15,0.12); color:var(--gold); }
.stat-num { font-size:28px; font-weight:900; color:var(--text1); line-height:1; }
.stat-desc { font-size:12px; color:var(--text3); margin-top:2px; }

/* Tables */
.admin-table-card { background:var(--bg3); border:1px solid var(--border); border-radius:var(--r12); overflow:hidden; margin-bottom:20px; }
.admin-tc-head { padding:14px 18px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.admin-tc-title { font-size:14px; font-weight:700; color:var(--text1); }
.admin-tbl { width:100%; border-collapse:collapse; }
.admin-tbl th { padding:10px 14px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--text3); border-bottom:1px solid var(--border); background:var(--bg4); }
.admin-tbl td { padding:11px 14px; border-bottom:1px solid var(--border); font-size:13px; color:var(--text2); vertical-align:middle; }
.admin-tbl tr:last-child td { border-bottom:none; }
.admin-tbl tr:hover td { background:var(--bg4); }
.anime-cell-wrap { display:flex; align-items:center; gap:10px; }
.cell-poster { width:36px; height:50px; border-radius:4px; object-fit:cover; flex-shrink:0; }
.cell-name { font-size:13px; font-weight:600; color:var(--text1); }
.cell-native { font-size:11px; color:var(--text3); }
.tbl-act { display:flex; align-items:center; gap:6px; }
.tbl-btn { padding:5px 10px; border-radius:var(--r6); font-size:11px; font-weight:700; cursor:pointer; transition:var(--trans); white-space:nowrap; }
.tbl-edit { background:var(--purple-dim); color:var(--purple2); border:1px solid rgba(108,92,231,0.3); }
.tbl-edit:hover { background:var(--purple); color:#fff; }
.tbl-del { background:rgba(232,64,64,0.08); color:var(--red); border:1px solid rgba(232,64,64,0.25); }
.tbl-del:hover { background:var(--red); color:#fff; }
.tbl-ep { background:rgba(52,152,219,0.1); color:var(--blue); border:1px solid rgba(52,152,219,0.3); }
.tbl-ep:hover { background:var(--blue); color:#fff; }

/* Admin search bar */
.admin-search-row { display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
.admin-search-input { flex:1; min-width:200px; background:var(--bg4); border:1px solid var(--border2); border-radius:var(--r8); padding:9px 14px; color:var(--text1); font-size:13px; outline:none; transition:var(--trans); }
.admin-search-input:focus { border-color:var(--purple); }
.admin-select { background:var(--bg4); border:1px solid var(--border2); border-radius:var(--r8); padding:9px 12px; color:var(--text1); font-size:13px; outline:none; }

/* Forms */
.admin-form-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
.admin-form-grid .full { grid-column:1/-1; }
.admin-fg { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.admin-fg:last-child { margin-bottom:0; }
.admin-lbl { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text2); }
.admin-inp, .admin-sel, .admin-ta {
  background:var(--bg4); border:1px solid var(--border2); border-radius:var(--r8);
  padding:10px 12px; color:var(--text1); font-size:13px; outline:none;
  transition:border-color var(--trans); width:100%;
}
.admin-inp:focus, .admin-sel:focus, .admin-ta:focus { border-color:var(--purple); }
.admin-ta { min-height:100px; resize:vertical; }
.admin-sel option { background:var(--bg4); }
.admin-check { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text2); cursor:pointer; }
.admin-check input { accent-color:var(--purple); width:16px; height:16px; }
.form-section-title { font-size:13px; font-weight:800; color:var(--text1); margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid var(--border); }

/* TMDB panel */
.tmdb-panel { background:var(--bg4); border:1px solid var(--border); border-radius:var(--r10); padding:16px; margin-bottom:20px; }
.tmdb-hd { font-size:13px; font-weight:700; color:var(--text1); margin-bottom:12px; display:flex; align-items:center; gap:7px; }
.tmdb-hd i { color:var(--gold); }
.tmdb-inp-row { display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
.tmdb-inp { flex:1; min-width:180px; background:var(--bg5); border:1px solid var(--border2); border-radius:var(--r8); padding:9px 12px; color:var(--text1); font-size:13px; outline:none; transition:border-color var(--trans); }
.tmdb-inp:focus { border-color:var(--purple); }
.tmdb-results { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:8px; max-height:280px; overflow-y:auto; margin-top:10px; }
.tmdb-r { background:var(--bg5); border:1px solid var(--border); border-radius:var(--r8); overflow:hidden; cursor:pointer; transition:var(--trans); }
.tmdb-r:hover { border-color:var(--purple); }
.tmdb-r img { width:100%; aspect-ratio:2/3; object-fit:cover; }
.tmdb-r-name { padding:5px 7px; font-size:11px; font-weight:600; color:var(--text1); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tmdb-r-year { padding:0 7px 6px; font-size:10px; color:var(--text3); }

/* Image upload */
.img-upload-area { border:2px dashed var(--border2); border-radius:var(--r10); padding:20px; text-align:center; cursor:pointer; transition:var(--trans); }
.img-upload-area:hover { border-color:var(--purple); background:var(--purple-dim); }
.img-upload-area i { font-size:28px; color:var(--text4); display:block; margin-bottom:8px; }
.img-upload-area p { font-size:13px; color:var(--text3); margin-bottom:4px; }
.img-upload-area span { font-size:11px; color:var(--text4); }
.img-preview-grid { display:flex; gap:12px; flex-wrap:wrap; margin-top:10px; }
.img-preview-item { position:relative; }
.img-preview-item img { width:80px; aspect-ratio:2/3; object-fit:cover; border-radius:var(--r8); display:block; }
.img-preview-item .remove-img { position:absolute; top:-6px; right:-6px; width:20px; height:20px; border-radius:50%; background:var(--red); color:#fff; display:flex; align-items:center; justify-content:center; font-size:10px; cursor:pointer; }

/* Episode Add Modal */
.ep-add-panel { background:var(--bg4); border:1px solid var(--border); border-radius:var(--r10); padding:16px; margin-bottom:20px; }

/* Settings */
.settings-card { background:var(--bg3); border:1px solid var(--border); border-radius:var(--r12); padding:20px; margin-bottom:16px; }
.settings-title { font-size:14px; font-weight:700; color:var(--text1); margin-bottom:16px; }
.setting-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); }
.setting-row:last-child { border-bottom:none; }
.setting-info .setting-name { font-size:13px; font-weight:600; color:var(--text1); }
.setting-info .setting-desc { font-size:12px; color:var(--text3); margin-top:2px; }

@media(max-width:768px){
  .admin-layout { flex-direction:column; }
  .admin-sidebar { width:100%; position:static; height:auto; display:flex; overflow-x:auto; padding:6px 6px 0; border-right:none; border-bottom:1px solid var(--border); }
  .admin-logo-row { display:none; }
  .admin-nav-item { flex-direction:column; gap:2px; font-size:9px; padding:8px 12px; flex-shrink:0; white-space:nowrap; border-right:none!important; }
  .admin-nav-item.active { border-bottom:2px solid var(--purple); border-right:none; }
  .admin-nav-item i { font-size:18px; width:auto; }
  .admin-nav-sep { display:none; }
  .admin-main { padding:14px 12px; }
  .stats-grid { grid-template-columns:repeat(2,1fr); gap:10px; }
  .admin-form-grid { grid-template-columns:1fr; }
  .admin-form-grid .full { grid-column:1; }
}
</style>`

  const content = adminCSS + `
<div class="admin-layout" id="adminLayout">

  <!-- Sidebar -->
  <aside class="admin-sidebar">
    <div class="admin-logo-row">
      <a href="/"><i class="fas fa-dragon"></i> DonghuaLand</a>
      <div class="sub">Admin Panel</div>
    </div>
    ${nav.map(item => `
    <div class="admin-nav-item${section === item.id ? ' active' : ''}" onclick="showPage('${item.id}')" id="nav-${item.id}">
      <i class="${item.icon}"></i> ${item.label}
    </div>`).join('')}
    <div class="admin-nav-sep"></div>
    <div class="admin-nav-item" onclick="window.open('/', '_blank')">
      <i class="fas fa-external-link-alt"></i> View Site
    </div>
    <div class="admin-nav-item" style="color:var(--red);" onclick="adminLogout()">
      <i class="fas fa-sign-out-alt"></i> Logout
    </div>
  </aside>

  <!-- Main -->
  <div class="admin-main">

    <!-- ===== DASHBOARD ===== -->
    <div class="admin-page${section === 'dashboard' ? ' active' : ''}" id="admin-dashboard">
      <div class="admin-page-hd">
        <div class="admin-page-title">Dashboard</div>
        <span style="font-size:12px; color:var(--text3);" id="dashDate"></span>
      </div>
      <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));">
        <div class="stat-card">
          <div class="stat-icon si-purple"><i class="fas fa-dragon"></i></div>
          <div><div class="stat-num" id="sAnime">—</div><div class="stat-desc">Total Anime</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon si-blue"><i class="fas fa-film"></i></div>
          <div><div class="stat-num" id="sEps">—</div><div class="stat-desc">Episodes</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon si-green"><i class="fas fa-users"></i></div>
          <div><div class="stat-num" id="sUsers">—</div><div class="stat-desc">Users</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon si-gold"><i class="fas fa-eye"></i></div>
          <div><div class="stat-num" id="sViews">—</div><div class="stat-desc">Total Views</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(52,231,219,0.1);color:#34e7db;"><i class="fas fa-comments"></i></div>
          <div><div class="stat-num" id="sComments">—</div><div class="stat-desc">Comments</div></div>
        </div>
      </div>
      <div class="admin-table-card">
        <div class="admin-tc-head">
          <div class="admin-tc-title">Recent Anime</div>
          <button class="admin-btn admin-btn-purple" onclick="showPage('add-anime')"><i class="fas fa-plus"></i> Add Anime</button>
        </div>
        <div style="overflow-x:auto;">
          <table class="admin-tbl" id="dashRecentTable">
            <thead><tr><th>Anime</th><th>Status</th><th>Episodes</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody id="dashRecentBody"><tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text3);"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== ANIME LIST ===== -->
    <div class="admin-page${section === 'anime' ? ' active' : ''}" id="admin-anime">
      <div class="admin-page-hd">
        <div class="admin-page-title">Anime List</div>
        <button class="admin-btn admin-btn-purple" onclick="showPage('add-anime')"><i class="fas fa-plus"></i> Add Anime</button>
      </div>
      <div class="admin-search-row">
        <input type="text" class="admin-search-input" placeholder="Search anime..." oninput="filterAnimeList(this.value)" id="animeListSearch">
        <select class="admin-select" onchange="filterAnimeStatus(this.value)">
          <option value="">All Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>
      <div class="admin-table-card">
        <div style="overflow-x:auto;">
          <table class="admin-tbl">
            <thead><tr><th>Anime</th><th>Type</th><th>Status</th><th>Year</th><th>Rating</th><th>EPs</th><th>Actions</th></tr></thead>
            <tbody id="animeListBody"><tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text3);"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
      <div id="animeListPager" style="display:flex; gap:8px; justify-content:center; padding:16px 0; flex-wrap:wrap;"></div>
    </div>

    <!-- ===== ADD / EDIT ANIME ===== -->
    <div class="admin-page${section === 'add-anime' ? ' active' : ''}" id="admin-add-anime">
      <div class="admin-page-hd">
        <div class="admin-page-title" id="addAnimeTitle">Add Anime</div>
        <button class="admin-btn admin-btn-outline" onclick="resetAnimeForm()"><i class="fas fa-undo"></i> Reset</button>
      </div>
      <input type="hidden" id="editAnimeId" value="">

      <!-- TMDB Auto-fill (uses server-side TMDB_API_KEY secret) -->
      <div class="tmdb-panel">
        <div class="tmdb-hd"><i class="fas fa-magic"></i> Auto-fill from TMDB <span style="font-size:10px;color:var(--text4);font-weight:400;">(uses server TMDB_API_KEY secret)</span></div>
        <div class="tmdb-inp-row">
          <input type="text" class="tmdb-inp" id="tmdbQuery" placeholder="Search anime title in TMDB..." style="flex:2;">
          <button class="admin-btn admin-btn-purple" onclick="tmdbSearch()"><i class="fas fa-search"></i> Search TMDB</button>
        </div>
        <div style="font-size:11px; color:var(--text3);">TMDB API key is stored as a server secret — no key needed here. <a href="https://www.themoviedb.org/settings/api" target="_blank" style="color:var(--purple2);">Get free key →</a></div>
        <div class="tmdb-results" id="tmdbResults"></div>
      </div>

      <!-- Anime Form -->
      <div style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--r12); padding:22px;">
        <div class="form-section-title">Basic Information</div>
        <div class="admin-form-grid">
          <div class="admin-fg full">
            <label class="admin-lbl">Title (English) *</label>
            <input type="text" class="admin-inp" id="fTitle" placeholder="e.g. Renegade Immortal">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Native Title</label>
            <input type="text" class="admin-inp" id="fTitleNative" placeholder="e.g. 仙逆">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Slug (URL) *</label>
            <input type="text" class="admin-inp" id="fSlug" placeholder="e.g. renegade-immortal">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Type *</label>
            <select class="admin-sel" id="fType">
              <option value="ONA">ONA</option>
              <option value="TV">TV</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              <option value="Special">Special</option>
              <option value="Donghua">Donghua</option>
            </select>
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Status *</label>
            <select class="admin-sel" id="fStatus">
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Release Year</label>
            <input type="number" class="admin-inp" id="fYear" placeholder="2024" min="1990" max="2030">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Rating (0-10)</label>
            <input type="number" class="admin-inp" id="fRating" placeholder="8.5" step="0.1" min="0" max="10">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Genres (comma-separated)</label>
            <input type="text" class="admin-inp" id="fGenres" placeholder="Action, Fantasy, Adventure">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Country</label>
            <input type="text" class="admin-inp" id="fCountry" placeholder="China" value="China">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Duration</label>
            <input type="text" class="admin-inp" id="fDuration" placeholder="24 min/ep">
          </div>
          <div class="admin-fg full">
            <label class="admin-lbl">Description / Synopsis *</label>
            <textarea class="admin-ta" id="fDescription" rows="5" placeholder="Enter synopsis..."></textarea>
          </div>
        </div>

        <div class="form-section-title" style="margin-top:20px;">Images & Media</div>
        <div class="admin-form-grid">
          <div class="admin-fg">
            <label class="admin-lbl">Cover Image URL</label>
            <input type="text" class="admin-inp" id="fCoverImage" placeholder="https://..." oninput="previewImg('fCoverImage','prevCover')">
            <div style="margin-top:8px;">
              <img id="prevCover" src="" style="width:80px; border-radius:8px; display:none; aspect-ratio:2/3; object-fit:cover;" alt="Cover">
            </div>
            <div class="img-upload-area" style="margin-top:8px;" onclick="document.getElementById('coverUpload').click()">
              <i class="fas fa-image"></i>
              <p>Or upload image file</p>
              <span>PNG, JPG, WEBP accepted</span>
            </div>
            <input type="file" id="coverUpload" accept="image/*" style="display:none" onchange="handleImgUpload(this,'fCoverImage','prevCover')">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Banner Image URL</label>
            <input type="text" class="admin-inp" id="fBannerImage" placeholder="https://..." oninput="previewImg('fBannerImage','prevBanner')">
            <div style="margin-top:8px;">
              <img id="prevBanner" src="" style="width:100%; max-height:100px; border-radius:8px; display:none; object-fit:cover;" alt="Banner">
            </div>
            <div class="img-upload-area" style="margin-top:8px;" onclick="document.getElementById('bannerUpload').click()">
              <i class="fas fa-panorama"></i>
              <p>Or upload banner file</p>
              <span>Wide image (16:9 recommended)</span>
            </div>
            <input type="file" id="bannerUpload" accept="image/*" style="display:none" onchange="handleImgUpload(this,'fBannerImage','prevBanner',true)">
          </div>
          <div class="admin-fg full">
            <label class="admin-lbl">Trailer URL (YouTube or direct)</label>
            <input type="text" class="admin-inp" id="fTrailer" placeholder="https://youtube.com/watch?v=...">
          </div>
        </div>

        <div class="form-section-title" style="margin-top:20px;">Feature Flags</div>
        <div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:14px;">
          <label class="admin-check"><input type="checkbox" id="fFeatured"> Featured (shown in hero slider)</label>
          <label class="admin-check"><input type="checkbox" id="fTrending"> Trending</label>
          <label class="admin-check"><input type="checkbox" id="fPopular"> Popular</label>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="admin-btn admin-btn-purple" onclick="saveAnime()" id="saveAnimeBtn">
            <i class="fas fa-save"></i> Save Anime
          </button>
          <button class="admin-btn admin-btn-outline" onclick="resetAnimeForm()">
            <i class="fas fa-undo"></i> Reset
          </button>
        </div>
      </div>
    </div>

    <!-- ===== EPISODES ===== -->
    <div class="admin-page${section === 'episodes' ? ' active' : ''}" id="admin-episodes">
      <div class="admin-page-hd">
        <div class="admin-page-title">Episodes</div>
      </div>

      <!-- Select Anime -->
      <div style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--r12); padding:18px; margin-bottom:20px;">
        <div class="admin-fg" style="margin-bottom:14px;">
          <label class="admin-lbl">Select Anime</label>
          <select class="admin-sel" id="epAnimeSelect" onchange="loadAnimeEpisodes(this.value)" style="width:100%;">
            <option value="">-- Choose Anime --</option>
          </select>
        </div>
        <div id="epAnimeInfo" style="display:none; padding:12px; background:var(--bg4); border-radius:var(--r8); margin-bottom:16px; display:flex; gap:12px; align-items:center;">
          <img id="epAnimeThumb" src="" style="width:50px; aspect-ratio:2/3; object-fit:cover; border-radius:6px;">
          <div>
            <div id="epAnimeTitle" style="font-weight:700; font-size:14px;"></div>
            <div id="epAnimeCount" style="font-size:12px; color:var(--text3);"></div>
          </div>
        </div>

        <div class="form-section-title">Add Episode</div>
        <div class="admin-form-grid">
          <div class="admin-fg">
            <label class="admin-lbl">Episode Number *</label>
            <input type="number" class="admin-inp" id="epNum" placeholder="1" min="1" id="epNumInput">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Episode Title</label>
            <input type="text" class="admin-inp" id="epTitle" placeholder="Optional title">
          </div>
          <div class="admin-fg full">
            <label class="admin-lbl">Embed URL (Streamtape / Filemoon / Doodstream etc.)</label>
            <input type="text" class="admin-inp" id="epEmbed" placeholder="https://streamtape.com/e/...">
          </div>
          <div class="admin-fg full">
            <label class="admin-lbl">Direct Video URL (MP4)</label>
            <input type="text" class="admin-inp" id="epVideo" placeholder="https://example.com/video.mp4">
            <div class="img-upload-area" style="margin-top:8px;" onclick="document.getElementById('epVideoUpload').click()">
              <i class="fas fa-upload"></i>
              <p>Or upload video file</p>
              <span>MP4 recommended</span>
            </div>
            <input type="file" id="epVideoUpload" accept="video/*" style="display:none" onchange="handleVideoUpload(this)">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Thumbnail URL or Upload</label>
            <input type="text" class="admin-inp" id="epThumb" placeholder="https://... or upload below" oninput="previewImg('epThumb','epThumbPrev')">
            <div class="img-upload-area" style="margin-top:6px;" onclick="document.getElementById('epThumbUpload').click()">
              <i class="fas fa-image"></i>
              <p>Upload thumbnail to Cloudinary</p>
              <span>PNG, JPG, WEBP accepted</span>
            </div>
            <input type="file" id="epThumbUpload" accept="image/*" style="display:none" onchange="handleEpThumbUpload(this)">
            <img id="epThumbPrev" src="" style="width:120px; margin-top:6px; display:none; border-radius:6px;" alt="Thumbnail">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Air Date</label>
            <input type="date" class="admin-inp" id="epDate">
          </div>
          <div class="admin-fg full">
            <label class="admin-lbl">Members Only</label>
            <label class="admin-check"><input type="checkbox" id="epMembers"> Require membership to watch</label>
          </div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="admin-btn admin-btn-purple" onclick="addEpisode()" id="addEpBtn">
            <i class="fas fa-plus"></i> Add Episode
          </button>
          <button class="admin-btn admin-btn-outline" onclick="resetEpForm()">
            <i class="fas fa-undo"></i> Reset
          </button>
        </div>
      </div>

      <!-- Episode list for selected anime -->
      <div class="admin-table-card" id="epListCard" style="display:none;">
        <div class="admin-tc-head">
          <div class="admin-tc-title" id="epListTitle">Episodes</div>
        </div>
        <div style="overflow-x:auto;">
          <table class="admin-tbl">
            <thead><tr><th>EP#</th><th>Title</th><th>Embed</th><th>Video</th><th>Air Date</th><th>Actions</th></tr></thead>
            <tbody id="epListBody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== USERS ===== -->
    <div class="admin-page${section === 'users' ? ' active' : ''}" id="admin-users">
      <div class="admin-page-hd">
        <div class="admin-page-title">Users</div>
      </div>
      <div class="admin-search-row">
        <input type="text" class="admin-search-input" placeholder="Search users..." oninput="filterUsers(this.value)" id="usersSearch">
      </div>
      <div class="admin-table-card">
        <div style="overflow-x:auto;">
          <table class="admin-tbl">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody id="usersBody"><tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text3);"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== COMMENTS ===== -->
    <div class="admin-page${section === 'comments' ? ' active' : ''}" id="admin-comments">
      <div class="admin-page-hd">
        <div class="admin-page-title">Comments Management</div>
      </div>
      <div class="admin-search-row">
        <select class="admin-select" onchange="loadComments(this.value)" id="commentsFilter">
          <option value="all">All Comments</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button class="admin-btn admin-btn-outline" onclick="loadComments()"><i class="fas fa-sync"></i> Refresh</button>
      </div>
      <div class="admin-table-card">
        <div style="overflow-x:auto;">
          <table class="admin-tbl">
            <thead><tr><th>Comment</th><th>User</th><th>Anime/Episode</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="commentsBody"><tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text3);"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== SCHEDULE ===== -->
    <div class="admin-page${section === 'schedule' ? ' active' : ''}" id="admin-schedule">
      <div class="admin-page-hd">
        <div class="admin-page-title">Weekly Schedule</div>
      </div>
      <div style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--r12); padding:20px; margin-bottom:20px;">
        <div class="form-section-title">Add to Schedule</div>
        <div class="admin-form-grid">
          <div class="admin-fg">
            <label class="admin-lbl">Anime</label>
            <select class="admin-sel" id="schedAnime" style="width:100%;"><option value="">-- Select --</option></select>
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Day of Week</label>
            <select class="admin-sel" id="schedDay">
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Air Time (local)</label>
            <input type="time" class="admin-inp" id="schedTime">
          </div>
          <div class="admin-fg" style="display:flex; align-items:flex-end;">
            <button class="admin-btn admin-btn-purple" onclick="addSchedule()"><i class="fas fa-plus"></i> Add to Schedule</button>
          </div>
        </div>
      </div>
      <div class="admin-table-card">
        <div style="overflow-x:auto;">
          <table class="admin-tbl">
            <thead><tr><th>Anime</th><th>Day</th><th>Time</th><th>Actions</th></tr></thead>
            <tbody id="schedBody"><tr><td colspan="4" style="text-align:center; padding:24px; color:var(--text3);"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== SETTINGS ===== -->
    <div class="admin-page${section === 'settings' ? ' active' : ''}" id="admin-settings">
      <div class="admin-page-hd">
        <div class="admin-page-title">Site Settings</div>
      </div>

      <!-- Cloudinary Status -->
      <div class="settings-card">
        <div class="settings-title"><i class="fas fa-cloud" style="color:var(--blue);margin-right:6px;"></i> Cloudinary Image Hosting</div>
        <div id="cloudinaryStatus" style="font-size:13px;color:var(--text3);margin-bottom:12px;padding:12px;background:var(--bg4);border-radius:8px;">
          <i class="fas fa-spinner fa-spin"></i> Checking...
        </div>
        <div style="font-size:12px;color:var(--text3);">
          To configure Cloudinary: Add these as <strong>Cloudflare Worker secrets</strong>:<br>
          <code style="background:var(--bg5);padding:2px 6px;border-radius:4px;font-size:11px;">CLOUDINARY_CLOUD_NAME</code>
          <code style="background:var(--bg5);padding:2px 6px;border-radius:4px;font-size:11px;">CLOUDINARY_API_KEY</code>
          <code style="background:var(--bg5);padding:2px 6px;border-radius:4px;font-size:11px;">CLOUDINARY_API_SECRET</code><br>
          <a href="https://cloudinary.com/users/register_free" target="_blank" style="color:var(--purple2);">Get free Cloudinary account →</a>
        </div>
      </div>

      <!-- TMDB API -->
      <div class="settings-card">
        <div class="settings-title"><i class="fas fa-film" style="color:var(--gold);margin-right:6px;"></i> TMDB API Configuration</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px;">
          TMDB API key is stored server-side as a Cloudflare secret. Add <code style="background:var(--bg4);padding:2px 6px;border-radius:4px;">TMDB_API_KEY</code> as a worker secret.
        </div>
        <div style="font-size:12px;color:var(--text3);">
          <a href="https://www.themoviedb.org/settings/api" target="_blank" style="color:var(--purple2);">Get free TMDB API key →</a>
        </div>
      </div>

      <!-- Site Settings -->
      <div class="settings-card">
        <div class="settings-title">Site Settings</div>
        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-name">Maintenance Mode</div>
            <div class="setting-desc">Show maintenance page to visitors</div>
          </div>
          <div class="toggle" id="toggleMaintenance" onclick="toggleMaintenance()" title="Toggle maintenance mode"></div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-name">New User Registration</div>
            <div class="setting-desc">Allow new users to register</div>
          </div>
          <div class="toggle on" id="toggleReg" onclick="toggleReg()" title="Toggle registration"></div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-name">Demo Video Mode</div>
            <div class="setting-desc">Use demo video when no embed is set</div>
          </div>
          <div class="toggle on" id="toggleDemo" onclick="toggleDemo()"></div>
        </div>
        <div style="margin-top:16px;">
          <button class="admin-btn admin-btn-purple" onclick="saveDbSettings()"><i class="fas fa-save"></i> Save Settings</button>
        </div>
      </div>

      <!-- Admin Account -->
      <div class="settings-card">
        <div class="settings-title">Admin Account Password</div>
        <div style="font-size:13px; color:var(--text2); margin-bottom:14px;">Change admin password (username: <strong>admin</strong>)</div>
        <div class="admin-form-grid" style="max-width:400px;">
          <div class="admin-fg full">
            <label class="admin-lbl">Current Password</label>
            <input type="password" class="admin-inp" id="curAdminPass" placeholder="Current password">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">New Password</label>
            <input type="password" class="admin-inp" id="newAdminPass" placeholder="New password (min 8 chars)">
          </div>
          <div class="admin-fg">
            <label class="admin-lbl">Confirm Password</label>
            <input type="password" class="admin-inp" id="confirmAdminPass" placeholder="Confirm">
          </div>
        </div>
        <button class="admin-btn admin-btn-purple" onclick="changeAdminPass()"><i class="fas fa-lock"></i> Change Password</button>
      </div>
    </div>

  </div><!-- end admin-main -->
</div><!-- end admin-layout -->

<script src="/static/admin.js"></script>
`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel - DonghuaLand</title>
<link rel="icon" type="image/svg+xml" href="/static/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css">
<link rel="stylesheet" href="/static/style.css">
</head>
<body>
<header class="site-header" style="position:sticky;">
  <div class="header-inner">
    <a href="/" class="logo">
      <div class="logo-icon"><i class="fas fa-dragon"></i></div>
      <div class="logo-text">Donghua<span class="accent">Land</span></div>
    </a>
    <div style="flex:1;"></div>
    <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text3);">Admin Panel</span>
    <a href="/" style="margin-left:16px; font-size:13px; color:var(--text3);"><i class="fas fa-external-link-alt"></i> View Site</a>
  </div>
</header>
<div style="margin-top:0;">
${content}
</div>
<div class="toast-container" id="toastContainer"></div>
<script src="/static/app.js"></script>
</body>
</html>`
}
