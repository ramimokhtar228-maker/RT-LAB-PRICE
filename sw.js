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
    "revision": "ab6e73f83eedeb56a8e87256ad7dfe1e"
  }, {
    "url": "pwa-512x512.png",
    "revision": "fcc102dff688af3b89202a3c25fc947e"
  }, {
    "url": "pwa-192x192.png",
    "revision": "7deb6704af991661fcb88a333c4adc5c"
  }, {
    "url": "index.html",
    "revision": "39d662e67f5727516cbdc0e58cf0f97b"
  }, {
    "url": "icon.svg",
    "revision": "41de24e17f040bd9c96acfc46e50e2d6"
  }, {
    "url": "favicon.png",
    "revision": "844a4551764233e977a0ee78c0a5f0cf"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5e6c065a7b76fbea4f65ff63cffa2263"
  }, {
    "url": "assets/index-VGodE4Ph.js",
    "revision": null
  }, {
    "url": "assets/index-8etMiASx.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5e6c065a7b76fbea4f65ff63cffa2263"
  }, {
    "url": "favicon.png",
    "revision": "844a4551764233e977a0ee78c0a5f0cf"
  }, {
    "url": "icon.svg",
    "revision": "41de24e17f040bd9c96acfc46e50e2d6"
  }, {
    "url": "pwa-192x192.png",
    "revision": "7deb6704af991661fcb88a333c4adc5c"
  }, {
    "url": "pwa-512x512.png",
    "revision": "fcc102dff688af3b89202a3c25fc947e"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "ab6e73f83eedeb56a8e87256ad7dfe1e"
  }, {
    "url": "manifest.webmanifest",
    "revision": "e287b69a69197718ea1d5d33e78d5679"
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
