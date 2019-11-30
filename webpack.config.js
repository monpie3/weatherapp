const path = require('path');
//const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: "./src/script.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    node: {
        fs: "empty"
    },
    //plugins: [
      //  new Dotenv(),
    //]
}
