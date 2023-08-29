const path = require("path");
const webpack = require("webpack");
const CrxLoadScriptWebpackPlugin = require("@cooby/crx-load-script-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devServer: {
   /**
     * Stop injecting
     * `hot:webpack/hot/dev-server`,
     * `client:webpack-dev-server/client`
     * these two modules to into injection and background scripts.
     * We'll import it from content script manually.
     */
    hot: false,
    client: false,
    /**
     * We need devServer write files to disk,
     * But don't want it reload whole page because of the output file changes.
     */
    static: { watch: false },
    /**
     * The host of the page of your script extension runs on. Should not include `https://` or `http://`.
     * You'll see `[webpack-dev-server] Invalid Host/Origin header` if this is not set.
     */ 
    allowedHosts: ["web.whatsapp.com"],
    devMiddleware: {
      /**
       * Write file to output folder /build, so we can execute it later.
       */
      writeToDisk: true,
    },
  },
  devtool: "inline-source-map",
  entry: {
    background: path.resolve(__dirname, "src", "background.js"),
    content: path.resolve(__dirname, "src", "content.js"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    ...(process.env.WEBPACK_SERVE
      ? [
          new webpack.HotModuleReplacementPlugin(),
          new ReactRefreshWebpackPlugin({
            overlay: false,
          }),
          new CrxLoadScriptWebpackPlugin(),
        ]
      : []),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: () => `${path.join(__dirname, "build")}/[name][ext]`,
          force: true,
          transform(content){
            const contentObject = JSON.parse(content.toString());

            /**
             * Only insert HMR related permissions and resources in HMR mode.
             */
            if (process.env.WEBPACK_SERVE) {
              contentObject.permissions.push('scripting');
              contentObject.host_permissions.push('https://web.whatsapp.com/*');
              contentObject.web_accessible_resources[0].resources.push(
                '*.hot-update.json'
              );
            }

            return Buffer.from(JSON.stringify(contentObject));
          }
        },
      ],
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                process.env.WEBPACK_SERVE &&
                  require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
};
