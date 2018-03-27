const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './dist/bundle.js',
    // path: path.resolve('dist')
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  devServer: {
      // inline: true,
      contentBase: './dist',
      port: 3080,
      // compress: true,
      hot:true
  },
  watch:true,
  mode: 'development',
    module:{
      rules:[
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [require('@babel/plugin-proposal-object-rest-spread')]
            }
          }
        },
        {
          test:/\.css$/,
          use:['style-loader','css-loader']
        },
        {
          test:/\.scss$/,
          use:['style-loader','css-loader','sass-loader']
        },
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000' }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement',
        hash: true,
        filename: './dist/index.html'
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
};
