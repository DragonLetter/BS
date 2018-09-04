var webpack = require('webpack');
var path = require("path")

var nodeConf = require(path.resolve(__dirname, './config/nodeconf.json'));

module.exports = {
    entry: {
        main: __dirname + '/src/main.js'
        // vendors: ['react','jquery']
    },
    output: {
        // publicPath: 'build/',
        path: __dirname + '/build',
        filename: 'build.js'
    },

    devServer: {
        inline: true,
        contentBase: "./",
        disableHostCheck: true,
        port: nodeConf["Bank"].Port
    },

    module: {
        rules: [
            {
                // edit this for additional asset file types
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=819200'
            },
            {
                test: /\.js$/,
                // excluding some local linked packages.
                // for normal use cases only node_modules is needed.
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                use: [{
                    loader: 'babel-loader',
                    query: {
                        cacheDirectory: true,
                        presets: ['es2015', 'stage-0', 'react'],
                        plugins: ['transform-runtime', ["antd", { "style": "css" }]]
                    }
                }]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?sourceMap'
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass?sourceMap"
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}
