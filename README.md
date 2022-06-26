# crx-load-script-webpack-plugin

This Webpack plugin overrides the default load script mechanism of Webpack runtime. Useful for Chrome Extension developers that are trying to lazyload scripts or using HMR when working with the Webpack dev server and the manifest V3.

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
     * Stop injecting
     * `hot:webpack/hot/dev-server`,
     * `client:webpack-dev-server/client`
     * these two modules to into the injection and background scripts.
     * We'll import it from the content script manually.
     */
    hot: false,
    client: false,
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
      /** 
       * The page of your script extension run on. Set this to fix the CORS issue.
       */
      headers: {
        'Access-Control-Allow-Origin': 'https://web.whatsapp.com',
      },
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
// manifest.json
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

if (module.hot) {
  require('webpack/hot/dev-server');
  // set the query to your dev server's location.
  require('webpack-dev-server/client?hot=true&protocol=ws&hostname=localhost&port=8080');
}
```

