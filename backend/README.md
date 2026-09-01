# CINTRA Backend

Independent FastAPI backend for the CINTRA mobile scanner. It uses SQLite, OpenCV face detection, and a deterministic **demo** matcher. Demo matching is only a pipeline demonstration, not biometric or forensic recognition.

## Setup

Requires Python 3.10+. From `backend`:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python -m app.utils.seed_data
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger is at `http://127.0.0.1:8000/docs`. Run tests with `pytest`.

`MATCHING_MODE=demo` is the supported default. `real` currently returns no match until a reliable pretrained recognition adapter is added; it deliberately does not make the app depend on one.

The SQLite database is created/seeded at startup without deleting existing rows. `data/offline_cache.json` is a portable demo metadata cache only: a backend cannot provide offline phone identification without a mobile-side model and data.

For production, restrict the CORS origin list and add authentication/authorization separately.
