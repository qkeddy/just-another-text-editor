// Caching JS and CSS requires workbox-strategies to be installed.
// To actually respond to requests with a cached response, a strategy called StaleWhileRevalidate will be used
// This strategy will first check the cache for a response, and if it finds one, it will return it.

const { warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");
const { StaleWhileRevalidate } = require("workbox-strategies");


// The precacheAndRoute() method takes an array of URLs to precache. 
// The self._WB_MANIFEST is an array that contains the list of URLs to precache.
precacheAndRoute(self.__WB_MANIFEST);


const pageCache = new CacheFirst({
    cacheName: "page-cache",
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
    ],
});

warmStrategyCache({
    urls: ["/index.html", "/"],
    strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);


// Set up asset cache
registerRoute(
  // Define the callback function that will filter the requests that need to be cached (in this case, JS and CSS files)
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
