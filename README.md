<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Emotion Based Music Recommendation System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --green:#1DB954;
  --green-dim:#0f7a37;
  --green-glow:rgba(29,185,84,0.18);
  --bg:#07111a;
  --bg2:#0d1d2a;
  --bg3:#0a1620;
  --surface:rgba(255,255,255,0.04);
  --surface2:rgba(255,255,255,0.07);
  --border:rgba(255,255,255,0.07);
  --border2:rgba(29,185,84,0.25);
  --text:#e8f4f8;
  --text2:#7fa3b4;
  --text3:#4a6a7a;
  --accent:#ff6b35;
  --accent2:#ffd700;
  --font-display:'Syne',sans-serif;
  --font-body:'DM Sans',sans-serif;
  --font-mono:'DM Mono',monospace;
  --r:12px;
  --r2:20px;
}

html{scroll-behavior:smooth}
body{
  background:var(--bg);
  color:var(--text);
  font-family:var(--font-body);
  font-size:16px;
  line-height:1.7;
  min-height:100vh;
  overflow-x:hidden;
}

/* ── ANIMATED BACKGROUND ── */
body::before{
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 10% 0%, rgba(29,185,84,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 90% 100%, rgba(29,185,84,0.05) 0%, transparent 50%),
    radial-gradient(ellipse 40% 40% at 50% 50%, rgba(13,29,42,0.8) 0%, transparent 80%);
  pointer-events:none;
  z-index:0;
}

/* ── LAYOUT ── */
.wrap{
  max-width:900px;
  margin:0 auto;
  padding:0 28px 80px;
  position:relative;
  z-index:1;
}

/* ── HERO ── */
.hero{
  padding:72px 0 56px;
  text-align:center;
  position:relative;
}
.hero-badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  background:var(--green-glow);
  border:1px solid var(--border2);
  border-radius:50px;
  padding:6px 18px;
  font-size:12px;
  font-weight:500;
  color:var(--green);
  letter-spacing:1.5px;
  text-transform:uppercase;
  margin-bottom:28px;
}
.hero-badge .dot{
  width:6px;height:6px;border-radius:50%;
  background:var(--green);
  animation:pulse 2s ease-in-out infinite;
}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.85)}}

.hero h1{
  font-family:var(--font-display);
  font-size:clamp(2.4rem,5vw,4rem);
  font-weight:800;
  line-height:1.08;
  letter-spacing:-0.03em;
  color:#fff;
  margin-bottom:20px;
}
.hero h1 span{
  background:linear-gradient(135deg,var(--green),#8affb7);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.hero-sub{
  font-size:1.1rem;
  color:var(--text2);
  max-width:580px;
  margin:0 auto 36px;
  font-weight:300;
}
.hero-tags{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  justify-content:center;
}
.tag{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:50px;
  padding:6px 16px;
  font-size:13px;
  color:var(--text2);
  font-family:var(--font-mono);
}

/* ── SECTION HEADERS ── */
.section{margin:64px 0 0}
.section-label{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:24px;
}
.section-label .num{
  font-family:var(--font-mono);
  font-size:11px;
  color:var(--green);
  letter-spacing:1px;
}
.section-label h2{
  font-family:var(--font-display);
  font-size:1.6rem;
  font-weight:700;
  color:#fff;
  letter-spacing:-0.02em;
}
.section-label .line{
  flex:1;
  height:1px;
  background:var(--border);
}

/* ── FLOW STEPS ── */
.flow{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
  gap:2px;
  background:var(--border);
  border-radius:var(--r2);
  overflow:hidden;
  border:1px solid var(--border);
}
.flow-step{
  background:var(--bg2);
  padding:24px 20px;
  position:relative;
  cursor:default;
  transition:background 0.2s;
}
.flow-step:hover{background:var(--surface2)}
.flow-step:last-child::after{display:none}
.flow-num{
  font-family:var(--font-mono);
  font-size:10px;
  color:var(--green);
  letter-spacing:1px;
  margin-bottom:10px;
}
.flow-icon{font-size:24px;margin-bottom:10px;display:block}
.flow-title{
  font-family:var(--font-display);
  font-size:0.88rem;
  font-weight:700;
  color:#fff;
  margin-bottom:6px;
}
.flow-desc{font-size:0.78rem;color:var(--text2);line-height:1.5}

/* ── FILE TREE ── */
.tree-wrap{
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:var(--r2);
  overflow:hidden;
}
.tree-header{
  background:var(--bg3);
  padding:14px 20px;
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  gap:10px;
}
.tree-dots{display:flex;gap:6px}
.tree-dots span{
  width:12px;height:12px;border-radius:50%;
}
.tree-dots span:nth-child(1){background:#ff5f57}
.tree-dots span:nth-child(2){background:#ffbd2e}
.tree-dots span:nth-child(3){background:#28ca41}
.tree-title{font-family:var(--font-mono);font-size:12px;color:var(--text3)}
.tree-body{padding:20px 24px;font-family:var(--font-mono);font-size:13px;line-height:2}
.tree-line{display:flex;align-items:center;gap:0}
.tree-line .prefix{color:var(--text3);white-space:pre}
.tree-line .file{color:var(--text)}
.tree-line .file.highlight{color:var(--green)}
.tree-line .comment{color:var(--text3);font-size:11px;margin-left:12px}
.tree-line .badge{
  background:var(--green-glow);
  color:var(--green);
  font-size:9px;
  padding:1px 6px;
  border-radius:4px;
  margin-left:8px;
  letter-spacing:0.5px;
}

/* ── CODE BLOCK ── */
pre{
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:var(--r);
  padding:20px 24px;
  font-family:var(--font-mono);
  font-size:13px;
  color:var(--text);
  overflow-x:auto;
  line-height:1.8;
  position:relative;
}
.code-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  background:var(--bg3);
  border:1px solid var(--border);
  border-bottom:none;
  border-radius:var(--r) var(--r) 0 0;
  padding:10px 20px;
  font-family:var(--font-mono);
  font-size:11px;
  color:var(--text3);
}
.code-header + pre{border-radius:0 0 var(--r) var(--r)}
.k{color:#c678dd}
.s{color:#98c379}
.c{color:var(--text3)}
.fn{color:#61afef}
.v{color:#e5c07b}
.n{color:var(--text2)}

/* ── SETUP STEPS ── */
.setup-steps{display:flex;flex-direction:column;gap:3px}
.setup-step{
  display:grid;
  grid-template-columns:48px 1fr;
  gap:16px;
  align-items:start;
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:var(--r);
  padding:20px 24px;
  transition:border-color 0.2s,background 0.2s;
  cursor:default;
}
.setup-step:hover{
  border-color:var(--border2);
  background:var(--surface);
}
.step-num{
  width:36px;height:36px;
  border-radius:50%;
  background:var(--green-glow);
  border:1px solid var(--border2);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-display);
  font-size:15px;
  font-weight:800;
  color:var(--green);
  flex-shrink:0;
  margin-top:2px;
}
.step-content h3{
  font-family:var(--font-display);
  font-size:1rem;
  font-weight:700;
  color:#fff;
  margin-bottom:6px;
}
.step-content p{font-size:0.88rem;color:var(--text2);margin-bottom:10px}
.step-content pre{margin:0;font-size:12px;padding:12px 16px}

/* ── API TABLE ── */
.api-table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
  border:1px solid var(--border);
  border-radius:var(--r2);
  overflow:hidden;
  font-size:14px;
}
.api-table th{
  background:var(--bg3);
  padding:14px 20px;
  text-align:left;
  font-family:var(--font-display);
  font-size:11px;
  font-weight:700;
  color:var(--text3);
  letter-spacing:1.5px;
  text-transform:uppercase;
  border-bottom:1px solid var(--border);
}
.api-table td{
  padding:16px 20px;
  border-bottom:1px solid var(--border);
  color:var(--text2);
  vertical-align:middle;
}
.api-table tr:last-child td{border-bottom:none}
.api-table tr:hover td{background:var(--surface)}
.method{
  font-family:var(--font-mono);
  font-size:12px;
  font-weight:500;
  padding:4px 10px;
  border-radius:6px;
  display:inline-block;
}
.method.get{background:rgba(29,185,84,0.12);color:var(--green)}
.method.post{background:rgba(255,107,53,0.12);color:#ff6b35}
.endpoint{
  font-family:var(--font-mono);
  font-size:13px;
  color:#fff;
}

/* ── EMOTIONS GRID ── */
.emotions-grid{
  display:grid;
  grid-template-columns:repeat(7,1fr);
  gap:8px;
}
.emotion-card{
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:var(--r2);
  padding:20px 12px;
  text-align:center;
  transition:all 0.25s;
  cursor:default;
  position:relative;
  overflow:hidden;
}
.emotion-card::before{
  content:'';
  position:absolute;
  inset:0;
  background:var(--green-glow);
  opacity:0;
  transition:opacity 0.25s;
}
.emotion-card:hover::before{opacity:1}
.emotion-card:hover{
  border-color:var(--border2);
  transform:translateY(-5px);
  box-shadow:0 16px 40px rgba(29,185,84,0.12);
}
.em-emoji{font-size:2rem;display:block;margin-bottom:8px;position:relative}
.em-label{
  font-size:0.72rem;
  font-weight:600;
  color:var(--text2);
  font-family:var(--font-display);
  letter-spacing:0.5px;
  position:relative;
}
.emotion-card:hover .em-label{color:var(--green)}

/* ── NOTES CARDS ── */
.notes-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:14px;
}
.note-card{
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:var(--r2);
  padding:22px;
  position:relative;
  overflow:hidden;
}
.note-card::after{
  content:'';
  position:absolute;
  top:0;left:0;
  width:3px;height:100%;
  background:var(--green);
  opacity:0.6;
}
.note-icon{font-size:1.4rem;margin-bottom:12px;display:block}
.note-title{
  font-family:var(--font-display);
  font-size:0.95rem;
  font-weight:700;
  color:#fff;
  margin-bottom:8px;
}
.note-text{font-size:0.84rem;color:var(--text2);line-height:1.6}

/* ── OPTIONAL UTIL BOX ── */
.util-box{
  background:var(--bg2);
  border:1px solid var(--border);
  border-left:3px solid var(--accent2);
  border-radius:0 var(--r) var(--r) 0;
  padding:20px 24px;
  display:flex;
  gap:16px;
  align-items:flex-start;
}
.util-icon{font-size:1.5rem;flex-shrink:0;margin-top:2px}
.util-content h4{
  font-family:var(--font-display);
  font-weight:700;
  color:#fff;
  margin-bottom:6px;
}
.util-content p{font-size:0.88rem;color:var(--text2);margin-bottom:10px}

/* ── FOOTER ── */
.footer{
  margin-top:80px;
  padding-top:32px;
  border-top:1px solid var(--border);
  text-align:center;
}
.footer-logo{
  font-family:var(--font-display);
  font-size:1.5rem;
  font-weight:800;
  color:var(--green);
  margin-bottom:8px;
}
.footer-sub{font-size:0.84rem;color:var(--text3)}

/* ── DIVIDER ── */
.divider{height:1px;background:var(--border);margin:48px 0}

/* ── INLINE CODE ── */
code{
  font-family:var(--font-mono);
  font-size:0.88em;
  background:rgba(29,185,84,0.08);
  color:var(--green);
  padding:2px 7px;
  border-radius:5px;
}

/* ── RESPONSIVE ── */
@media(max-width:700px){
  .emotions-grid{grid-template-columns:repeat(4,1fr)}
  .flow{grid-template-columns:1fr 1fr}
  .hero h1{font-size:2.2rem}
}
@media(max-width:440px){
  .emotions-grid{grid-template-columns:repeat(3,1fr)}
}
</style>
</head>
<body>
<div class="wrap">

  <!-- HERO -->
  <div class="hero">
    <div class="hero-badge"><span class="dot"></span>AI Powered · Bollywood · DeepFace</div>
    <h1>Emotion Based<br><span>Music Recommender</span></h1>
    <p class="hero-sub">Detects your facial emotion in real-time and instantly generates a Bollywood playlist matched to how you feel.</p>
    <div class="hero-tags">
      <span class="tag">Python 3.x</span>
      <span class="tag">Flask</span>
      <span class="tag">DeepFace</span>
      <span class="tag">OpenCV</span>
      <span class="tag">HTML / CSS / JS</span>
      <span class="tag">YouTube</span>
    </div>
  </div>

  <!-- HOW IT WORKS -->
  <div class="section">
    <div class="section-label">
      <span class="num">01</span>
      <h2>How It Works</h2>
      <div class="line"></div>
    </div>
    <div class="flow">
      <div class="flow-step">
        <div class="flow-num">STEP 01</div>
        <span class="flow-icon">📸</span>
        <div class="flow-title">Capture Face</div>
        <div class="flow-desc">Webcam snapshot, photo upload, or pick your mood manually</div>
      </div>
      <div class="flow-step">
        <div class="flow-num">STEP 02</div>
        <span class="flow-icon">🧠</span>
        <div class="flow-title">DeepFace Analyzes</div>
        <div class="flow-desc">AI detects dominant emotion with confidence score</div>
      </div>
      <div class="flow-step">
        <div class="flow-num">STEP 03</div>
        <span class="flow-icon">🎵</span>
        <div class="flow-title">Match Songs</div>
        <div class="flow-desc">Shuffled playlist of 12 Bollywood songs for that emotion</div>
      </div>
      <div class="flow-step">
        <div class="flow-num">STEP 04</div>
        <span class="flow-icon">▶</span>
        <div class="flow-title">Play on YouTube</div>
        <div class="flow-desc">One click opens any song directly on YouTube</div>
      </div>
      <div class="flow-step">
        <div class="flow-num">STEP 05</div>
        <span class="flow-icon">🔄</span>
        <div class="flow-title">Refresh Anytime</div>
        <div class="flow-desc">Server reshuffles on every call — always a fresh order</div>
      </div>
    </div>
  </div>

  <!-- PROJECT STRUCTURE -->
  <div class="section">
    <div class="section-label">
      <span class="num">02</span>
      <h2>Project Structure</h2>
      <div class="line"></div>
    </div>
    <div class="tree-wrap">
      <div class="tree-header">
        <div class="tree-dots"><span></span><span></span><span></span></div>
        <div class="tree-title">emotion-music/</div>
      </div>
      <div class="tree-body">
        <div class="tree-line"><span class="prefix">├── </span><span class="file highlight">app.py</span><span class="badge">CORE</span><span class="comment">← Flask backend, emotion detection API</span></div>
        <div class="tree-line"><span class="prefix">├── </span><span class="file">requirements.txt</span><span class="comment">← Python dependencies</span></div>
        <div class="tree-line"><span class="prefix">├── </span><span class="file">run.bat</span><span class="comment">← Windows one-click launcher</span></div>
        <div class="tree-line"><span class="prefix">├── </span><span class="file">.env</span><span class="comment">← FLASK_PORT, FLASK_DEBUG</span></div>
        <div class="tree-line"><span class="prefix">├── </span><span class="file">.gitignore</span></div>
        <div class="tree-line"><span class="prefix">│</span></div>
        <div class="tree-line"><span class="prefix">├── </span><span class="file">src/</span></div>
        <div class="tree-line"><span class="prefix">│   └── </span><span class="file highlight">music_recommender.py</span><span class="badge">CORE</span><span class="comment">← 7 emotions × 12 songs + get_songs()</span></div>
        <div class="tree-line"><span class="prefix">│</span></div>
        <div class="tree-line"><span class="prefix">├── </span><span class="file">templates/</span></div>
        <div class="tree-line"><span class="prefix">│   └── </span><span class="file highlight">index.html</span><span class="badge">CORE</span><span class="comment">← Single-page app UI</span></div>
        <div class="tree-line"><span class="prefix">│</span></div>
        <div class="tree-line"><span class="prefix">├── </span><span class="file">static/</span></div>
        <div class="tree-line"><span class="prefix">│   ├── </span><span class="file">css/style.css</span><span class="comment">← All styles</span></div>
        <div class="tree-line"><span class="prefix">│   └── </span><span class="file">js/app.js</span><span class="comment">← All frontend logic</span></div>
        <div class="tree-line"><span class="prefix">│</span></div>
        <div class="tree-line"><span class="prefix">├── </span><span class="file">scripts/</span></div>
        <div class="tree-line"><span class="prefix">│   └── </span><span class="file">refresh_youtube_ids.py</span><span class="comment">← Optional: fix dead YouTube links</span></div>
        <div class="tree-line"><span class="prefix">│</span></div>
        <div class="tree-line"><span class="prefix">└── </span><span class="file">data/</span><span class="comment">← Gitignored local data folder</span></div>
      </div>
    </div>
  </div>

  <!-- SETUP -->
  <div class="section">
    <div class="section-label">
      <span class="num">03</span>
      <h2>Setup &amp; Installation</h2>
      <div class="line"></div>
    </div>
    <div class="setup-steps">

      <div class="setup-step">
        <div class="step-num">1</div>
        <div class="step-content">
          <h3>Clone or Extract the Project</h3>
          <p>Extract the zip and navigate into the project folder.</p>
          <div class="code-header"><span>bash</span></div>
          <pre><span class="fn">cd</span> emotion-music</pre>
        </div>
      </div>

      <div class="setup-step">
        <div class="step-num">2</div>
        <div class="step-content">
          <h3>Create a Virtual Environment</h3>
          <p>Keeps all dependencies isolated from your system Python.</p>
          <div class="code-header"><span>bash</span></div>
          <pre><span class="fn">python</span> <span class="v">-m</span> venv .venv</pre>
        </div>
      </div>

      <div class="setup-step">
        <div class="step-num">3</div>
        <div class="step-content">
          <h3>Activate the Virtual Environment</h3>
          <div class="code-header"><span>bash — Windows</span></div>
          <pre>.venv<span class="n">\</span>Scripts<span class="n">\</span>activate</pre>
          <div class="code-header" style="margin-top:8px"><span>bash — macOS / Linux</span></div>
          <pre><span class="fn">source</span> .venv/bin/activate</pre>
        </div>
      </div>

      <div class="setup-step">
        <div class="step-num">4</div>
        <div class="step-content">
          <h3>Install Dependencies</h3>
          <p>Installs Flask, DeepFace, OpenCV, TF-Keras, Pillow, and more.</p>
          <div class="code-header"><span>bash</span></div>
          <pre><span class="fn">pip</span> install <span class="v">-r</span> requirements.txt</pre>
        </div>
      </div>

      <div class="setup-step">
        <div class="step-num">5</div>
        <div class="step-content">
          <h3>Run the App</h3>
          <p>On Windows, double-click <code>run.bat</code> — or run directly:</p>
          <div class="code-header"><span>bash</span></div>
          <pre><span class="fn">python</span> app.py</pre>
          <p style="margin-top:10px;font-size:0.84rem;color:var(--green)">✓ Open <strong>http://127.0.0.1:8000</strong> in your browser</p>
        </div>
      </div>

    </div>
  </div>

  <!-- API ENDPOINTS -->
  <div class="section">
    <div class="section-label">
      <span class="num">04</span>
      <h2>API Endpoints</h2>
      <div class="line"></div>
    </div>
    <table class="api-table">
      <thead>
        <tr>
          <th>Method</th>
          <th>Endpoint</th>
          <th>Description</th>
          <th>Body / Params</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="method get">GET</span></td>
          <td><span class="endpoint">/</span></td>
          <td>Serve the web app</td>
          <td style="color:var(--text3)">—</td>
        </tr>
        <tr>
          <td><span class="method post">POST</span></td>
          <td><span class="endpoint">/api/detect-emotion</span></td>
          <td>Detect emotion from a base64 image</td>
          <td><code style="font-size:12px">{ "image": "data:image/..." }</code></td>
        </tr>
        <tr>
          <td><span class="method post">POST</span></td>
          <td><span class="endpoint">/api/get-songs</span></td>
          <td>Get a shuffled playlist for an emotion</td>
          <td><code style="font-size:12px">{ "emotion": "happy", "limit": 12 }</code></td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top:16px">
      <div class="code-header"><span>Example response — /api/detect-emotion</span></div>
      <pre>{
  <span class="k">"success"</span>: <span class="v">true</span>,
  <span class="k">"emotion"</span>: <span class="s">"happy"</span>,
  <span class="k">"confidence"</span>: <span class="v">94.7</span>
}</pre>
    </div>

    <div style="margin-top:8px">
      <div class="code-header"><span>Example response — /api/get-songs</span></div>
      <pre>{
  <span class="k">"success"</span>: <span class="v">true</span>,
  <span class="k">"emotion"</span>: <span class="s">"happy"</span>,
  <span class="k">"songs"</span>: [
    { <span class="k">"name"</span>: <span class="s">"Badtameez Dil"</span>, <span class="k">"artist"</span>: <span class="s">"Shalmali Kholgade"</span>,
      <span class="k">"album"</span>: <span class="s">"Yeh Jawaani Hai Deewani"</span>, <span class="k">"youtube_id"</span>: <span class="s">"II2EO3Nw4m0"</span> },
    <span class="c">... (up to 12 songs, reshuffled every call)</span>
  ]
}</pre>
    </div>
  </div>

  <!-- EMOTIONS -->
  <div class="section">
    <div class="section-label">
      <span class="num">05</span>
      <h2>Supported Emotions</h2>
      <div class="line"></div>
    </div>
    <p style="color:var(--text2);margin-bottom:20px;font-size:0.92rem">7 emotions detected by DeepFace. Each has a curated library of 12 Bollywood songs that shuffle fresh on every request.</p>
    <div class="emotions-grid">
      <div class="emotion-card"><span class="em-emoji">😊</span><div class="em-label">Happy</div></div>
      <div class="emotion-card"><span class="em-emoji">😢</span><div class="em-label">Sad</div></div>
      <div class="emotion-card"><span class="em-emoji">😠</span><div class="em-label">Angry</div></div>
      <div class="emotion-card"><span class="em-emoji">😨</span><div class="em-label">Fear</div></div>
      <div class="emotion-card"><span class="em-emoji">😐</span><div class="em-label">Neutral</div></div>
      <div class="emotion-card"><span class="em-emoji">😲</span><div class="em-label">Surprise</div></div>
      <div class="emotion-card"><span class="em-emoji">🤢</span><div class="em-label">Disgust</div></div>
    </div>
  </div>

  <!-- NOTES -->
  <div class="section">
    <div class="section-label">
      <span class="num">06</span>
      <h2>Important Notes</h2>
      <div class="line"></div>
    </div>
    <div class="notes-grid">
      <div class="note-card">
        <span class="note-icon">▶</span>
        <div class="note-title">YouTube Playback</div>
        <div class="note-text">Songs open directly on YouTube in a new tab — no in-app audio streaming. This avoids all CORS and DRM issues completely.</div>
      </div>
      <div class="note-card">
        <span class="note-icon">🔀</span>
        <div class="note-title">Fresh Shuffle Every Time</div>
        <div class="note-text">The server calls <code>random.shuffle()</code> on every <code>/api/get-songs</code> request — so Refresh always gives a new order.</div>
      </div>
      <div class="note-card">
        <span class="note-icon">🧠</span>
        <div class="note-title">First-Run Model Download</div>
        <div class="note-text">DeepFace downloads its facial analysis model weights on the very first run (~100 MB). This is a one-time download only.</div>
      </div>
      <div class="note-card">
        <span class="note-icon">💡</span>
        <div class="note-title">Camera Tips</div>
        <div class="note-text">Face the camera directly with good lighting. Avoid backlighting. The green circle guide shows the ideal face position.</div>
      </div>
      <div class="note-card">
        <span class="note-icon">📸</span>
        <div class="note-title">Upload Tips</div>
        <div class="note-text">Use a clear, front-facing photo. JPG and PNG are supported. Max size 10 MB. Single faces work best.</div>
      </div>
      <div class="note-card">
        <span class="note-icon">⚙</span>
        <div class="note-title">Config via .env</div>
        <div class="note-text">Change the port or enable debug mode in the <code>.env</code> file: <code>FLASK_PORT=8000</code> and <code>FLASK_DEBUG=false</code>.</div>
      </div>
    </div>
  </div>

  <!-- OPTIONAL UTILITY -->
  <div class="section">
    <div class="section-label">
      <span class="num">07</span>
      <h2>Optional Utility</h2>
      <div class="line"></div>
    </div>
    <div class="util-box">
      <div class="util-icon">🛠</div>
      <div class="util-content">
        <h4>Refresh YouTube IDs — <code>scripts/refresh_youtube_ids.py</code></h4>
        <p>If YouTube links go dead over time, this utility validates all IDs and automatically finds replacements using yt-dlp search.</p>
        <div class="code-header"><span>bash — run from project root</span></div>
        <pre><span class="fn">pip</span> install yt-dlp
<span class="fn">python</span> scripts/refresh_youtube_ids.py</pre>
      </div>
    </div>
  </div>

  <!-- DEPENDENCIES -->
  <div class="section">
    <div class="section-label">
      <span class="num">08</span>
      <h2>Dependencies</h2>
      <div class="line"></div>
    </div>
    <table class="api-table">
      <thead>
        <tr><th>Package</th><th>Purpose</th></tr>
      </thead>
      <tbody>
        <tr><td><code>flask</code></td><td style="color:var(--text2)">Web server and API routing</td></tr>
        <tr><td><code>deepface</code></td><td style="color:var(--text2)">Facial emotion analysis (wraps TensorFlow)</td></tr>
        <tr><td><code>opencv-python</code></td><td style="color:var(--text2)">Face detection backend used by DeepFace</td></tr>
        <tr><td><code>tf-keras</code></td><td style="color:var(--text2)">Keras compatibility layer for TensorFlow models</td></tr>
        <tr><td><code>numpy</code></td><td style="color:var(--text2)">Image array processing</td></tr>
        <tr><td><code>pillow</code></td><td style="color:var(--text2)">Decoding uploaded images from base64</td></tr>
        <tr><td><code>python-dotenv</code></td><td style="color:var(--text2)">Loads config from <code>.env</code> file</td></tr>
        <tr><td><code>requests</code></td><td style="color:var(--text2)">HTTP utility (available for extensions)</td></tr>
      </tbody>
    </table>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-logo">🎵 EmotionMusic</div>
    <div class="footer-sub">Emotion Based Music Recommendation System &nbsp;·&nbsp; AI Powered Bollywood Playlists</div>
  </div>

</div>
</body>
</html>
