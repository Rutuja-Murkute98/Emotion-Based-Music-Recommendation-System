# Emotion Based Music Recommendation System

AI-powered Bollywood playlist app that detects your emotion (from webcam or uploaded photo) and suggests matching songs.

---

## How It Works

1. **Detect Emotion** — via webcam capture, photo upload, or manual mood selection
2. **DeepFace** analyses the face and returns a dominant emotion
3. **Song Recommender** returns a shuffled playlist of Bollywood songs for that emotion
4. **Play** — each song opens directly on YouTube in a new tab
5. **Refresh** — re-fetches from the server, which reshuffles the list each time

---

## Project Structure

```
emotion-music/
├── app.py                    ← Flask backend (emotion detection + song API)
├── requirements.txt          ← Python dependencies
├── run.bat                   ← Windows launcher
├── .env                      ← FLASK_PORT, FLASK_DEBUG
├── .gitignore
│
├── src/
│   └── music_recommender.py  ← Song library (7 emotions × 12 songs) + get_songs()
│
├── templates/
│   └── index.html            ← Single-page app HTML
│
├── static/
│   ├── css/style.css         ← All styles
│   └── js/app.js             ← All frontend logic
│
├── scripts/
│   └── refresh_youtube_ids.py ← Validate/replace broken YouTube IDs (optional utility)
│
└── data/                     ← Gitignored data directory
```

---

## Setup

### 1. Create virtual environment
```bash
python -m venv .venv
```

### 2. Activate it
```bash
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run
```bash
# Windows
run.bat

# Or directly
python app.py
```

Open **http://127.0.0.1:8000** in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serve the web app |
| POST | `/api/detect-emotion` | Detect emotion from base64 image |
| POST | `/api/get-songs` | Get shuffled songs for an emotion |

---

## Emotions Supported

`happy` · `sad` · `angry` · `fear` · `neutral` · `surprise` · `disgust`

---

## Refreshing YouTube IDs (optional)

If any YouTube links go dead over time:
```bash
pip install yt-dlp
python scripts/refresh_youtube_ids.py
```

This checks all IDs and replaces broken ones automatically.

---

## Notes

- Songs open on **YouTube in a new tab** (no in-app audio streaming — avoids all CORS/DRM issues)
- The playlist reshuffles on every Refresh call since the server uses `random.shuffle`
- DeepFace downloads model weights on first run (~100MB, one-time only)
