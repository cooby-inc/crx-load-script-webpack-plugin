const path = require("path");
const webpack = require("webpack");
const CrxLoadScriptWebpackPlugin = require("@cooby/crx-load-script-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    /**
     * We need devServer write files to disk,
     * But don't want it reload whole page because of the output file changes.
     */
    static: { watch: false },
    /**
     * Set WebSocket url to dev-server, instead of the default `${publicPath}/ws`
     */
    client: {
      webSocketURL: "ws://localhost:8080/ws",
    },
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
    /** 
     * Enable HMR related plugins. 
     */
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
    new CrxLoadScriptWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: () => `${path.join(__dirname, "build")}/[name][ext]`,
          force: true,
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
              plugins: [require.resolve("react-refresh/babel")],
            },
          },
        ],
      },
    ],
  },
};
