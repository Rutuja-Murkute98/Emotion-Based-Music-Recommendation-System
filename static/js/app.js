/* ═══════════════════════════════════════════════════════════════════════
   Emotion Music App — Main JavaScript
   Clean, simple, no broken YouTube iframe hacks.
   Songs open directly on YouTube in a new tab.
   ═══════════════════════════════════════════════════════════════════════ */

// ── STATE ────────────────────────────────────────────────────────────────────
const state = {
  currentPage: 'home',
  emotion: null,
  confidence: null,
  songs: [],
  currentSongIndex: -1,
  cameraStream: null,
};

const EMOJI_MAP = {
  happy: '😊', sad: '😢', angry: '😠', fear: '😨',
  neutral: '😐', surprise: '😲', disgust: '🤢',
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── NAVIGATION ───────────────────────────────────────────────────────────────
function navigateTo(page) {
  state.currentPage = page;
  $$('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.page === page));
  $$('.page').forEach((p) => p.classList.toggle('active', p.id === 'page-' + page));
  const titles = {
    home: 'Discover Your Vibe',
    capture: 'Capture Emotion',
    upload: 'Upload Photo',
    mood: 'Select Mood',
  };
  $('#pageTitle').textContent = titles[page] || 'Discover Your Vibe';
  $('#sidebar').classList.remove('open');
  // Do not auto-start camera when navigating — user controls start/capture explicitly
  if (page !== 'capture') stopCamera();
}

$$('.nav-item').forEach((item) => {
  item.addEventListener('click', (e) => { e.preventDefault(); navigateTo(item.dataset.page); });
});
$('#heroStartCamera').addEventListener('click', () => navigateTo('capture'));
$('#heroChooseMood').addEventListener('click', () => navigateTo('mood'));
$('#hamburgerBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

// ── CAMERA ───────────────────────────────────────────────────────────────────
$('#captureBtn').addEventListener('click', captureAndDetect);
const startBtnEl = document.getElementById('startCameraBtn');
if (startBtnEl) startBtnEl.addEventListener('click', startCamera);

// Ensure Capture button is visible/clickable so user can trigger permission prompt
if ($('#captureBtn')) $('#captureBtn').disabled = false;

async function startCamera() {
  if (state.cameraStream) {
    $('#captureBtn').disabled = false;
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    state.cameraStream = stream;
    $('#cameraFeed').srcObject = stream;
    $('#captureBtn').disabled = false;
  } catch {
    $('#captureBtn').disabled = true;
    alert('Cannot access camera. Please allow camera permissions in your browser.');
  }
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach((t) => t.stop());
    state.cameraStream = null;
  }
  const feed = $('#cameraFeed');
  if (feed) feed.srcObject = null;
  $('#captureBtn').disabled = true;
}

async function captureAndDetect() {
  const video = $('#cameraFeed');
  if (!state.cameraStream) {
    await startCamera();
    // wait briefly for camera to initialize
    const waitUntil = Date.now() + 3000;
    while ((video.videoWidth === 0 || video.videoHeight === 0) && Date.now() < waitUntil) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!state.cameraStream || (video.videoWidth === 0 && video.videoHeight === 0)) {
      alert('Camera not ready. Please allow camera access and try again.');
      return;
    }
    // continue to capture after camera becomes ready
  }

  const canvas = $('#cameraCanvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const imageData = canvas.toDataURL('image/jpeg', 0.85);

  $('#detectionStatus').style.display = 'flex';
  $('#captureBtn').disabled = true;

  try {
    const res = await fetch('/api/detect-and-recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData }),
    });
    const data = await res.json();
    stopCamera();

    if (data.success) {
      await handleEmotionDetected(data.emotion, data.confidence, data.songs || []);
    } else {
      alert(data.error || 'No face detected. Please show a clear face in the camera.');
    }
  } catch {
    alert('Error contacting server. Is the Flask app running?');
  } finally {
    $('#detectionStatus').style.display = 'none';
    $('#captureBtn').disabled = false;
  }
}

// ── UPLOAD ───────────────────────────────────────────────────────────────────
const uploadZone = $('#uploadZone');
const fileInput = $('#fileInput');

uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });

function handleFile(file) {
  if (!file.type.startsWith('image/')) { alert('Please upload an image file.'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    $('#previewImage').src = e.target.result;
    $('#uploadPreview').style.display = 'block';
    uploadZone.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

$('#analyzeUploadBtn').addEventListener('click', async () => {
  const imgSrc = $('#previewImage').src;
  if (!imgSrc) return;

  const btn = $('#analyzeUploadBtn');
  btn.textContent = 'Analyzing...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/detect-and-recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imgSrc }),
    });
    const data = await res.json();
    if (data.success) {
      await handleEmotionDetected(data.emotion, data.confidence, data.songs || []);
    } else {
      alert(data.error || 'No face found in this image. Please upload a clear front-face photo.');
    }
  } catch {
    alert('Error contacting server. Is the Flask app running?');
  } finally {
    btn.textContent = '🔍 Analyze Emotion';
    btn.disabled = false;
  }
});

$('#uploadResetBtn').addEventListener('click', () => {
  $('#uploadPreview').style.display = 'none';
  uploadZone.style.display = 'block';
  fileInput.value = '';
});

// ── MOOD SELECTOR ─────────────────────────────────────────────────────────────
$$('.mood-option').forEach((btn) => {
  btn.addEventListener('click', async () => {
    $$('.mood-option').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    await handleEmotionDetected(btn.dataset.emotion, 100.0);
  });
});

// ── HANDLE EMOTION → FETCH SONGS ─────────────────────────────────────────────
async function handleEmotionDetected(emotion, confidence, songs = null) {
  state.emotion = emotion;
  state.confidence = confidence;
  state.currentSongIndex = -1;

  navigateTo('home');

  // Show mood card
  $('#moodEmoji').textContent = EMOJI_MAP[emotion] || '🎵';
  $('#moodName').textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);
  $('#moodConfidence').textContent = `Confidence: ${confidence.toFixed(1)}%`;
  $('#moodResultSection').style.display = 'flex';

  // Use songs from combined API when available, fallback to separate fetch.
  if (Array.isArray(songs) && songs.length > 0) {
    state.songs = songs;
    renderPlaylist();
    $('#playlistSection').style.display = 'block';
  } else {
    await fetchAndRenderSongs(emotion);
  }
}

async function fetchAndRenderSongs(emotion) {
  try {
    const res = await fetch('/api/get-songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emotion, limit: 12 }),
    });
    const data = await res.json();
    if (data.success && data.songs.length > 0) {
      state.songs = data.songs;
      renderPlaylist();
      $('#playlistSection').style.display = 'block';
    }
  } catch (err) {
    console.error('Error fetching songs:', err);
  }
}

// ── RENDER PLAYLIST ───────────────────────────────────────────────────────────
function renderPlaylist() {
  const list = $('#songList');
  list.innerHTML = '';
  state.songs.forEach((song, idx) => {
    const item = document.createElement('div');
    item.className = 'song-item' + (idx === state.currentSongIndex ? ' active' : '');
    item.id = 'song-' + idx;

    item.innerHTML =
      `<div class="song-index">${idx + 1}</div>` +
      `<div class="song-album-art">🎶</div>` +
      `<div class="song-details">` +
        `<div class="song-name">${escHtml(song.name)}</div>` +
        `<div class="song-artist">${escHtml(song.artist)}</div>` +
        `<div class="song-album">${escHtml(song.album || '')}</div>` +
      `</div>` +
      `<a class="song-play-btn" href="https://www.youtube.com/watch?v=${escHtml(song.youtube_id)}" ` +
         `target="_blank" rel="noopener noreferrer" title="Play on YouTube" ` +
         `onclick="setNowPlaying(${idx})">` +
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><polygon points="5 3 19 12 5 21"/></svg>` +
      `</a>`;

    item.addEventListener('click', (e) => {
      // Don't double-fire if the play button anchor was clicked
      if (e.target.closest('.song-play-btn')) return;
      openSong(idx);
    });

    list.appendChild(item);
  });
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

// ── OPEN SONG ON YOUTUBE ──────────────────────────────────────────────────────
function openSong(idx) {
  if (idx < 0 || idx >= state.songs.length) return;
  const song = state.songs[idx];
  setNowPlaying(idx);
  window.open(`https://www.youtube.com/watch?v=${song.youtube_id}`, '_blank', 'noopener,noreferrer');
}

function setNowPlaying(idx) {
  if (idx < 0 || idx >= state.songs.length) return;
  state.currentSongIndex = idx;
  const song = state.songs[idx];

  $('#playerSongName').textContent = song.name;
  $('#playerSongArtist').textContent = song.artist;
  $('#openYouTubeBtn').href = `https://www.youtube.com/watch?v=${song.youtube_id}`;
  $('#playerBar').style.display = 'flex';

  // Highlight in list
  $$('.song-item').forEach((el, i) => el.classList.toggle('active', i === idx));

  // Scroll active item into view
  const el = document.getElementById('song-' + idx);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── REFRESH PLAYLIST ──────────────────────────────────────────────────────────
// Calls the server again — server reshuffles every call, so you get a fresh order
$('#refreshPlaylist').addEventListener('click', async () => {
  if (!state.emotion) return;
  const btn = $('#refreshPlaylist');
  btn.textContent = '⏳ Loading...';
  btn.disabled = true;
  await fetchAndRenderSongs(state.emotion);
  btn.textContent = '🔄 Refresh';
  btn.disabled = false;
});
