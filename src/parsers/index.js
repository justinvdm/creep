var path = require('path');
var q = require('q');
var _ = require('underscore');

var utils = require('../utils');
var parsers = exports;

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
    throw new Error("A parser called '" + name + "' already exists");
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
    throw new Error("A parser called '" + name + "' does not exist");
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

parsers.nop = function() {
  return {};
};

parsers.file = function(filename, options) {
  options = options || {};
  var parser = parsers.get.byFilename(filename) || parsers.nop;

  return q(parser(filename, options)).then(function(metadata) {
    return _(metadata || {}).defaults(options.defaults || {});
  });
};

parsers.dir = function(dirname, options) {
  options = options || {};

  var metadata = utils.requireFirst([
    path.join(dirname, '.creep.yml'),
    path.join(dirname, '.creep.yaml'),
    path.join(dirname, 'creep.yml'),
    path.join(dirname, 'creep.yaml'),
    path.join(dirname, '.creep.json'),
    path.join(dirname, 'creep.json'),
  ]) || {};

  return q(_(metadata).defaults(options.defaults || {}));
};
