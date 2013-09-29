var q = require('q');
var fs = require('q-io/fs');
var matter = require('matter');

var config = require('../config');
var parsers = require('./');

parsers.register.parser('matter', function(filename, options) {
  options = options || {};
  var format = options.matterFormat || config.matterFormat;
  var parser = matter.parse[format];

  if (!parser) {
    return q.reject(new Error("No parser found for format '" + format + "'"));
  }

  return fs
    .read(filename)
    .then(parser);
});
