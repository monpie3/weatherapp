const path = require('path');
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: "./src/script.js",
    mode: "production",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist'),
    },
    node: {
<<<<<<< HEAD
<<<<<<< HEAD
        child_process: 'empty',
        fs: 'empty',
        crypto: 'empty',
        net: 'empty',
        tls: 'empty'
=======
        fs: "empty",
        net: 'empty',
>>>>>>> 4d30010... working on development 122
=======
        child_process: 'empty',
        fs: 'empty',
        crypto: 'empty',
        net: 'empty',
        tls: 'empty'
>>>>>>> 9c561a0... working on development - 18 webpack
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
               'AZURE_MAPS_KEY': JSON.stringify(process.env.AZURE_MAPS_KEY),
               'OPEN_WEATHER_KEY': JSON.stringify(process.env.OPEN_WEATHER_KEY),
            }
          })
    ]
}
