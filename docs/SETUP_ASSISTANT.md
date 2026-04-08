# Nastavenie: Next.js + FastAPI + Vercel + GitHub

Tento dokument popisuje, čo je v repozitári zapojené a ako to používať. Úplne „bez jediného kliknutia“ to nejde: **GitHub push** a **Vercel deploy** vždy vyžadujú tvoj účet (token alebo SSH kľúč) alebo jednorazové prepojenie projektu vo Vercel dashboarde.

## 1. Čo je v repozitári

| Súčasť | Účel |
|--------|------|
| `main.py` | FastAPI `app` — endpointy **iba** pod `/api/*` (žiadna kolízia s Next.js na `/`). OpenAPI: `/api/docs`. |
| `requirements.txt` | Produkčné Python závislosti (bez Mangum — Vercel FastAPI je natívny). |
| `requirements-dev.txt` | Pytest + httpx pre testy. |
| `tests/` | API testy (`/api/health`, `/api/`). |
| `vercel.json` | `installCommand`: `npm ci` + `pip`; `buildCommand`: `npm run build`. |
| `next.config.js` | Ak je `VERCEL=1`, **nie je** `output: export` — aby na Verceli fungovali serverless funkcie vrátane FastAPI. Lokálne (bez `VERCEL`) ostáva statický export do `out/`. |
| `.env.example` | Šablóna premenných; `.env` je v `.gitignore`. |
| `.python-version` | Odporúčaná verzia Pythonu (3.12). |
| `.vscode/extensions.json` | Odporúčané rozšírenia Python / Pylance. |
| `docs/ci-python-next.yml` | Šablóna CI. Skopíruj do `.github/workflows/ci.yml` (GitHub môže vyžadovať PAT s „workflow“ pri pushi). |

## 2. Lokálny vývoj

```bash
npm install
pip install -r requirements.txt
pip install -r requirements-dev.txt   # voliteľné, pre testy
```

- **Next.js:** `npm run dev` → http://localhost:3000  
- **FastAPI:** `npm run dev:api` alebo `python3 main.py` → http://127.0.0.1:8000 — napr. `/api/health`, `/api/docs`  
- **Testy API:** `npm run test:api`  
- **Statický export (ako predtým):** `npm run build` bez `VERCEL` → priečinok `out/`  
- **Build ako na Verceli:** `VERCEL=1 npm run build`

## 3. Cursor / VS Code

Projekt používa rovnaké nastavenia ako VS Code (`.vscode/`). Po otvorení priečinka Cursor ponúkne inštaláciu odporúčaných rozšírení (Python, Pylance).

## 4. GitHub

- Bežný workflow: commit → `git push`.  
- Ak GitHub odmietne push súborov pod `.github/workflows/`, pridaj workflow ručne v UI alebo použij SSH / token s oprávnením **workflow**. Záložný obsah je v `docs/ci-python-next.yml`.

## 5. Vercel

1. [vercel.com](https://vercel.com) → **Import Project** → tento repozitár.  
2. Framework: **Next.js**. Root: koreň repozitára.  
3. Build použije `vercel.json` (Node + Python deps). Premenná **`VERCEL`** nastavuje Vercel automaticky pri deployi — Next tým vypne čistý statický export a funguje spolu s FastAPI.  
4. Po deployi: frontend na `https://<projekt>.vercel.app/`, API napr. `https://<projekt>.vercel.app/api/health`, dokumentácia `.../api/docs`.  
5. **Environment Variables:** `ENVIRONMENT`, `CORS_ORIGINS` (vrátane URL tvojho `*.vercel.app`).

## 6. Čo tým získaš

- Next.js na Vercel + voliteľná GitHub Pages statika (`strings-static/`).  
- FastAPI pod `/api/*` bez kolízie s titulnou stránkou Next.js.  
- CI šablóna: pytest + `VERCEL=1 npm run build`.

## 7. Obmedzenia

- Prihlásenie na Vercel a uloženie tokenov musíš spraviť ty.  
- Git push vyžaduje tvoje overenie (SSH/PAT).
