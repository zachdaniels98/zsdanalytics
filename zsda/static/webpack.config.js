const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, "js/index.js")
    },
    mode: "development",
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: { 
                    presets: ["@babel/env"] 
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: path.resolve(__dirname, "dist/"),
        // publicPath: "/dist/",
        filename: "[name].bundle.js"
    }
};