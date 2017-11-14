const gulp = require('gulp');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const webpackConfig = require('./webpack.config');

const createDevServerConfig = function(proxy) {
  return {
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
};

gulp.task('start-local', function () {
  const compiler = webpack(webpackConfig);
  const config = createDevServerConfig({
    host: 'localhost',
    port: 3001
  });
  new WebpackDevServer(compiler, config).listen(3000, '0.0.0.0');
});

gulp.task('start-remote', function () {
  const compiler = webpack(webpackConfig);
  const config = createDevServerConfig({
    host: 'ecs-eu-dev-1571006243.eu-central-1.elb.amazonaws.com',
    port: 8080
  });
  new WebpackDevServer(compiler, config).listen(3000, '0.0.0.0');
});
