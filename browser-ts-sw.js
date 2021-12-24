importScripts('https://unpkg.com/typescript@latest/lib/typescriptServices.js')

const handleTs = async (req) => {
    const res = await fetch(req);
    const text = await res.text();
    console.log('Compiling...', req.url)
    const replaced = compile(text);
    console.log('Compiled', req.url)
    let headers = new Headers(res.headers);
    headers.set('Content-Type', 'application/javascript');
    return new Response(replaced, {headers, status: 200, statusText: 'OK'});
    // return new Response(replaced);
}

const compile = (str) => {
    let replaced = 'console.error("Failed to compile ts module")';
    try {
        console.time('Compiling')
        replaced = ts.transpileModule(str, {
            compilerOptions: {
                target: "ES2020",                               
                module: "ES2020",     
            }
        }).outputText;
        console.timeEnd('Compiling')
    } catch (e) {
        console.error(e);
        replaced = 'throw new Error("Failed to compile ts module: ' + e.message + '")'
    }

    return replaced;
}

self.addEventListener('fetch', function(event) {
    //console.log("REQUEST:", event.request.url);
    const url = new URL(event.request.url);
    if (url.pathname.endsWith('.ts')) {
        //console.log('got', event.request.url);
        event.respondWith(handleTs(event.request));
    }
  })