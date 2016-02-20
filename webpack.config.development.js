var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var base = require('./webpack.config.base');

var cssOptions = 'modules&importLoaders=1&localIdentName=[name]-[local]--[hash:base64:5]';

module.exports = merge(base, {
  entry: ['webpack-hot-middleware/client'],
  module: {
    loaders: [
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        loaders: [
          'style',
          `css?${cssOptions}`,
          'postcss'
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  devtool: 'cheap-module-eval-source-map'
});
