/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "402b66900e731ca748771b6fc5e7a068"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "15ee6ee8b337ea82d336969a204002b8"
  }, {
    "url": "pwa-512x512.png",
    "revision": "29514fcb6a6eee8e4dcddd3602d65274"
  }, {
    "url": "pwa-192x192.png",
    "revision": "a075728c91b4bb74211333375889362a"
  }, {
    "url": "logo.png",
    "revision": "adef82a1f47a1ea393e683eba461503b"
  }, {
    "url": "logo.jpg",
    "revision": "ac9645ae4ab8acb6aca7996f4a699cf6"
  }, {
    "url": "index.html",
    "revision": "7945b572b3acf3aaef624a8b8037fd89"
  }, {
    "url": "icon.svg",
    "revision": "41de24e17f040bd9c96acfc46e50e2d6"
  }, {
    "url": "favicon.png",
    "revision": "7ff7a968a35b49989c719c2fa81fbaaa"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "596ef25f61e7d99c9236e346a4cdf5d4"
  }, {
    "url": "assets/logo-BKWIMXhz.png",
    "revision": null
  }, {
    "url": "assets/index-Cs7e0HtU.css",
    "revision": null
  }, {
    "url": "assets/index-ByAjFocI.js",
    "revision": null
  }, {
    "url": "assets/aistudio/IMG_20261024_095049_855_cecabf0b.jpg",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "596ef25f61e7d99c9236e346a4cdf5d4"
  }, {
    "url": "favicon.png",
    "revision": "7ff7a968a35b49989c719c2fa81fbaaa"
  }, {
    "url": "logo.png",
    "revision": "adef82a1f47a1ea393e683eba461503b"
  }, {
    "url": "pwa-192x192.png",
    "revision": "a075728c91b4bb74211333375889362a"
  }, {
    "url": "pwa-512x512.png",
    "revision": "29514fcb6a6eee8e4dcddd3602d65274"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "15ee6ee8b337ea82d336969a204002b8"
  }, {
    "url": "manifest.webmanifest",
    "revision": "5bdbda7bdc4585030c1b596fe43570a7"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
