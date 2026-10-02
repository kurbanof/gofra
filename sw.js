const C='gofro-v3',F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
if(u.origin!==location.origin){if(u.hostname==='cdn.jsdelivr.net'){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const cp=x.clone();caches.open(C).then(c=>c.put(r,cp));return x})))}return}
e.respondWith(fetch(r).then(x=>{if(x.ok){const cp=x.clone();caches.open(C).then(c=>c.put(r,cp))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
