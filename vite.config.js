import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function serveRootFoldersPlugin() {
  return {
    name: 'serve-root-folders',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          const rawUrl = req.url ? req.url.split('?')[0] : '';
          const url = decodeURI(rawUrl);
          if (
            url.startsWith('/images/') ||
            url.startsWith('/3D/') ||
            url.startsWith('/image/') ||
            url.startsWith('/data/')
          ) {
            const filePath = path.join(process.cwd(), url.slice(1));
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeMap = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.json': 'application/json',
              };
              if (mimeMap[ext]) {
                res.setHeader('Content-Type', mimeMap[ext]);
              }
              return fs.createReadStream(filePath).pipe(res);
            }
          }
        } catch (e) {}
        next();
      });
    },
    closeBundle() {
      const copyDir = (src, dest) => {
        if (!fs.existsSync(src)) return;
        fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
      copyDir(path.join(process.cwd(), 'images'), path.join(process.cwd(), 'dist/images'));
      copyDir(path.join(process.cwd(), '3D'), path.join(process.cwd(), 'dist/3D'));
      copyDir(path.join(process.cwd(), 'image'), path.join(process.cwd(), 'dist/image'));
      copyDir(path.join(process.cwd(), 'data'), path.join(process.cwd(), 'dist/data'));
    },
  };
}

export default defineConfig({
  plugins: [react(), serveRootFoldersPlugin()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
          pdf: ['jspdf', 'canvas-confetti'],
        },
      },
    },
  },
});
