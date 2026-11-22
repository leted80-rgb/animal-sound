// 인터넷이 되면 항상 새 판을 받고(받은 것은 저장), 안 되면 저장해 둔 사본으로 연다
const C = "animal-sound-v3";
const CORE = ["./", "index.html", "manifest.json", "icon-180.png", "icon-192.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then((r) => {
    if (r && (r.ok || r.type === "opaque")) { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match("index.html"))));
});
