var _ = require('underscore');
var q = require('q');

var utils = require('./utils');
var parse = require('./parsers');
var crawl = exports;

crawl.invoke = function(filename, options, fn) {
  if (arguments.length < 3) {
    fn = options;
    options = {};
  }

  return q
    .all([filename, parse.file(filename, options)])
    .spread(fn);
};

crawl.each = function(dirname, options, fn) {
  if (arguments.length < 3) {
    fn = options;
    options = {};
  }

  return q
    .all([
      crawl.each.file(dirname, options, fn),
      crawl.each.dir(dirname, options, fn)])
    .then();
};

crawl.each.file = function(dirname, options, fn) {
  if (arguments.length < 3) {
    fn = options;
    options = {};
  }

  return q
    .all([
      utils.listFiles(dirname),
      parse.dir(dirname, options)])
    .spread(function(filenames, defaults) {
      options.defaults = defaults;

      var i = -1;
      var n = filenames.length;
      var results = [];

      while (++i < n) {
        results.push(crawl.invoke(filenames[i], options, fn));
      }

      return q.all(results);
    });
};

crawl.each.dir = function(dirname, options, fn) {
  if (arguments.length < 3) {
    fn = options;
    options = {};
  }

  return utils.listDirs(dirname).then(function(dirnames) {
    var i = -1;
    var n = dirnames.length;
    var results = [];

    while (++i < n) {
      results.push(crawl.each(dirnames[i], options, fn));
    }

    return q.all(results);
  });
};

crawl.map = function(dirname, options, fn) {
  var results = [];

  crawl
    .each(dirname, options, function(filename, metadata) {
      results.push(fn(filename, metadata));
    })
    .then(function() { return q.all(results); });
};

crawl.all = function(dirname, options, fn) {
  crawl.map(dirname, options, function(filename, metadata) {
    return {
      filename: filename,
      metadata: metadata
    };
  });
};

crawl.all.metadata = function(dirname, options, fn) {
  crawl.map(dirname, options, function(filename, metadata) {
    return metadata;
  });
};

crawl.filter = function(dirname, options, fn) {
  var results = [];

  return crawl
    .each(dirname, options, function(filename, metadata) {
      if (fn(filename, metadata)) {
        results.push({
          filename: filename,
          metadata: metadata
        });
      }
    })
    .then(function() { return q.all(results); });
};

crawl.filter.filenames = function(dirname, options, fn) {
  var results = [];

  return crawl
    .each(dirname, options, function(filename, metadata) {
      if (fn(filename, metadata)) {
        results.push(filename);
      }
    })
    .then(function() { return q.all(results); });
};

crawl.filter.metadata = function(dirname, options, fn) {
  var results = [];

  return crawl
    .each(dirname, options, function(filename, metadata) {
      if (fn(filename, metadata)) {
        results.push(metadata);
      }
    })
    .then(function() { return q.all(results); });
};
