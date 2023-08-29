# crx-load-script-webpack-plugin

This Webpack plugin overrides the default load script mechanism of Webpack runtime. Useful for Chrome Extension developers that are trying to lazyload scripts or using HMR when working with the Webpack dev server and the manifest V3.

Check out the article on how this plugin was developed: https://medium.com/coobyhq/hot-module-replacement-for-chrome-extension-1096cb480edd

## Getting Started

### Intall plugin

```
npm install @cooby/crx-load-script-webpack-plugin --save-dev
```

or

```
yarn add -D @cooby/crx-load-script-webpack-plugin
```

### Webpack config

Config your webpack, here's an example for Hot Module Replacement and React Refresh to work.

```js
// webpack.config.js

const CrxLoadScriptWebpackPlugin = require('@cooby/crx-load-script-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    /**
     * We need devServer write files to disk,
     * But don't want it reload whole page because of the output file changes.
     */
    static: { watch: false },
    /**
     * Set WebSocket url to dev-server, instead of the default `${publicPath}/ws`
     */
    client: {
      webSocketURL: 'ws://localhost:8080/ws',
    },
    /**
     * The host of the page of your script extension runs on.
     * You'll see `[webpack-dev-server] Invalid Host/Origin header` if this is not set.
     */ 
    allowedHosts: ['web.whatsapp.com'],
    devMiddleware: {
      /**
       * Write file to output folder /build, so we can execute it later.
       */
      writeToDisk: true,
    },
  },
  plugins: [
    /** 
     * Enable HMR related plugins. 
     */
    new webpack.HotModuleReplacementPlugin(),
    new CrxLoadScriptWebpackPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ],
}
```

### Add permission to `manifest.json`

`scripting` and `host_permissions` is for `excuteScript`.
And `*.hot-update.json` should be added to `web_accessible_resources`, it's for runtime to fetch the updated manifest.

Caution: You may not want some of these permissions in produciton build.

```json
{
  "manifest_version": 3,
  "permissions": [
    "scripting"
  ],
  "web_accessible_resources": [
    {
      "resources": [
        "*.hot-update.json",
      ],
      "matches": [
        "https://web.whatsapp.com/*"
      ]
    }
  ],
  "host_permissions": [
    "https://web.whatsapp.com/*"
  ]
}

```

### Import `loadScript` handler from the background script

```js
// background.js
import '@cooby/crx-load-script-webpack-plugin/lib/loadScript'
```

If you haven't a background script yet, you need to add it to webpack entries and manifest.json.

```json
"background": {
  "service_worker": "background.bundle.js"
},

```

### Setup content script

```js
// content.js

/**
 * This will change `publicPath` to `chrome-extension://<extension_id>/`.
 * It for runtime to get script chunks from the output folder
 * and for asset modules like file-loader to work.
 */
__webpack_public_path__ = chrome.runtime.getURL('');
```


## Trouble shooting

After modifying the manifest.json, you must click the reload button from chrome://extensions to reload it. You cannot reload the manifest.json by clicking the reload button of other reload extension extensions. For example, if you run `npm run build` and then run `npm run dev`, the manifest.json is modified by inserting the HMR related permissions. Therefore, you need to click the reload button from chrome://extensions. 

For some reasons HMR may fail and Webpack will attempt to fully reload the page. For example, you modify the content.js instead of app.js's React code. However, this reloading will not bring you the latest update. You need to click the reload button from chrome://extensions, then reload the page. Alternatively, you can click the reload button of other reload extension extensions.
