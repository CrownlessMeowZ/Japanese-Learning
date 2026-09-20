/**
 * Đăng ký Service Worker cho Nihongo Master PWA
 * - Ở môi trường DEV (localhost): Tự động gỡ bỏ Service Worker và dọn cache để Vite HMR cập nhật code tức thì.
 * - Ở môi trường PROD: Đăng ký Service Worker để ứng dụng chạy 100% Offline PWA.
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  // 1. Trong môi trường phát triển (Development / Localhost):
  // Hủy toàn bộ Service Worker cũ và xóa Cache Storage để tránh việc phải F5/tải lại trang thủ công
  if (import.meta.env.DEV) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        let hadOldController = Boolean(navigator.serviceWorker.controller);
        for (const reg of registrations) {
          reg.unregister();
          console.log('[PWA DEV] Đã gỡ Service Worker để hỗ trợ cập nhật code tức thì (Zero Cache):', reg.scope);
        }
        if ('caches' in window) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          });
        }
        // Nếu trang đang bị kẹt dưới Service Worker cũ, reload tự động 1 lần để giải phóng hoàn toàn
        if (hadOldController) {
          console.log('[PWA DEV] Đang tự động giải phóng trang khỏi cache cũ...');
          window.location.reload();
        }
      });
    }
    return;
  }

  // 2. Chỉ kích hoạt Service Worker ở môi trường Production (sau khi build deploy)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] ServiceWorker đăng ký thành công với scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker đăng ký chưa hoàn tất:', err);
        });
    });
  }
}
