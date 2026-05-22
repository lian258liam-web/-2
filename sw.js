// 📝 كود مخصص ومستقل تماماً لتطبيق الكتابة والتصدير الخاص بك
const CACHE_NAME = 'novels-pro-cache-v1';

// 📂 قائمة الملفات والمكتبات الخاصة بالتصدير والخطوط لتعمل بدون إنترنت 100%
const ASSETS_TO_CACHE = [
  './index.html',
  './',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://fonts.googleapis.com/css2?family=Cairo:wght=400;600;700&family=IBM+Plex+Sans+Arabic:wght=400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js' // مكتبة هامة لضغط وتصدير ملفات الـ Epub والـ Docx
];

// التثبيت وحفظ ملفات تطبيق الكتابة في الكاش فوراً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// تفعيل الكاش وتنظيف المخلفات القديمة الخاصة بهذا التطبيق فقط دون لمس تطبيق راوي
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // يتم مسح الكاش القديم فقط إذا كان يخص هذا المشروع لضمان الأمان
          if (key !== CACHE_NAME && key.startsWith('novels-pro-')) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// تشغيل التطبيق بسرعة البرق وبدون إنترنت من ذاكرة الهاتف
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
