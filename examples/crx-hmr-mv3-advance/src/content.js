import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'

/**
 * This will change `publicPath` to `chrome-extension://<extension_id>/`.
 * It for runtime to get script chunks from the output folder
 * and for asset modules like file-loader to work.
 */
__webpack_public_path__ = chrome.runtime.getURL('')

if (module.hot) {
  require('webpack/hot/dev-server');
  /**
   * Set WebSocket url to dev-server, instead of the default `${publicPath}/ws`
   */
  require('webpack-dev-server/client?hot=true&protocol=ws&hostname=localhost&port=8080');
}

const div = document.createElement('div')
document.body.append(div)
createRoot(div).render(<App />)
