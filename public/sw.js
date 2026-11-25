// ==========================================================================
// Service Worker: Nihongo Master PWA
// Pre-cache 100% tài nguyên (App Shell + Lazy Chunks + CSS) & Offline Fallback
// ==========================================================================

const IS_PRODUCTION_BUILD = false;
const CACHE_NAME = 'nihongo-master-dev';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
];

// Chỉ coi là Dev Server khi chạy bản chưa build hoặc cổng Vite Dev (5173)
// Bản build production chạy qua `vite preview` (4173) hoặc host thực tế sẽ kích hoạt PWA Pre-cache đầy đủ
const isViteDevServer = !IS_PRODUCTION_BUILD || self.location.port === '5173';

const getScopeUrl = (assetPath) => new URL(assetPath, self.registration.scope).href;

const matchFromCache = async (request, urlObj, sameOrigin) => {
  const direct = await caches.match(request, { ignoreVary: true });
  if (direct) return direct;
  if (sameOrigin) {
    return caches.match(`${urlObj.origin}${urlObj.pathname}`, { ignoreVary: true });
  }
  return undefined;
};

// 1. Cài đặt Service Worker và Pre-cache toàn bộ tài nguyên ứng dụng (bao gồm tất cả lazy chunks)
self.addEventListener('install', (event) => {
  if (isViteDevServer) {
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const urls = [...new Set(PRECACHE_ASSETS.map(getScopeUrl))];
      const requests = urls.map((url) => new Request(url, { cache: 'reload' }));
      try {
        await cache.addAll(requests);
      } catch (err) {
        console.warn('[PWA SW] Batch precache failed, falling back to per-file:', err);
        // Fallback nạp từng file nếu có 1 resource phụ lỗi mạng tạm thời
        await Promise.allSettled(requests.map((req) => cache.add(req)));
      }
      await self.skipWaiting();
    })
  );
});

// 2. Kích hoạt và dọn dẹp các cache phiên bản cũ
self.addEventListener('activate', (event) => {
  if (isViteDevServer) {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim())
    );
    return;
  }

  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. Xử lý Fetch Request: Network-only cho API dịch, Cache-First cho tài nguyên tĩnh & Font
self.addEventListener('fetch', (event) => {
  if (isViteDevServer || event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
    return;
  }

  // API dịch thuật bên ngoài (Google Translate & MyMemory): chỉ gọi mạng, trả JSON lỗi khi Offline
  if (
    requestUrl.hostname.includes('translate.googleapis.com') ||
    requestUrl.hostname.includes('api.mymemory.translated.net')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isGoogleFont =
    requestUrl.hostname === 'fonts.googleapis.com' ||
    requestUrl.hostname === 'fonts.gstatic.com';

  if (!isSameOrigin && !isGoogleFont) {
    return;
  }

  const isHashedAsset = isSameOrigin && requestUrl.pathname.includes('/assets/');

  event.respondWith(
    matchFromCache(event.request, requestUrl, isSameOrigin).then((cachedResponse) => {
      if (cachedResponse) {
        // Tài nguyên không gắn hash (index.html, manifest.json, Google Fonts CSS) cập nhật ngầm khi online
        if (!isHashedAsset) {
          fetch(event.request)
            .then((networkResponse) => {
              if (
                networkResponse &&
                networkResponse.status === 200 &&
                (networkResponse.type === 'basic' || networkResponse.type === 'cors')
              ) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
              }
            })
            .catch(() => {
              // Đang offline, tiếp tục dùng bản cache
            });
        }
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')
          ) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          if (
            event.request.mode === 'navigate' ||
            event.request.headers.get('accept')?.includes('text/html')
          ) {
            return caches.match(getScopeUrl('./index.html'), { ignoreVary: true }).then(async (html) => {
              if (html) return html;
              return (await caches.match(getScopeUrl('./'), { ignoreVary: true })) || Response.error();
            });
          }
          return Response.error();
        });
    })
  );
});
