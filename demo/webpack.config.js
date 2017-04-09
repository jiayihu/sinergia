/**
 * Webpack configuration for the demo
 */

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const root = {
  src: path.join(__dirname),
  dest: path.join(__dirname, 'dist/'),
};
const IS_DEV = process.env.NODE_ENV !== 'production';

const devPlugins = [];
const prodPlugins = [
  new CopyWebpackPlugin([
    { from: './index.html', to: 'index.html' },
    { from: './assets', to: 'assets' }
  ]),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
];

module.exports = {
  devServer: IS_DEV ? {
    historyApiFallback: true,
    noInfo: false,
    port: 3000,
  } : {},
  devtool: 'eval',
  entry: root.src,
  output: {
    path: root.dest,
    filename: 'dist/main.js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
    ],
  },
  plugins: IS_DEV ? devPlugins : prodPlugins,
};
