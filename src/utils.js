var path = require('path');
var fs = require('q-io/fs');
var q = require('q');

var utils = exports;

utils.basePaths = function(base, children) {
  var i = -1;
  var n = children.length;
  var results = [];

  while (++i < n) {
    results.push(path.resolve(base, children[i]));
  }

  return results;
};

utils.filterPaths = function(dirname, fn) {
  dirname = path.resolve(dirname);

  return fs
    .list(dirname)
    .then(function(pathnames) {
      pathnames = utils.basePaths(dirname, pathnames);

      return q
        .all(pathnames.map(fn))
        .then(function(truths) {
          var i = -1;
          var n = truths.length;
          var results = [];

          while (++i < n) {
            if (truths[i]) {
              results.push(pathnames[i]);
            }
          }

          return results;
        });
    });
};

utils.listFiles = function(dirname) {
  return utils.filterPaths(dirname, function(pathname) {
    return fs.isFile(pathname);
  });
};

utils.listDirs = function(dirname) {
  return utils.filterPaths(dirname, function(pathname) {
    return fs.isDirectory(pathname);
  });
};
