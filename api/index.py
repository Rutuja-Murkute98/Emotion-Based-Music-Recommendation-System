"""Vercel entry point for the Emotion Music app."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import app as flask_app  # noqa: E402

app = flask_app
application = flask_app
handler = flask_app
