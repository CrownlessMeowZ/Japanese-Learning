import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Plugin build nội bộ tự động quét toàn bộ file tĩnh & lazy chunks trong dist/
 * để nhúng danh sách PRECACHE_ASSETS + mã băm phiên bản vào dist/sw.js.
 */
function pwaPrecachePlugin() {
  let outDir = 'dist';

  return {
    name: 'nihongo-pwa-precache',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir || 'dist');
    },
    closeBundle() {
      const swPath = path.join(outDir, 'sw.js');
      if (!fs.existsSync(swPath)) return;

      const assets = new Set(['./']);

      const walkDir = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walkDir(fullPath);
            continue;
          }
          if (entry.name === 'sw.js' || entry.name.endsWith('.map')) {
            continue;
          }
          const relPath = path.relative(outDir, fullPath).split(path.sep).join('/');
          assets.add(`./${relPath}`);
        }
      };

      walkDir(outDir);

      const sortedAssets = [...assets].sort();
      let swContent = fs.readFileSync(swPath, 'utf8');
      const buildHash = crypto
        .createHash('sha256')
        .update(swContent + '\n' + sortedAssets.join('\n'))
        .digest('hex')
        .slice(0, 8);

      swContent = swContent
        .replace(
          'const IS_PRODUCTION_BUILD = false;',
          'const IS_PRODUCTION_BUILD = true;'
        )
        .replace(
          "const CACHE_NAME = 'nihongo-master-dev';",
          `const CACHE_NAME = 'nihongo-master-${buildHash}';`
        )
        .replace(
          /const PRECACHE_ASSETS = \[[\s\S]*?\];/,
          `const PRECACHE_ASSETS = ${JSON.stringify(sortedAssets, null, 2)};`
        );

      fs.writeFileSync(swPath, swContent, 'utf8');
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwaPrecachePlugin()],
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
