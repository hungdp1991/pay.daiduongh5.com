const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(ico|gif|png|jpg|jpeg|ttf|eot|svg|woff2?)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 50000, // make sure this number is big enough to load your resource, or do not define it at all.
                    }
                }
            },
        ]
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery"
        // }),

        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./*'],
        }),

        new MiniCssExtractPlugin({
            filename: '[name].[hash:5].css',
            chunkFilename: '[id].[hash:5].css'
        }),

        new HtmlWebpackPlugin({
            hash: true,
            template: 'public/index.html',
            favicon: "./public/favicon.ico"
        }),

        new ManifestPlugin()
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
            }),
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            })
        ],
    },
    devtool: false
});
