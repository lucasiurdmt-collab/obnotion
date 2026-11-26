#!/usr/bin/env python3
"""
SinaiHUB - Motor Local de Download Universal (YouTube, Instagram, Facebook, TikTok, Imagens)
Usa yt-dlp + extração inteligente de imagens, com suporte CORS + Private Network Access.
"""

import html
import json
import mimetypes
import os
import re
import subprocess
import sys
import threading
import time
import urllib.parse
import urllib.request
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = int(os.environ.get("SINAIHUB_DL_PORT", "8787"))
DOWNLOAD_DIR = Path.home() / "Downloads" / "SinaiHUB"
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

JOBS = {}
JOBS_LOCK = threading.Lock()


def detect_platform(url: str) -> str:
    u = url.lower()
    if "youtube.com" in u or "youtu.be" in u:
        return "youtube"
    if "instagram.com" in u:
        return "instagram"
    if "facebook.com" in u or "fb.watch" in u or "fb.com" in u:
        return "facebook"
    if "tiktok.com" in u:
        return "tiktok"
    if "twitter.com" in u or "x.com" in u:
        return "x"
    if "pinterest." in u or "pin.it" in u:
        return "pinterest"
    if "threads.net" in u:
        return "threads"
    return "web"


def is_direct_image_url(url: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    ext = os.path.splitext(parsed.path.lower())[1]
    return ext in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg", ".avif"}


def extract_og_images(url: str):
    """Fallback para posts de imagem estática (Instagram/Facebook/Pinterest/Web)."""
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read().decode("utf-8", errors="ignore")

    title_match = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']', raw, re.I)
    if not title_match:
        title_match = re.search(r"<title>(.*?)</title>", raw, re.I | re.S)
    title = html.unescape(title_match.group(1)).strip() if title_match else "Imagem SinaiHUB"

    images = []
    for pattern in [
        r'<meta[^>]+property=["\']og:image(?::secure_url)?["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']',
    ]:
        for m in re.finditer(pattern, raw, re.I):
            img_url = html.unescape(m.group(1))
            if img_url not in images:
                images.append(img_url)

    return title[:120], images


def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r'[\\/:*?"<>|\r\n]+', "_", name).strip()
    return cleaned[:90] or f"sinaihub_{int(time.time())}"


def run_download_job(job_id: str, url: str, mode: str, quality: str):
    with JOBS_LOCK:
        JOBS[job_id]["status"] = "processing"
        JOBS[job_id]["message"] = "Analisando link com IA/yt-dlp..."

    platform = detect_platform(url)

    try:
        # 1. Caso seja link direto de imagem ou modo imagem explícito em URL direta
        if is_direct_image_url(url):
            parsed = urllib.parse.urlparse(url)
            ext = os.path.splitext(parsed.path)[1] or ".jpg"
            base = sanitize_filename(os.path.basename(parsed.path) or "imagem_sinaihub")
            if not base.lower().endswith(ext.lower()):
                base += ext
            target = DOWNLOAD_DIR / f"{int(time.time())}_{base}"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=25) as r, open(target, "wb") as f:
                f.write(r.read())
            with JOBS_LOCK:
                JOBS[job_id].update({
                    "status": "done",
                    "title": base,
                    "platform": platform,
                    "media_type": "image",
                    "filename": target.name,
                    "filepath": str(target),
                    "message": "Imagem baixada com sucesso!",
                })
            return

        # 2. Se modo == 'image', tentar thumbnail via yt-dlp --get-thumbnail ou fallback OG image
        if mode == "image":
            with JOBS_LOCK:
                JOBS[job_id]["message"] = "Extraindo imagem em alta resolução..."
            thumb_url = None
            title = "Imagem SinaiHUB"
            try:
                proc = subprocess.run(
                    [sys.executable, "-m", "yt_dlp", "--no-playlist", "--print", "%(title)s\n%(thumbnail)s", url],
                    capture_output=True, text=True, timeout=25
                )
                if proc.returncode == 0 and proc.stdout.strip():
                    lines = proc.stdout.strip().splitlines()
                    if len(lines) >= 2 and lines[1].startswith("http"):
                        title = lines[0].strip()
                        thumb_url = lines[1].strip()
            except Exception:
                pass

            if not thumb_url:
                og_title, og_images = extract_og_images(url)
                title = og_title or title
                if og_images:
                    thumb_url = og_images[0]

            if not thumb_url:
                raise RuntimeError("Não foi possível encontrar uma imagem pública neste link.")

            ext = os.path.splitext(urllib.parse.urlparse(thumb_url).path)[1]
            if ext.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
                ext = ".jpg"
            target = DOWNLOAD_DIR / f"{sanitize_filename(title)}_{int(time.time())}{ext}"
            req = urllib.request.Request(thumb_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=25) as r, open(target, "wb") as f:
                f.write(r.read())

            with JOBS_LOCK:
                JOBS[job_id].update({
                    "status": "done",
                    "title": title,
                    "platform": platform,
                    "media_type": "image",
                    "filename": target.name,
                    "filepath": str(target),
                    "message": "Imagem salva com sucesso!",
                })
            return

        # 3. Vídeo ou Áudio via yt-dlp
        unique_prefix = f"sh_{int(time.time())}_%(title).70s.%(ext)s"
        out_template = str(DOWNLOAD_DIR / unique_prefix)

        cmd = [sys.executable, "-m", "yt_dlp", "--no-playlist", "--restrict-filenames", "-o", out_template]

        if mode == "audio":
            cmd += ["-x", "--audio-format", "mp3", "--audio-quality", "0"]
        else:
            if quality == "1080":
                fmt = "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best[height<=1080]/best"
            elif quality == "720":
                fmt = "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best[height<=720]/best"
            else:
                fmt = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
            cmd += ["-f", fmt, "--merge-output-format", "mp4"]

        cmd += ["--print", "after_move:filepath", url]

        with JOBS_LOCK:
            JOBS[job_id]["message"] = f"Baixando de {platform.upper()}..."

        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=300)

        if proc.returncode != 0:
            err_text = (proc.stderr or proc.stdout or "").strip()
            # Fallback automático para post de imagem estática no Instagram/Facebook/Pinterest
            if "No video formats found" in err_text or "There is no video" in err_text or platform in {"instagram", "facebook", "pinterest"}:
                og_title, og_images = extract_og_images(url)
                if og_images:
                    img_url = og_images[0]
                    target = DOWNLOAD_DIR / f"{sanitize_filename(og_title)}_{int(time.time())}.jpg"
                    req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=25) as r, open(target, "wb") as f:
                        f.write(r.read())
                    with JOBS_LOCK:
                        JOBS[job_id].update({
                            "status": "done",
                            "title": og_title,
                            "platform": platform,
                            "media_type": "image",
                            "filename": target.name,
                            "filepath": str(target),
                            "message": "Post identificado como imagem e baixado!",
                        })
                    return
            raise RuntimeError(err_text.splitlines()[-1] if err_text else "Falha no yt-dlp.")

        lines = [line.strip() for line in proc.stdout.splitlines() if line.strip()]
        filepath = Path(lines[-1]) if lines else None
        if not filepath or not filepath.exists():
            # Procura arquivo mais recente criado no diretório
            candidates = sorted(DOWNLOAD_DIR.glob("sh_*"), key=lambda p: p.stat().st_mtime, reverse=True)
            filepath = candidates[0] if candidates else None

        if not filepath or not filepath.exists():
            raise RuntimeError("Download concluído, mas o arquivo final não foi localizado.")

        with JOBS_LOCK:
            JOBS[job_id].update({
                "status": "done",
                "title": filepath.stem,
                "platform": platform,
                "media_type": "audio" if mode == "audio" else "video",
                "filename": filepath.name,
                "filepath": str(filepath),
                "message": "Download concluído com sucesso!",
            })

    except Exception as exc:
        with JOBS_LOCK:
            JOBS[job_id].update({
                "status": "error",
                "platform": platform,
                "message": str(exc)[:300],
            })


class SinaiDownloaderHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Private-Network", "true")

    def _send_json(self, code: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/health":
            self._send_json(200, {
                "ok": True,
                "service": "SinaiHUB Media Downloader",
                "download_dir": str(DOWNLOAD_DIR),
            })
            return

        if parsed.path.startswith("/status/"):
            job_id = parsed.path.split("/status/", 1)[1]
            with JOBS_LOCK:
                job = JOBS.get(job_id)
            if not job:
                self._send_json(404, {"error": "Job não encontrado"})
                return
            self._send_json(200, job)
            return

        if parsed.path.startswith("/file/"):
            filename = urllib.parse.unquote(parsed.path.split("/file/", 1)[1])
            safe_name = os.path.basename(filename)
            target = DOWNLOAD_DIR / safe_name
            if not target.exists() or not target.is_file():
                self._send_json(404, {"error": "Arquivo não encontrado"})
                return
            ctype, _ = mimetypes.guess_type(str(target))
            ctype = ctype or "application/octet-stream"
            size = target.stat().st_size
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Disposition", f'attachment; filename="{safe_name}"')
            self.send_header("Content-Length", str(size))
            self.end_headers()
            with open(target, "rb") as f:
                while chunk := f.read(65536):
                    self.wfile.write(chunk)
            return

        self._send_json(404, {"error": "Rota inválida"})

    def do_POST(self):
        if self.path == "/download":
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length) if length > 0 else b"{}"
            try:
                data = json.loads(raw.decode("utf-8"))
            except Exception:
                self._send_json(400, {"error": "JSON inválido"})
                return

            url = (data.get("url") or "").strip()
            mode = (data.get("mode") or "video").strip()
            quality = (data.get("quality") or "1080").strip()

            if not url.startswith(("http://", "https://")):
                self._send_json(400, {"error": "Cole uma URL válida começando com http:// ou https://"})
                return

            job_id = uuid.uuid4().hex[:12]
            with JOBS_LOCK:
                JOBS[job_id] = {
                    "id": job_id,
                    "url": url,
                    "platform": detect_platform(url),
                    "status": "queued",
                    "message": "Na fila...",
                }

            t = threading.Thread(target=run_download_job, args=(job_id, url, mode, quality), daemon=True)
            t.start()
            self._send_json(200, {"job_id": job_id, "platform": detect_platform(url)})
            return

        self._send_json(404, {"error": "Rota inválida"})

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    print("=" * 54)
    print("  SinaiHUB - Motor Universal de Downloads (Python)")
    print(f"  Pasta de destino: {DOWNLOAD_DIR}")
    print(f"  Servidor ativo em: http://127.0.0.1:{PORT}")
    print("  Mantenha esta janela aberta enquanto baixa vídeos.")
    print("=" * 54)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), SinaiDownloaderHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando servidor SinaiHUB...")
        server.server_close()
