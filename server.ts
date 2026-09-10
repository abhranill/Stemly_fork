import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './api/app';

const PORT = 3000;

// Vite middleware & Static serving for container / local dev
async function startServer() {
  // Prevent browser caching on HTML entrypoint
  app.use((req, res, next) => {
    if (req.path === '/' || req.path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Visu AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
