let CACHE_NAME = 'codePwa-v2';

let urlCache = [
   '/',
    '/@react-refresh',
    '/@vite/client',
    '/article',
    '/home',
    '/manifest.json',
    '/node_modules/.vite/deps/react-dom_client.js?v=831d9976',
    '/node_modules/.vite/deps/react.js?v=831d9976',
    '/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=831d9976',
    '/node_modules/.vite/deps/framer-motion.js?v=679371bd',
    '/src/main.jsx?t=1736458527283',
    '/static/js/main.chunk.js',
    '/static/js/vendors~main.chunk.js',
    '/static/media/logo.6ce24c58.svg',
    '/sw.js',
    '/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    '/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    '/ajax/libs/font-awesome/6.7.1/css/all.min.css',
    '/src/main.jsx',
    '/static/js/bundle.js',
    '/src/Serviceworker.js',
    '/src/index.css',
    '/node_modules/vite/dist/client/env.mjs',
    '/src/App.jsx',
    '/src/App.css',
    '/src/Cpmponents/Layout.jsx',
    '/src/Pages/Dashboard/Employeedashboard.jsx',
    '/src/Pages/Dashboard/Employeedashboard.jsx',
    '/src/Pages/Login/LoginForm.jsx',
    '/src/Pages/Dashboard/Employeedashboard.css',
    '/src/Pages/Login/LoginForm.css',
    '/manifest.json',
    '/dashboard',
    '/Logo192.png',
    '/src/App/Store.jsx',
    '/icon.png',
    '/src/App/Store.jsx',
    '/src/Cpmponents/Layout.jsx',
    '/src/Cpmponents/Navbar/Navbar.jsx',
    '/src/Cpmponents/Navbar/Navbar.css',
    '/src/Cpmponents/Footer/Footer.jsx',
    '/src/Cpmponents/Footer/Footer.css',
    '/src/assets/user.jpg',
    '/src/assets/Zeal_Logo_2.png',
    '/src/assets/Zeal_Logo_2.png?import',
    '/src/assets/fbg.gif',
    '/icon.png',
];

// Install event: Cache critical resources
this.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Cache opened successfully.");
            return cache.addAll(urlCache);
        }).catch((error) => {
            console.error("Failed to open cache:", error);
        })
    );
});

// Fetch event: Serve cached resources or network fallback
this.addEventListener('fetch', (event) => {
    console.log(`Fetching: ${event.request.url}`);
    
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log(`Serving from cache: ${event.request.url}`);
                return cachedResponse;
            }
            
            console.log(`Fetching from network: ${event.request.url}`);
            return fetch(event.request).catch((error) => {
                console.error("Failed to fetch:", error);
                return caches.match('/offline.html'); // Provide an offline page
            });
        }).catch((error) => {
            console.error("Error in fetch event:", error);
            return caches.match('/offline.html'); // Default fallback
        })
    );
});

