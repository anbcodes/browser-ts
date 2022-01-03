export default function browserTS(url) {
  if ("serviceWorker" in navigator) {
    const interceptorLoaded = navigator.serviceWorker.controller != null;
    addEventListener("load", function () {
      navigator.serviceWorker.register(url)
        .then(function (registration) {
          if (!interceptorLoaded) {
            // refresh after interceptor was loaded but only if the interceptor was not already loaded.
            window.location = window.location.href;
          }
        }, function (err) { // registration failed :(
          console.error("ServiceWorker registration failed: ", err);
        });
    });
  }
}

export async function browserTSUnregister() {
  (await navigator.serviceWorker.getRegistrations())[0].unregister();
}
