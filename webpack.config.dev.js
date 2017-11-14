const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config) {
  return {
    entry: './src/javascript/index',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build')
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CopyWebpackPlugin([{ from: 'src/static/index.html' }]),
      new ExtractTextPlugin('style.css'),
      new webpack.DefinePlugin({
        WEBSOCKET_BASE_URL: JSON.stringify(config.websocketUrl)
      }),
    ],
    module: {
      rules: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract({
            use: ['css-loader', 'less-loader']
          })
        }
      ]
    }
  };
};
