/**
 * Webpack configuration for the demo
 */

const path = require('path');
const webpack = require('webpack');

const root = {
  src: path.join(__dirname, 'demo'),
  dest: path.join(__dirname, 'demo-dist/dist/'),
};
const IS_DEV = process.env.NODE_ENV !== 'production';

const devPlugins = [];
const prodPlugins = [
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
    publicPath: 'dist',
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: [/node_modules/],
      }
    ],
  },
  plugins: IS_DEV ? devPlugins : prodPlugins,
};
