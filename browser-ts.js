function BrowserTS(url = "./browser-ts-sw.js") {
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
} 
