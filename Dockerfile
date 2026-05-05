FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install system libraries required by OpenCV / Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install (will install TensorFlow CPU build inside container)
COPY requirements.txt ./
RUN pip install --upgrade pip setuptools wheel
RUN pip install -r requirements.txt

# Copy app
COPY . .

ENV PORT=8000
EXPOSE 8000

# Use gunicorn to run the Flask app
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8000", "app:app"]
