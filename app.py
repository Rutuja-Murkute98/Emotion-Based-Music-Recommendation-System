"""
app.py — Emotion Based Music Recommendation System
Flask backend: serves HTML, handles emotion detection via DeepFace,
returns song recommendations per emotion.
"""
import base64
import io
import os
import sys
from concurrent.futures import ThreadPoolExecutor

import cv2
import numpy as np
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from PIL import Image

# ── Add src to path ──────────────────────────────────────────────────────────
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from music_recommender import get_songs

load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')

# ── Lazy-load DeepFace so startup is fast ────────────────────────────────────
_deepface = None
_executor = ThreadPoolExecutor(max_workers=1)
_face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)


def get_deepface():
    global _deepface
    if _deepface is None:
        from deepface import DeepFace
        _deepface = DeepFace
    return _deepface


def decode_image_from_request(image_data: str):
    """Decode base64 payload to RGB numpy image and resize for faster inference."""
    if not image_data:
        return None, 'No image provided', 400

    if ',' in image_data:
        image_data = image_data.split(',', 1)[1]

    try:
        img_bytes = base64.b64decode(image_data)
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img_np = np.array(img)
    except Exception as e:
        return None, f'Invalid image: {e}', 400

    max_w = 480
    h, w = img_np.shape[:2]
    if w > max_w:
        new_h = int(h * (max_w / w))
        img_np = cv2.resize(img_np, (max_w, new_h), interpolation=cv2.INTER_AREA)

    return img_np, None, None


def has_face(img_np: np.ndarray) -> bool:
    """Fast face validation to reject non-face images early."""
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    faces = _face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(60, 60))
    return len(faces) > 0


def detect_emotion_from_array(img_np: np.ndarray):
    """Run emotion detection and normalize response."""
    if not has_face(img_np):
        return None, None, 'No face found in the image. Please provide a clear front-face photo.'

    try:
        DeepFace = get_deepface()
        result = DeepFace.analyze(
            img_np,
            actions=['emotion'],
            enforce_detection=False,
            detector_backend='opencv',
            silent=True,
        )
        face = result[0] if isinstance(result, list) else result
        dominant = face['dominant_emotion']
        confidence = float(face['emotion'][dominant])
        return dominant, confidence, None
    except Exception as e:
        return None, None, f'Detection failed: {e}'


def warmup_models():
    """Warm up DeepFace once in background to reduce first-request delay."""
    try:
        dummy = np.zeros((224, 224, 3), dtype=np.uint8)
        detect_emotion_from_array(dummy)
    except Exception:
        pass


# ── ROUTES ───────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.after_request
def add_no_cache_headers(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


@app.route('/api/detect-emotion', methods=['POST'])
def detect_emotion():
    """
    Accepts a base64-encoded image (data URL or raw base64).
    Returns { success, emotion, confidence } or { success: false, error }.
    """
    data = request.get_json(silent=True) or {}
    image_data = data.get('image', '')
    img_np, err_msg, status = decode_image_from_request(image_data)
    if err_msg:
        return jsonify({'success': False, 'error': err_msg}), status

    emotion, confidence, error = detect_emotion_from_array(img_np)
    if error:
        return jsonify({'success': False, 'error': error})

    return jsonify({'success': True, 'emotion': emotion, 'confidence': confidence})


@app.route('/api/detect-and-recommend', methods=['POST'])
def detect_and_recommend():
    """Detect emotion and return recommended songs in one response for lower latency."""
    data = request.get_json(silent=True) or {}
    image_data = data.get('image', '')
    limit = int(data.get('limit', 12))
    limit = max(1, min(limit, 30))

    img_np, err_msg, status = decode_image_from_request(image_data)
    if err_msg:
        return jsonify({'success': False, 'error': err_msg}), status

    emotion, confidence, error = detect_emotion_from_array(img_np)
    if error:
        return jsonify({'success': False, 'error': error})

    songs = get_songs(emotion, limit)
    return jsonify({
        'success': True,
        'emotion': emotion,
        'confidence': confidence,
        'songs': songs,
    })


@app.route('/api/get-songs', methods=['POST'])
def api_get_songs():
    """
    Accepts { emotion, limit }.
    Returns { success, songs: [...] }.
    Songs are reshuffled on every call so Refresh gives a new order.
    """
    data = request.get_json(silent=True) or {}
    emotion = data.get('emotion', 'neutral')
    limit = int(data.get('limit', 12))
    limit = max(1, min(limit, 30))

    songs = get_songs(emotion, limit)
    return jsonify({'success': True, 'emotion': emotion, 'songs': songs})


# ── RUN ───────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 8000))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    _executor.submit(warmup_models)
    print('=' * 52)
    print('  Emotion Based Music Recommendation System')
    print(f'  Running at http://127.0.0.1:{port}')
    print('=' * 52)
    app.run(host='0.0.0.0', port=port, debug=debug)
