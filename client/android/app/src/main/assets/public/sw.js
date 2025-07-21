const CACHE_NAME = "ajnabicam-v1.0.0";
const OFFLINE_URL = "/";

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
  "/",
  "/manifest.json",
  "/logo.svg",
  "/sounds/join.mp3",
  "/sounds/match.mp3",
  "/sounds/swipe.mp3",
];

// Install event - cache essential files
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching essential files");
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      }),
      // Take control of all clients
      self.clients.claim(),
    ]),
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip socket.io and WebRTC related requests
  if (
    event.request.url.includes("socket.io") ||
    event.request.url.includes("webrtc") ||
    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Try to fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the response for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If network fails and we're requesting the main page, return offline page
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }

          // For other resources, just fail
          return new Response("Offline - Resource not available", {
            status: 408,
            statusText: "Offline",
          });
        });
    }),
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Push notification received");

  const options = {
    body: event.data
      ? event.data.text()
      : "You have a new message on AjnabiCam!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: "ajnabicam-notification",
    vibrate: [200, 100, 200],
    actions: [
      {
        action: "open",
        title: "Open AjnabiCam",
        icon: "/icons/icon-96x96.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/icon-96x96.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("AjnabiCam", options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked");

  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Background sync for when connection is restored
self.addEventListener("sync", (event) => {
  console.log("Background sync triggered");

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Perform any background sync operations here
      console.log("Performing background sync..."),
    );
  }
});

// Handle app updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
