# STRINGS — web (Next.js)

**Verejný statický web STRINGS** je v priečinku [`strings-static/`](strings-static/). Lokálne: `cd strings-static && npm install && npm run dev` (server na `http://127.0.0.1:3330`). Nasadenie na GitHub Pages: `./scripts/github-pages-process.sh sync-gh-pages` (vetva `gh-pages`; podrobnosti v [`docs/GITHUB_PAGES_NASTAVENIE.txt`](docs/GITHUB_PAGES_NASTAVENIE.txt)).

---

Statický export Next.js pre Vercel a GitHub Pages. **Koreň projektu** je priečinok s `app/` a `package.json`). Ak otvoríte omylom `strings-web/`, použite `npm run dev` aj tam — skripty sa presmerujú do koreňa.

**Pred prvým spustením:** v koreňovom priečinku spustite `npm install` a `pip install -r requirements.txt` (Python 3.12 odporúčané; verzia je v [`.python-version`](.python-version)).

### FastAPI (Python)

- API kód: [`main.py`](main.py), vstup pre Vercel: [`api/index.py`](api/index.py) (Mangum).
- Lokálne: `npm run dev:api` alebo `python3 main.py` → [http://127.0.0.1:8000](http://127.0.0.1:8000), dokumentácia OpenAPI: `/docs`.
- Premenné: skopíruj [`.env.example`](.env.example) do `.env` (`.env` sa necommituje).
- Testy: `pip install -r requirements-dev.txt` a `npm run test:api`.
- Vercel: po prepojení repozitára v dashboarde sa pri každom pushi na sledovanú vetvu spustí build (`vercel.json` inštaluje aj `requirements.txt`). CI šablóna: [`docs/ci-python-next.yml`](docs/ci-python-next.yml). Podrobnosti: [`docs/SETUP_ASSISTANT.md`](docs/SETUP_ASSISTANT.md).

- Lokálne Next.js: [http://localhost:3000](http://localhost:3000) po `npm run dev`
- GitHub Pages (statika): `https://<owner>.github.io/<repo>/` — napr. `https://94g4txft9m-arch.github.io/now/`

## Getting Started

First, run the development server from the **repository root**:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
