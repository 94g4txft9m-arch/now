# Nastavenie: Next.js + FastAPI + Vercel + GitHub

Tento dokument popisuje, čo je v repozitári zapojené a ako to používať. Úplne „bez jediného kliknutia“ to nejde: **GitHub push** a **Vercel deploy** vždy vyžadujú tvoj účet (token alebo SSH kľúč) alebo jednorazové prepojenie projektu vo Vercel dashboarde.

## 1. Čo bolo pridané

| Súčasť | Účel |
|--------|------|
| `main.py` | FastAPI aplikácia (`/`, `/health`, `/docs`). |
| `api/index.py` | Handler pre Vercel (Mangum → ASGI). |
| `requirements.txt` | Produkčné Python závislosti. |
| `requirements-dev.txt` | Pytest + httpx pre testy. |
| `tests/` | Základné API testy. |
| `vercel.json` | `installCommand`: npm + pip pred buildom Next.js. |
| `.env.example` | Šablóna premenných; `.env` je v `.gitignore`. |
| `.python-version` | Odporúčaná verzia Pythonu (3.12). |
| `.vscode/extensions.json` | Odporúčané rozšírenia Python / Pylance. |
| `docs/ci-python-next.yml` | Šablóna CI (build Next + pytest). Skopíruj do `.github/workflows/ci.yml` (GitHub vyžaduje PAT s „workflow“ alebo SSH pri pushi workflow súborov). |

## 2. Lokálny vývoj

```bash
npm install
pip install -r requirements.txt
pip install -r requirements-dev.txt   # voliteľné, pre testy
```

- **Next.js:** `npm run dev` → http://localhost:3000  
- **FastAPI:** `npm run dev:api` alebo `python3 main.py` → http://127.0.0.1:8000 (OpenAPI: `/docs`)  
- **Testy API:** `npm run test:api`

## 3. Cursor / VS Code

Projekt používa rovnaké nastavenia ako VS Code (`.vscode/`). Po otvorení priečinka Cursor ponúkne inštaláciu odporúčaných rozšírení (Python, Pylance). Žiadna špeciálna „integrácia AI“ v kóde nie je potrebná — Cursor číta workspace tak ako VS Code.

## 4. GitHub

- Bežný workflow: commit → `git push`.  
- Ak GitHub odmietne push súborov pod `.github/workflows/` (PAT bez scope **workflow**), pridaj workflow ručne v UI alebo použij SSH / token s oprávnením **workflow**. Záložný popis je v `docs/ci-python-next.yml`.

## 5. Vercel (automatické nasadenie po pushi)

1. Prihlás sa na [vercel.com](https://vercel.com), **Import Project** → vyber tento GitHub repozitár.  
2. Framework: **Next.js** (predvolené). Root: koreň repozitára.  
3. Build použije `vercel.json` → nainštaluje Node aj `pip install -r requirements.txt`.  
4. Po úspešnom deployi dostaneš URL typu `https://<projekt>.vercel.app`.  
5. Premenné z `.env.example` môžeš nastaviť v **Project → Settings → Environment Variables** (napr. `ENVIRONMENT=production`, `CORS_ORIGINS=https://tvoj-projekt.vercel.app`).

**Poznámka:** Python funkcia je v `api/index.py`. Cesta na produkcii závisí od Vercel routingu; ak uvidíš 404 na `/api`, skontroluj v dashboarde **Functions** a prípadne pridaj rewrite v `vercel.json` podľa aktuálnej dokumentácie Vercel.

## 6. Čo tým získaš

- **Web (Next.js)** na Vercel + voliteľná **GitHub Pages** statika (`strings-static/`).  
- **REST API (FastAPI)** s dokumentáciou `/docs`, rozšíriteľné o ďalšie routere v `main.py`.  
- **CI** na GitHub Actions: build frontendu + pytest pre API.  
- Jednotné lokálne príkazy v `package.json` (`dev`, `dev:api`, `test:api`).

## 7. Obmedzenia (realisticky)

- **Nemôžem** namiesto teba prihlásiť Vercel ani uložiť tvoj token do cloudu.  
- **Nemôžem** zaručiť push na GitHub bez tvojho overenia (SSH/PAT).  
- Chyby pri buildoch sa majú opravovať iteratívne; tento repozitár má základ, ktorý by mal prejsť `npm run build` a `pytest` na čistom prostredí.
