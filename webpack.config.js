var path = require('path');
var webpack = require('webpack');

module.exports = {
    //入口
    entry: ["whatwg-fetch", "./src/App.jsx"],
    target: 'web',
    //输出目录
    output: {
        filename: 'bundle.js',
        publicPath: '/assets/js/'
    },
    //注入环境变量，可以直接通过process.env.NODE_ENV获取
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev'),
                'HOST_URL': JSON.stringify('http://192.168.1.142:8080/jinshang-server'),
                // 'HOST_URL': JSON.stringify('http://new.jinshang9.com/jinshang-server'),
                // 'HOST_URL': JSON.stringify('http://120.27.226.95/jinshang-server'),
                'IMAGE_PRIFIX': JSON.stringify('http://jinshang-hz.oss-cn-hangzhou.aliyuncs.com/')
            },
        }),
    ],
    //loader配置
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    //第三方js库引用
    externals: {},
    //配置目录结构，添加目录接口import时只需要文件名，不需要目录名。
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
        host: "0.0.0.0",
        port: 8090,
        hot: true,
        quiet: true,
        compress: true,
        disableHostCheck: true,
        historyApiFallback: {
            index: 'index.html'
        }
    }
};