var webpack = require('webpack');
var UglifyJsPlugin=require('uglifyjs-webpack-plugin');
//var server = new webpackDevServer(compiler,{
//disableHostCheck: true
//})
const path = require('path');
module.exports = {
    mode: "development",
    entry: {
        main: './src/index.js'
        //vendors: ['react','jquery']
    },
    output: {
       // path: './public',
        //publicPath: 'public/',
        path: path.resolve(__dirname, 'public'),
        filename: 'index.js'
    },

    devServer: {
      inline: true,
      disableHostCheck: true,
      port: 8000
   },

    module: {
        //loaders: [
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
                test: /\.less$/, loader: 'style-loader!css-loader!less-loader'
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
    },

}
