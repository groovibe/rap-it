// RAP IT service worker: app shell offline-capable, network-first so updates land immediately.
const C="rapit-shell-v2";
const SHELL=["./","index.html","manifest.webmanifest","fonts/anton.woff2","fonts/barlowc-700.woff2","fonts/barlowc-800.woff2","fonts/marker.woff2","icons/icon-192.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin) return; // YouTube / LRCLIB go straight to network
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
