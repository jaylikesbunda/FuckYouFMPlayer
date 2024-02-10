const cacheName = 'site-static-v1';
const assets = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    // Include other assets like images, stylesheets, and scripts that you want to cache
    'https://code.jquery.com/jquery-3.6.0.min.js',
    'https://code.jquery.com/ui/1.12.1/jquery-ui.js',
    'https://jaylikesbunda.github.io/jplayer/jquery.jplayer.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.1/underscore-min.js',
    // Add URLs for other external assets you use
];

// Install event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching shell assets');
            cache.addAll(assets);
        })
    );
});

// Activate event
self.addEventListener('activate', evt => {
    // Clear old caches
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== cacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});
