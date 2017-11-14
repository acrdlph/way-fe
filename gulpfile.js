const gulp = require('gulp');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const webpackConfig = require('./webpack.config.dev');

const startDevServer = function(proxy) {
  const compiler = webpack(webpackConfig({
    websocketUrl: 'ws://' + proxy.host + ':' + proxy.port + '/messages/'
  }));
  const config = {
    hot: true,
    open: true,
    contentBase: path.join(__dirname, './src/static'),
    proxy: {
      '/api': {
        target: proxy,
        pathRewrite: {'^/api' : ''},
        secure: false
      }
    }
  };
  new WebpackDevServer(compiler, config).listen(3000, '0.0.0.0');
};

gulp.task('start-local', function () {
  startDevServer({
    host: 'localhost',
    port: 3001
  });
});

gulp.task('start-remote', function () {
  startDevServer({
    host: 'ecs-eu-dev-1571006243.eu-central-1.elb.amazonaws.com',
    port: 8080
  });
});
