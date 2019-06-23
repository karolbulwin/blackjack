const CACHE_NAME = 'bj-cache-v2.2.3';
const urlsToCache = [
  '/',
  'index.html',
  'favicon.ico',
  'public/stylesheets/style.css',
  'public/javascripts/main.js',
  'public/javascripts/for-sw.js',
  'public/javascripts/detect-mouse.js',
  'public/images/icons/colors/Clubs.png',
  'public/images/icons/colors/Clubs.svg',
  'public/images/icons/colors/Diamonds.png',
  'public/images/icons/colors/Diamonds.svg',
  'public/images/icons/colors/Hearts.png',
  'public/images/icons/colors/Hearts.svg',
  'public/images/icons/colors/Spades.png',
  'public/images/icons/colors/Spades.svg',
  'https://fonts.googleapis.com/css?family=Roboto+Slab',
  'https://use.fontawesome.com/releases/v5.8.1/css/all.css'
];

self.addEventListener('install', (event) => {
  // Perform install steps
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['bj-cache-v2.2.3'];

  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (res) => {
            // Check if we received a valid response
            if (!res || res.status !== 200 || res.type !== 'basic') {
              return res;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = res.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
