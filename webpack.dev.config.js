const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { spawn } = require('child_process');

const sourceDir = path.resolve(__dirname, 'src');
const outputDir = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.join(sourceDir, 'index.jsx'),
  output: {
    path: outputDir,
    publicPath: '/',
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
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
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
    new HtmlWebpackPlugin()
  ],
  devtool: 'cheap-source-map',
  devServer: {
    contentBase: outputDir,
    stats: {
      colors: true,
      chunks: false,
      children: false
    },
    setup() {
      spawn('electron', [  '.' ], { shell: true, env: { NODE_ENV: 'development' }, stdio: 'inherit' })
      .on('close', code => process.exit(0))
      .on('error', spawnError => console.error(spawnError));
    }
  }
};
