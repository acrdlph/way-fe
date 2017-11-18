const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const backend = {
  host: 'ecs-eu-dev-1571006243.eu-central-1.elb.amazonaws.com',
  port: 8080
};

module.exports = {
  entry: './src/javascript/index',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{ from: './src/static/' }]),
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      WEBSOCKET_BASE_URL: JSON.stringify('ws://'+backend.host+':'+backend.port+'/messages/'),
      FEATURE_NOTIFICATIONS: true
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
  },
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    contentBase: path.join(__dirname, '../src/static'),
    proxy: {
      '/api': {
        target: backend,
        pathRewrite: {'^/api' : ''},
        secure: false
      }
    }

  },
};
