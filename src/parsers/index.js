var parsers = exports;

require('js-yaml');
var util = require('util');
var path = require('path');
var q = require('q');
var _ = require('lodash');
var deepExtend = require('tea-merge');

var utils = require('../utils');
var config = require('../config');


parsers.registry = {};
parsers.registry.byName = {};
parsers.registry.byExt = {};


parsers.register = function(name, exts, parser) {
  parsers.register.parser(name, parser);
  parsers.register.exts(name, exts);
  return this;
};


parsers.register.parser = function(name, parser) {
  if (name in parsers.registry.byName)  {
    throw new Error(util.format("A parser called '%s' already exists", name));
  }

  var data = {};
  data.fn = parser;
  data.exts = [];
  data.name = name;

  parsers.registry.byName[name] = data;
  return this;
};


parsers.register.exts = function(name, exts) {
  if (!(name in parsers.registry.byName))  {
    throw new Error(util.format("A parser called '%s' does not exist", name));
  }

  var parser = parsers.registry.byName[name];
  exts.forEach(function(ext) {
    parsers.registry.byExt[ext] = parser;
    Array.prototype.push.apply(parser.exts, exts);
  });

  return this;
};


parsers.register.ext = function(name, ext) {
  return parsers.register.exts(name, [ext]);
};


parsers.unregister = function(name) {
  var parser = parsers.registry.byName[name];
  delete parsers.registry.byName[name];

  if (parser) {
    parser.exts.forEach(function(ext) {
      delete parsers.registry.byExt[ext];
    });
  }

  return this;
};


parsers.unregister.parser = parsers.unregister;

parsers.unregister.exts = function(exts) {
  exts.forEach(parsers.unregister.ext);
  return this; 
};


parsers.unregister.ext = function(ext) {
  var parser = parsers.registry.byExt[ext];
  delete parsers.registry.byExt[ext];

  if (parser) {
    var i = parser.exts.indexOf(ext);
    if (i > -1) { parser.exts.splice(i, 1); }
  }

  return this;
};


parsers.get = function(name) {
  return (parsers.registry.byName[name] || {}).fn;
};


parsers.get.byName = parsers.get;


parsers.get.byExt = function(ext) {
  return (parsers.registry.byExt[ext] || {}).fn;
};


parsers.get.byFilename = function(filename) {
  return parsers.get.byExt(path.extname(filename));
};


parsers.file = function(filename, options) {
  filename = path.resolve(filename);
  options = options || {};
  var parser = parsers.get.byFilename(filename) || _.constant({});

  return q(parser(filename, options)).then(function(metadata) {
    return deepExtend({}, options.defaults || {}, metadata || {});
  });
};


parsers.dir = function(dirname, options) {
  dirname = path.resolve(dirname);
  options = options || {};
  var metadata = parsers.dir.meta(dirname);
  return q(deepExtend({}, options.defaults || {}, metadata));
};


parsers.dir.meta = function(dirname) {
  var filenames = config.files.meta.map(function(m) {
    return path.join(dirname, m);
  });

  return utils.loadFirst(filenames) || {};
};
