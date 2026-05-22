// 📝 تم تغيير الاسم هنا ليكون خاصاً بمشروعك الجديد لضمان عدم التداخل مع تطبيق راوي
const CACHE_NAME = 'pro-pen-cache-v1';

// 📂 قائمة الملفات التي سيتم حفظها ليعمل الموقع الجديد بدون إنترنت
const ASSETS_TO_CACHE = [
  './index.html',
  './',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://fonts.googleapis.com/css2?family=Cairo:wght=400;600;700&family=IBM+Plex+Sans+Arabic:wght=400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// التثبيت وحفظ ملفات الموقع الجديد في الكاش فوراً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// تفعيل الكاش الجديد وتنظيف المخلفات القديمة الخاصة بهذا الموقع فقط
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // يتم مسح الكاش فقط إذا كان يخص هذا المشروع لمنع تداخل المواقع
          if (key !== CACHE_NAME && key.startsWith('pro-pen-')) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتيجية التشغيل: يفتح من ذاكرة الهاتف فوراً لتوفير السرعة والعمل بدون إنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; 
      }
      return fetch(event.request);
    })
  );
});
