const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const pth = (p) => path.resolve(__dirname, p);

console.log(pth("./src/main.ts"));

module.exports = [
    {
        name: "game",
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
                {
                    test: /\.(png|jpe?g|gif|jp2|webp)$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                    },
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
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
    },
    {
        name: "vm",
        mode: "development",
        target: "node",
        entry: "./src/vm/index.ts",
        output: {
            path: pth("./bin/dist/vm"),
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
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: pth("src/vm/index.html"),
                filename: "index.html",
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                },
            }),
        ],
    },
];
