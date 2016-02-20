var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cssOptions = 'modules&importLoaders=1&localIdentName=[hash:base64:5]';
var extractOptions = { allChunks: true };

var outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.resolve(__dirname, 'js/index.js'),
  output: {
    path: outputPath,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: outputPath,
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: path.resolve(__dirname, 'js'),
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'js')],
        loader: ExtractTextPlugin.extract(
          `css?minimize&${cssOptions}!postcss`,
          extractOptions
        )
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'html') }]),
    new webpack.NoErrorsPlugin()
  ],
  stats: { colors: true },
  devtool: 'source-map',

  postcss: function() {
    return [
      require('postcss-cssnext')({
        sourcemap: true,
        messages: {
          browser: true,
          console: true
        }
      })
    ];
  }
};
