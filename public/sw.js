self.addEventListener("install", () => {
    console.log("Service Worker Installed");
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    console.log("Service Worker Activated");
    return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Simple pass-through for now, as requested.
    // In the future, caching logic can be added here.
});
