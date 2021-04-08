const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');

// nó ghép với file webpack`webpack.common.js` đã cấu hình cơ bản để sử dụng.
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader'
                }
                ]
            },
            {
                test: /\.(gif|png|jpg|jpeg|ttf|eot|svg|woff2?)$/,
                use: {
                    loader: 'file-loader'
                }
            },
        ]
    },
    watch: true,
    plugins: [
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery"
        // }),
        // HotModuleReplacementPlugin: nó giúp tạo ra server riêng tự động reload khi có bất kỳ thay đổi nào từ các file hệ client của project/
        // new webpack.HotModuleReplacementPlugin({
        //     multiStep: true,
        // }),
        new HtmlWebpackPlugin({
            hash: true,
            template: 'public/index.html',
            favicon: "./public/favicon.ico"
        }),
        new ManifestPlugin()
    ]
})