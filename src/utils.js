var utils = exports;

var yaml = require('js-yaml');
var path = require('path');
var nfs = require('fs');
var fs = require('q-io/fs');
var q = require('q');


utils.load = function(filename) {
  filename = path.resolve(filename);

  var parse = {
    '.json': JSON.parse,
    '.yml': yaml.safeLoad,
    '.yaml': yaml.safeLoad
  }[path.extname(filename)];

  var data = nfs.readFileSync(filename, 'utf8');
  return parse(data);
};


utils.loadFirst = function(filenames) {
  var data;

  filenames.some(function(filename) {
    if (nfs.existsSync(path.resolve(filename))) {
      data = utils.load(filename);
      return true;
    }
  });

  return data;
};


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
