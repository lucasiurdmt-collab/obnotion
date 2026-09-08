// ============================================================
// Servidor de Vídeos Local - Obnotion
// Serve vídeos da pasta ObnotionVideos via HTTP com streaming
// para uso no vMix, tablets e projetores da igreja.
// ============================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 9090;
const VIDEO_DIR = path.join(os.homedir(), 'ObnotionVideos');

// Cria a pasta de vídeos se não existir
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
  console.log(`Pasta criada: ${VIDEO_DIR}`);
}

const MIME_TYPES = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.m4v': 'video/mp4',
};

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  // CORS — permite qualquer origem (necessário para o site GitHub Pages)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: listar vídeos disponíveis
  if (req.url === '/api/videos') {
    const localIP = getLocalIP();
    const baseUrl = `http://${localIP}:${PORT}`;

    let files;
    try {
      files = fs.readdirSync(VIDEO_DIR).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return Object.keys(MIME_TYPES).includes(ext);
      });
    } catch (e) {
      files = [];
    }

    const videos = files.map(f => {
      const stat = fs.statSync(path.join(VIDEO_DIR, f));
      const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
      return {
        name: f.replace(/\.[^/.]+$/, ''),
        filename: f,
        size: `${sizeMb} MB`,
        sizeBytes: stat.size,
        url: `${baseUrl}/${encodeURIComponent(f)}`
      };
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ serverUrl: baseUrl, videos }));
    return;
  }

  // Servir arquivo de vídeo com suporte a Range (streaming/seek)
  const filename = decodeURIComponent(req.url.slice(1));
  
  // Segurança: impedir path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const filepath = path.join(VIDEO_DIR, filename);

  if (!fs.existsSync(filepath)) {
    res.writeHead(404);
    res.end('Arquivo nao encontrado');
    return;
  }

  const stat = fs.statSync(filepath);
  const ext = path.extname(filename).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  // Suporte a Range requests (essencial para streaming de vídeo grande)
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(filepath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimeType,
    });
    stream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(filepath).pipe(res);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('');
  console.log('  ╔═══════════════════════════════════════════════════╗');
  console.log('  ║     SERVIDOR DE VÍDEOS OBNOTION - ATIVO          ║');
  console.log('  ╚═══════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  📁 Pasta de vídeos: ${VIDEO_DIR}`);
  console.log('');
  console.log(`  🖥️  Acesso local:  http://localhost:${PORT}`);
  console.log(`  📱 Acesso rede:   http://${localIP}:${PORT}`);
  console.log('');
  console.log('  ┌─────────────────────────────────────────────────┐');
  console.log('  │ COMO USAR:                                      │');
  console.log('  │ 1. Coloque os vídeos na pasta acima             │');
  console.log('  │ 2. No controle de telão, clique em              │');
  console.log('  │    "Buscar do Servidor"                         │');
  console.log('  │ 3. Os vídeos aparecerão automaticamente         │');
  console.log('  │ 4. Funciona no vMix, tablet e projetor!         │');
  console.log('  └─────────────────────────────────────────────────┘');
  console.log('');
  console.log('  Pressione Ctrl+C para parar o servidor.');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ❌ ERRO: A porta ${PORT} já está em uso!`);
    console.error('  Feche o outro servidor ou mude a porta.\n');
  } else {
    console.error('\n  ❌ ERRO:', err.message, '\n');
  }
  process.exit(1);
});
