var path = require('path');
var webpack = require('webpack');

var outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, 'src'),

  entry: ['./index'],

  output: {
    path: outputPath,
    filename: 'bundle.js',
    publicPath: '/'
  },

  resolve: { extensions: ['', '.js', '.css'] },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({ 'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }}),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ],

  stats: { colors: true },

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
