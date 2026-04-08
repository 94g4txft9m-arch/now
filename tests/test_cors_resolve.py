import main


def test_resolve_cors_origins_defaults_localhost(monkeypatch):
    monkeypatch.delenv("CORS_ORIGINS", raising=False)
    monkeypatch.delenv("VERCEL_URL", raising=False)
    monkeypatch.delenv("VERCEL_PROJECT_PRODUCTION_URL", raising=False)
    o = main.resolve_cors_origins()
    assert "http://localhost:3000" in o


def test_resolve_cors_origins_merges_vercel_url(monkeypatch):
    monkeypatch.delenv("CORS_ORIGINS", raising=False)
    monkeypatch.setenv("VERCEL_URL", "proj-abc123.vercel.app")
    monkeypatch.setenv("VERCEL_PROJECT_PRODUCTION_URL", "proj.vercel.app")
    o = main.resolve_cors_origins()
    assert "https://proj-abc123.vercel.app" in o
    assert "https://proj.vercel.app" in o
