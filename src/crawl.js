var crawl = exports;

var path = require('path');
var _ = require('lodash');
var q = require('q');

var config = require('./config');
var utils = require('./utils');
var parse = require('./parsers');


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

  return parse.dir(dirname, options).then(function(metadata) {
    options = _.cloneDeep(options || {});
    options.defaults = metadata;

    return q
      .all([
        crawl.each._file(dirname, options, fn),
        crawl.each._dir(dirname, options, fn)])
      .then();
  });
};


crawl.each._file = function(dirname, options, fn) {
  return utils.listFiles(dirname).then(function(filenames) {
    filenames = _.difference(filenames, config.manifests.map(function(m) {
      return path.join(dirname, m);
    }));

    return q.all(filenames.map(function(filename) {
      return crawl.invoke(filename, options, fn);
    }));
  });
};


crawl.each._dir = function(dirname, options, fn) {
  return utils.listDirs(dirname).then(function(dirnames) {
    return q.all(dirnames.map(function(dirname) {
      return crawl.each(dirname, options, fn);
    }));
  });
};


crawl.map = function(dirname, options, fn) {
  var results = [];

  if (arguments.length < 3) {
    fn = options;
    options = {};
  }

  return crawl
    .each(dirname, options, function(filename, metadata) {
      results.push(fn(filename, metadata));
    })
    .then(function() {
      return q.all(results);
    });
};


crawl.all = function(dirname, options) {
  return crawl.map(dirname, options, function(filename, metadata) {
    return {
      filename: filename,
      metadata: metadata
    };
  });
};


crawl.all.metadata = function(dirname, options) {
  return crawl.map(dirname, options, function(filename, metadata) {
    return metadata;
  });
};


crawl.filter = function(dirname, options, fn) {
  var results = [];

  if (arguments.length < 3) {
    fn = options;
    options = {};
  }

  return crawl
    .each(dirname, options, function(filename, metadata) {
      return q(fn(filename, metadata)).then(function(match) {
        if (match) {
          results.push({
            filename: filename,
            metadata: metadata
          });
        }
      });
    })
    .then(function() {
      return q.all(results);
    });
};


crawl.filter.filenames = function(dirname, options, fn) {
  var results = [];

  if (arguments.length < 3) {
    fn = options;
    options = {};
  }

  return crawl
    .each(dirname, options, function(filename, metadata) {
      return q(fn(filename, metadata)).then(function(match) {
        if (match) { results.push(filename); }
      });
    })
    .then(function() {
      return q.all(results);
    });
};


crawl.filter.metadata = function(dirname, options, fn) {
  var results = [];

  if (arguments.length < 3) {
    fn = options;
    options = {};
  }

  return crawl
    .each(dirname, options, function(filename, metadata) {
      return q(fn(filename, metadata)).then(function(match) {
      if (match) { results.push(metadata); }
      });
    })
    .then(function() {
      return q.all(results);
    });
};
