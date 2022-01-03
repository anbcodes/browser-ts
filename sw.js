importScripts("https://unpkg.com/typescript@4.5.4/lib/typescriptServices.js");

const handleTs = async (req) => {
  const res = await fetch(req);
  const responseText = await res.text();
  const replaced = compile(responseText, new URL(req.url).pathname);
  const headers = new Headers(res.headers);
  headers.set("Content-Type", "application/javascript");
  return new Response(replaced, { headers, status: 200, statusText: "OK" });
};

const compile = (fileStr, path) => {
  let replaced = 'console.error("Failed to compile ts module")';
  try {
    const output = ts.transpileModule(fileStr, {
      compilerOptions: {
        target: "ES2020",
        module: "ES2020",
        sourceMap: true,
      },
    });
    replaced = output.outputText;
    const sourceMap = JSON.parse(output.sourceMapText);
    sourceMap.file = path;
    sourceMap.sources = [sourceMap.file];
    sourceMap.sourcesContent = [fileStr];
    replaced += "\n//# sourceMappingURL=data:application/json;base64," +
      btoa(JSON.stringify(sourceMap));
  } catch (e) {
    console.error(e);
    replaced = 'throw new Error("Failed to compile ts module: ' + e.message +
      '")';
  }

  return replaced;
};

self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith(".ts")) {
    event.respondWith(handleTs(event.request));
  }
});
