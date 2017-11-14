const gulp = require('gulp');
const filter = require('gulp-filter');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
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


gulp.task('revision', ['append-revision'], function () {
  const outputDir = 'build';
  return gulp.src([outputDir + '/*.html'])
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(revReplace({manifest: gulp.src(outputDir + '/rev-manifest.json')}))
    .pipe(gulp.dest(outputDir));
});

// append revision hash to filename of js and css files
// to not run into caching issues after releasing changes
gulp.task('append-revision', function () {
  const jsAndCssFilter = filter(['*.js', '*.css']);
  const outputDir = 'build';
  return gulp.src(['temp/**'])
      .pipe(gulp.dest(outputDir))
      .pipe(jsAndCssFilter)
      .pipe(rev())
      .pipe(gulp.dest(outputDir))
      .pipe(jsAndCssFilter.restore())
      .pipe(rev.manifest())
      .pipe(gulp.dest(outputDir));
});
