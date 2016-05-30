var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: './build.js',
    output: {
        filename: 'screen-roller.js'
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin("screen-roller.css")
    ]
};