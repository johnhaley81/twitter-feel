/* eslint-disable */

const express = require('express');
const debugConstructor = require('debug');
const path = require('path');
const webpack = require('webpack');
const compress = require('compression');
const Twit = require('twit');
const webpackConfig = require('../config/webpack.config');
const project = require('../config/project.config');

const debug = debugConstructor('app:server');

const T = new Twit({
  consumer_key: project.globals.__TWITTER_CONSUMER_KEY__,
  consumer_secret: project.globals.__TWITTER_CONSUMER_SECRET__,
  access_token: project.globals.__TWITTER_ACCESS_TOKEN__,
  access_token_secret: project.globals.__TWITTER_ACCESS_TOKEN_SECRET__,
  timeout_ms: 10 * 1000,
});


const app = express();

// Apply gzip compression
app.use(compress());

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
  const compiler = webpack(webpackConfig);

  debug('Enabling webpack dev and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: project.paths.client(),
    hot: true,
    quiet: project.compiler_quiet,
    noInfo: project.compiler_quiet,
    lazy: false,
    stats: project.compiler_stats,
  }));
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
  }));

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(project.paths.public()));

  app.use('/twitter', (req, res, next) => {
    const q = req.query.q;
    T.get('search/tweets', { q, count: 10 })
      .then(({ data: results }) => {
        res.set('content-type', 'application/json');
        res.send(results);
        res.end();
      })
      .catch(err => next(err));
  });

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        next(err);
        return;
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(project.paths.dist()));
}

module.exports = app;
