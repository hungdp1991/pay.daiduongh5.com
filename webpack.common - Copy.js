const path = require('path');
const webpack = require('webpack');
var dotenv = require('dotenv');

const common = () => {
    dotenv.config();
    // call dotenv and it will return an Object with a parsed key
    const env = dotenv.config().parsed;

    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return {
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
        },
        node: {
            process: true,
            fs: "empty"
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": envKeys
            })
        ],

    }
}

module.exports = common();