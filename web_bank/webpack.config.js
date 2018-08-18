var webpack = require('webpack');
var UglifyJsPlugin=require('uglifyjs-webpack-plugin');
var path = require("path")
var nodeConf = require(path.resolve(__dirname, './config/nodeconf.json'));

module.exports = {
    entry: {
        main: './src/main.js'
        //vendors: ['react','jquery']
    },
    output: {
        publicPath: 'build/',
        path: path.resolve(__dirname, './build'),
        filename: 'build.js'
    },

    devServer: {
      inline: true,
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
                //loader: 'babel'
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'es2015', 'react', 'stage-2'],
                    plugins: [ 'transform-decorators-legacy' ]
                    //presets:['es2015']
                }
            },
            {   test: /\.css$/,
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
    // example: if you wish to apply custom babel options
    // instead of using vue-loader's default:
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                babel: {
                    presets: ['es2015', 'stage-0', 'react'],
                    plugins: ['transform-runtime', ["antd",  { "style": "css" }]],
                    //plugins: ["transform-decorators-legacy","transform-class-properties"]
                }
            }
        }),
         new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: false
                }
            })
        ]
    }
}
