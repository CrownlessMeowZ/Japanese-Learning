/**
 * Đăng ký Service Worker cho Nihongo Master PWA
 * Giúp ứng dụng hoạt động 100% Offline và có thể cài đặt về màn hình chính
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] ServiceWorker đăng ký thành công với scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker đăng ký chưa hoàn tất (bình thường ở môi trường local):', err);
        });
    });
  }
}
