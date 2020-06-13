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
        child_process: 'empty',
        fs: 'empty',
        crypto: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'AZURE_MAPS_KEY': JSON.stringify(process.env.AZURE_MAPS_KEY),
                'OPEN_WEATHER_KEY': JSON.stringify(process.env.OPEN_WEATHER_KEY),
            }
        })
    ]
    //plugins: [
        //new Dotenv(path.resolve(__dirname, './.env')),
    //]
    //local -> npm run build 
}
