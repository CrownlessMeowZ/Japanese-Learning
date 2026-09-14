// ==========================================================================
// Service Worker: Nihongo Master PWA
// Hỗ trợ hoạt động Offline 100% (Cache-first cho static assets & Offline Fallback)
// ==========================================================================

const CACHE_NAME = 'nihongo-master-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

// 1. Cài đặt Service Worker và lưu trước các file tĩnh cốt lõi
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. Kích hoạt và dọn dẹp các cache cũ nếu có
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Xử lý Fetch Request: Cache-First cho App Shell & Network-First cho API
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Đối với API bên ngoài (Google Translate API): Network First, không lưu cache API
  if (requestUrl.hostname.includes('translate.googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // Đối với các file asset của ứng dụng (HTML, JS, CSS, Font, Image):
  // Chiến lược Stale-While-Revalidate / Cache First để đảm bảo luôn mở được khi offline
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Cập nhật ngầm trong nền nếu có mạng
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {
            // Đang offline, tiếp tục dùng cachedResponse
          });
        return cachedResponse;
      }

      // Nếu chưa có trong cache thì fetch từ network và lưu vào cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Khi mất mạng và là trang HTML thì trả về index.html trong cache
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html') || caches.match('/');
          }
        });
    })
  );
});
