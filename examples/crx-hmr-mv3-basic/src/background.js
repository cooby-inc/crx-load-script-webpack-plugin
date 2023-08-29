/**
 * Only import the `loadScript` function in HMR mode.
 */
if (module.hot) {
  require('@cooby/crx-load-script-webpack-plugin/lib/loadScript');
}
