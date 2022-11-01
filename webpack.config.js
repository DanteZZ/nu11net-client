const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const pth = (p) => path.resolve(__dirname, p);

console.log(pth("./src/main.ts"));

module.exports = {
  entry: pth("./src/main.ts"),
  mode: "development",
  target: "node",
  output: {
    path: pth("./bin/dist"),
    filename: "bundle-[fullhash].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          optimizeSSR: false,
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "**/*",
          context: pth("src/assets"),
          to: "assets",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: pth("src/html/index.html"),
      filename: "index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    }),
  ],
};
