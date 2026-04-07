/**
 * Jednoduchý statický server bez závislostí (iba Node).
 * Počúva na 127.0.0.1 — ak je port obsadený, skúsi ďalší (3330–3339).
 */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const HOST = "127.0.0.1";
const PORT_MIN = Number(process.env.PORT) || 3330;
const PORT_MAX = PORT_MIN + 9;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
};

function safeFilePath(urlPath) {
  let p = urlPath.split("?")[0];
  if (p.endsWith("/")) p += "index.html";
  if (p === "" || p === "/") p = "/index.html";
  const rel = p.replace(/^\/+/, "");
  const abs = path.join(ROOT, rel);
  const normRoot = path.resolve(ROOT) + path.sep;
  const normAbs = path.resolve(abs);
  if (!normAbs.startsWith(normRoot) && normAbs !== path.resolve(ROOT)) return null;
  return normAbs;
}

async function handler(req, res) {
  try {
    const urlPath = decodeURIComponent(new URL(req.url || "/", "http://127.0.0.1").pathname);
    const filePath = safeFilePath(urlPath);
    if (!filePath) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403");
      return;
    }
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch (e) {
    if (e && e.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(e && e.message ? e.message : e));
  }
}

function tryListen(port) {
  const server = http.createServer(handler);
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && port < PORT_MAX) {
      console.warn(`Port ${port} je obsadený, skúšam ${port + 1}…`);
      tryListen(port + 1);
      return;
    }
    console.error(err);
    process.exit(1);
  });
  server.listen(port, HOST, () => {
    console.log("");
    console.log(`  STRINGS — lokálny náhľad (HTML, CSS, obrázky, fonty)`);
    console.log(`  → http://localhost:${port}/`);
    console.log(`  (via ${HOST}:${port})`);
    console.log("");
  });
}

tryListen(PORT_MIN);
