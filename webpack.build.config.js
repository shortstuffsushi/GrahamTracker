const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const sourceDir = path.resolve(__dirname, 'src');
const outputDir = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.join(sourceDir, 'index.jsx'),
  output: {
    path: outputDir,
    publicPath: './',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
        include: sourceDir
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        include: sourceDir
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
        include: sourceDir
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
        include: sourceDir
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin(),
    new ExtractTextPlugin('bundle.css'),
    new BabiliPlugin()
  ],
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  }
};
