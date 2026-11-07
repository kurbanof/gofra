const C='gofro-v20',F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
// optional files: Vue (next to the page for the Windows package, otherwise from the CDN) and the font; a failure here never breaks the install
const OPT=['vue.global.prod.js','https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js','https://fonts.googleapis.com/css2?family=Onest:wght@400;500;700&display=swap'];
const EXT=['cdn.jsdelivr.net','unpkg.com','cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F).then(()=>Promise.all(OPT.map(u=>fetch(u).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,x)=>{const cp=x.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})};
// own files: network first, but not longer than 3 s (weak signal in the shop): then the saved copy, while the network answer still refreshes it
function own(r){const nav=r.mode==='navigate';
 return new Promise(res=>{let done=false;const give=x=>{if(!done){done=true;res(x)}};
  const saved=()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(nav?caches.match('index.html'):null));
  const t=setTimeout(()=>saved().then(m=>{if(m)give(m)}),3000);
  fetch(r).then(x=>{clearTimeout(t);if(x.ok)put(r,x);give(x)}).catch(()=>{clearTimeout(t);saved().then(m=>give(m||(nav?Response.error():new Response('',{status:504}))))})})}
// libraries and fonts: from the saved copy at once, refreshed in the background
function ext(r){return caches.match(r).then(m=>{const net=fetch(r).then(x=>{if(x.ok||x.type==='opaque')put(r,x);return x});if(m){net.catch(()=>{});return m}return net})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin!==location.origin){if(EXT.includes(u.hostname))e.respondWith(ext(r));return}
 e.respondWith(own(r))});
