'use strict';

const bluebird = require('bluebird'),
  express = require('express'),
  routes = require('./routes'),
  internalBootstrap = require('./bootstrap'),
  render = require('./render'),
  amphoraPlugins = require('./plugins');

bluebird.config({
  longStackTraces: true
});

/**
 * optionally pass in an express app, templating engines, and/or providers
 * note: if no providers are passed in, amphora doesn't protect routes
 * @param {Object}  [options]
 * @param {Array}   [options.providers]
 * @param {Object}  [options.app]
 * @param {Object}  [options.sessionStore]
 * @param {Object}  [options.renderers]
 * @param {Array}   [options.plugins]
 * @param {Array}   [options.env]
 * @param {Boolean} [options.bootstrap]
 * @param {Object}  [options.cacheControl]
 * @returns {Promise}
 */
module.exports = function (options = {}) {
  let {
      app = express(),
      providers = [],
      sessionStore,
      renderers,
      plugins = [],
      env = [],
      cacheControl = {},
      bootstrap = true
    } = options, router;
  // TODO: DOCUMENT RENDERERS, ENV, PLUGINS, AND CACHE CONTROL

  // Init plugins
  if (plugins.length) {
    amphoraPlugins.registerPlugins(plugins);
  }

  // init the router
  router = routes(app, providers, sessionStore, cacheControl);

  // if engines were passed in, send them to the renderer
  if (renderers) {
    render.registerRenderers(renderers);
    render.registerEnv(env);
  }

  // look for bootstraps in components
  return internalBootstrap(bootstrap).then(function () {
    return router;
  });
};
