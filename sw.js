// Réseau d'abord : la dernière version s'affiche dès qu'il y a une connexion, le cache ne sert que hors ligne.
const C='orgafood-v2',F=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(n=>{
    const u=new URL(e.request.url);
    if(u.origin===location.origin||u.host.includes('gstatic')||u.host.includes('googleapis')){const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp))}
    return n;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
