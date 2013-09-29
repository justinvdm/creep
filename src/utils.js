require('js-yaml');
var nfs = require('fs');

var fs = require('q-io/fs');
var q = require('q');
var utils = exports;

utils.requireFirst = function(filenames) {
  var i = -1;
  var n = filenames.length;

  while (++i < n) {
    var filename = filenames[i];

    if (nfs.existsSync(filename)) {
      return require(filename);
    }
  }
};

utils.filterPaths = function(dirname, fn) {
  return fs
    .list(dirname)
    .then(function(pathnames) {
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
  return utils.filterPaths(function(pathname) {
    return fs.isFile(pathname);
  });
};

utils.listDirs = function(dirname) {
  return utils.filterPaths(function(pathname) {
    return fs.isDirectory(pathname);
  });
};
