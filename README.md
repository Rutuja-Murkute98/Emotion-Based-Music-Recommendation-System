<div align="center">

# 🎵 Emotion Based Music Recommendation System

**AI-powered Bollywood playlist app that detects your facial emotion and suggests matching songs instantly.**

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![DeepFace](https://img.shields.io/badge/DeepFace-AI-FF6B35?style=for-the-badge&logo=tensorflow&logoColor=white)](https://github.com/serengil/deepface)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.x-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org)
[![YouTube](https://img.shields.io/badge/YouTube-Playback-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com)

</div>

---

## ✨ What It Does

> Point your webcam at your face — the AI detects your emotion and builds a Bollywood playlist for that mood. Every refresh gives you a new shuffle.

---

## 🔄 How It Works

```
📸 Capture Face  →  🧠 DeepFace AI  →  🎵 Match Songs  →  ▶ Play on YouTube  →  🔄 Refresh
   (webcam /           detects            12 Bollywood         opens in             reshuffles
   photo /             dominant           songs for            new tab              every call
   manual mood)        emotion            your mood
```

---

## 📁 Project Structure

```
emotion-music/
│
├── 📄 app.py                        ← Flask backend + emotion detection API   [CORE]
├── 📄 requirements.txt              ← Python dependencies
├── 📄 run.bat                       ← Windows one-click launcher
├── 📄 .env                          ← FLASK_PORT, FLASK_DEBUG config
├── 📄 .gitignore
│
├── 📂 src/
│   └── 📄 music_recommender.py      ← Song library (7 emotions × 12 songs)   [CORE]
│
├── 📂 templates/
│   └── 📄 index.html                ← Single-page app UI                      [CORE]
│
├── 📂 static/
│   ├── 📂 css/
│   │   └── 📄 style.css             ← All styles
│   └── 📂 js/
│       └── 📄 app.js                ← All frontend logic
│
├── 📂 scripts/
│   └── 📄 refresh_youtube_ids.py   ← Optional: fix dead YouTube links
│
└── 📂 data/                         ← Gitignored local data folder
```

---

## 🚀 Setup & Installation

### Step 1 — Clone or extract the project

```bash
cd emotion-music
```

### Step 2 — Create a virtual environment

```bash
python -m venv .venv
```

### Step 3 — Activate the virtual environment

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS / Linux:**
```bash
source .venv/bin/activate
```

### Step 4 — Install dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ DeepFace will download model weights (~100 MB) on the **first run only**. This is a one-time download.

### Step 5 — Run the app

**Windows (double-click or run in terminal):**
```bash
run.bat
```

**Or directly:**
```bash
python app.py
```

### Step 6 — Open in browser

```
http://127.0.0.1:8000
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/` | Serve the web app | — |
| `POST` | `/api/detect-emotion` | Detect emotion from base64 image | `{ "image": "data:image/..." }` |
| `POST` | `/api/get-songs` | Get shuffled playlist for an emotion | `{ "emotion": "happy", "limit": 12 }` |

### Example Response — `/api/detect-emotion`

```json
{
  "success": true,
  "emotion": "happy",
  "confidence": 94.7
}
```

### Example Response — `/api/get-songs`

```json
{
  "success": true,
  "emotion": "happy",
  "songs": [
    {
      "name": "Badtameez Dil",
      "artist": "Shalmali Kholgade",
      "album": "Yeh Jawaani Hai Deewani",
      "youtube_id": "II2EO3Nw4m0"
    }
  ]
}
```

---

## 😊 Supported Emotions

| Emotion | Emoji | Songs |
|---------|-------|-------|
| Happy | 😊 | Upbeat, energetic Bollywood hits |
| Sad | 😢 | Soulful, emotional melodies |
| Angry | 😠 | Powerful, intense tracks |
| Fear | 😨 | Calming, soothing songs |
| Neutral | 😐 | Easy-listening, mellow tunes |
| Surprise | 😲 | Fun, peppy dance numbers |
| Disgust | 🤢 | Classic, timeless Bollywood |

> Each emotion has **12 curated songs** that are **reshuffled on every API call** — so Refresh always gives something new.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `flask` | Web server and API routing |
| `deepface` | Facial emotion analysis (wraps TensorFlow) |
| `opencv-python` | Face detection backend used by DeepFace |
| `tf-keras` | Keras compatibility layer for TF models |
| `numpy` | Image array processing |
| `pillow` | Decoding uploaded images from base64 |
| `python-dotenv` | Loads config from `.env` file |
| `requests` | HTTP utility (available for extensions) |

---

## ⚙️ Configuration

Edit the `.env` file in the project root:

```env
FLASK_PORT=8000
FLASK_DEBUG=false
```

---

## 💡 Tips for Best Results

**Camera capture:**
- Face the camera directly with good, even lighting
- Avoid strong backlighting behind you
- Use the green circle guide to position your face correctly

**Photo upload:**
- Use a clear, front-facing photo
- JPG and PNG supported, max 10 MB
- Single faces work best

---

## 🛠️ Optional Utility — Refresh YouTube IDs

If YouTube links go dead over time, this script validates all IDs and finds replacements automatically:

```bash
pip install yt-dlp
python scripts/refresh_youtube_ids.py
```

---

## 📝 Notes

- **Songs open on YouTube** in a new tab — no in-app audio streaming (avoids CORS and DRM issues)
- **Playlist reshuffles** on every Refresh because the server calls `random.shuffle()` on each request
- **First-run download** — DeepFace downloads model weights once (~100 MB), then works offline

---

<div align="center">

**🎵 EmotionMusic — AI Powered Bollywood Playlists**

Made with ❤️ using Flask · DeepFace · OpenCV

</div>
