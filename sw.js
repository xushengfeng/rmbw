var CACHE_NAME = 'pwa'

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(
            [
                '/', // 这个一定要包含整个目录，不然无法离线浏览
                'asset/icon-192.png',
                'index.html',
                'css/css.css'
            ]
          )).then(() => self.skipWaiting())
    );
});
self.addEventListener('activate', async () => {
    const keys = await caches.keys();
    for(let k of keys){
        if(k !== CACHE_NAME){
            await caches.delete(k);
        }
    }
    await self.clients.claim();
});

self.addEventListener('fetch',async (event) => {
    // 注意，event.request 页面发出的请求
    // 而 caches.match 根据请求匹配本地缓存中有没有相应的资源
    async function getResponse(){
        try {
            if(navigator.onLine){   // onLine 是 true，表示有网
                let response = await fetch(event.request);
                let cache = await caches.open(CACHE_NAME);
                await cache.put(event.request, response.clone());
                return response;
            }else{
                return await caches.match(event.request);
            }
        } catch (error) {
            // 也有可能在请求途中我们网断了，这时候需要判断一下缓存中有没有数据
            let res = await caches.match(event.request);
            if(!res)    return caches.match('/');
            return res;
        }
    }
    event.respondWith(
        getResponse()
    );
});