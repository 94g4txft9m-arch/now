/**
 * Jednoduchý statický server bez závislostí (iba Node).
 * Počúva na 127.0.0.1 — spoľahlivé prepojenie na http://localhost:3330/
 */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3330;
const HOST = "127.0.0.1";

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

const server = http.createServer(async (req, res) => {
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
});

server.listen(PORT, HOST, () => {
  console.log(`STRINGS statika: http://localhost:${PORT}/`);
  console.log(`(via ${HOST}:${PORT})`);
});
