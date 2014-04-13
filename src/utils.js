var utils = exports;

var path = require('path');
var fs = require('q-io/fs');
var q = require('q');


utils.filterPaths = function(dirname, fn) {
  return fs
    .list(dirname)
    .then(function(pathnames) {
      pathnames = pathnames.map(function(p) {
        return path.join(dirname, p);
      });

      return q
        .all(pathnames.map(fn))
        .then(function(truths) {
          return pathnames.filter(function(pathname, i) {
            return truths[i];
          });
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
