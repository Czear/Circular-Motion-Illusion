const path = require('path')
const dashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    mode: 'development',
    entry: './main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    devServer: {
        publicPath: '/',
        watchContentBase: true,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [ 'html-loader', 'pug-html-loader' ],
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ],
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: [ 'babel-loader', 'ts-loader' ],
            },
        ],
    },
    plugins: [ new dashboardPlugin(), new HtmlWebpackPlugin({
        template: './index.pug',
    }),

    ],
    resolve: {
        extensions: [ '.ts', '.js', '.json' ],
    },
}