const path = require('path');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: "/"
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: [/node_modules/]
        }]
    },
    performance: {
        hints: false
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 500000,
            maxSize: 1000000
        }
    }
}