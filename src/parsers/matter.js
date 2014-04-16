var _ = require('lodash');
var q = require('q');
var util = require('util');
var fs = require('q-io/fs');
var matter = require('matter');

var config = require('../config');
var parsers = require('./');


parsers.register.parser('matter', function(filename, options) {
  options = options || {};
  var format = options.matterFormat || config.matterFormat;
  var parser = matter.parse[format];

  if (!parser) {
    return q.reject(new Error(util.format(
      "No matter parser found for format '%s'", format)));
  }

  return fs
    .read(filename)
    .then(function(data) {
      var result;

      try { result = parser(data); }
      catch(e) {}

      return _.isObject(result)
        ? result
        : {};
    });
});
