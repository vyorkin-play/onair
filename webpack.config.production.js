var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var base = require('./webpack.config.base');
var cssOptions = 'modules&importLoaders=1&localIdentName=[hash:base64:5]';

module.exports = merge(base, {
  module: {
    loaders: [
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        loader: ExtractTextPlugin.extract(
          `css?minimize&${cssOptions}!postcss`,
          { allChunks: true }
        )
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      compress: {
        screw_ie8: true,
        warnings: false,
        unsafe: true,
        drop_console: true
      }
    }),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'src/index.html') }]),
  ],

  devtool: 'source-map'
});
