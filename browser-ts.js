const newScript = document.createElement("script");
newScript.src = "https://unpkg.com/typescript@4.5.4/lib/typescriptServices.js";
document.body.appendChild(newScript);

function browserTS(url = "./browser-ts-sw.js") {
  if ("serviceWorker" in navigator) {
    const interceptorLoaded = navigator.serviceWorker.controller != null;
    addEventListener("load", function () {
      navigator.serviceWorker.register(url)
        .then(function (registration) {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope,
          );
          if (!interceptorLoaded) {
            //refresh after interceptor was loaded but only if the interceptor was not already loaded.
            window.location = window.location.href;
          }
        }, function (err) { // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        });
    });
  }

  const compile = (str) => {
    let replaced = 'console.error("Failed to compile ts module")';
    try {
      console.time("Compiling");
      replaced = ts.transpileModule(str, {
        compilerOptions: {
          target: "ES2020",
          module: "ES2020",
        },
      }).outputText;
      console.timeEnd("Compiling");
    } catch (e) {
      console.error(e);
      replaced = 'throw new Error("Failed to compile ts module: ' + e.message +
        '")';
    }

    return replaced;
  };

  newScript.addEventListener('load', () => {
    document.querySelectorAll('script[type="application/typescript"]').forEach(
      (script) => {
        const js = compile(script.textContent);
        const newScript = document.createElement("script");
        const textNode = document.createTextNode(
          "/* Typescript\n" + script.textContent + "*/\n" + js,
        );
        newScript.type = "module";
        newScript.appendChild(textNode);

        script.after(newScript);
        script.remove();
      },
    );
  });
}

async function browserTSUnregister() {
  (await navigator.serviceWorker.getRegistrations())[0].unregister();
}
