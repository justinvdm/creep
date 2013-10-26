var path = require('path');

describe("utils", function() {
  var utils = require(paths.src('./utils'));

  describe(".filterPaths", function() {
    it("should filter through dir's paths", function(done) {
      utils.filterPaths(paths.fixtures('code'), function(p) {
        return path.basename(p).length === 2;
      })
      .then(function(pathnames) {
        assert.deepEqual(
          pathnames.sort(),
          [paths.fixtures('code/js'),
           paths.fixtures('code/py')]);
      })
      .then(done, done);
    });
  });

  describe(".basePaths", function() {
    it("should resolve a list of paths using the given base", function() {
      assert.deepEqual(
        utils.basePaths(
          paths.fixtures('code/fib'),
          ['basic.js', 'memoize.js']),
        [paths.fixtures('code/fib/basic.js'),
         paths.fixtures('code/fib/memoize.js')]);
    });
  });

  describe(".listFiles", function() {
    it("should list all files in a dir", function(done) {
      utils.listFiles(paths.fixtures('code/js/fib')).then(function(filepaths) {
        assert.deepEqual(
          filepaths.sort(),
          [paths.fixtures('code/js/fib/.creep.json'),
           paths.fixtures('code/js/fib/basic.js'),
           paths.fixtures('code/js/fib/memoize.js')]);
      })
      .then(done, done);
    });
  });

  describe(".listDirs", function() {
    it("should list all dirs in a dir", function(done) {
      utils.listDirs(paths.fixtures('code/')).then(function(dirpaths) {
        assert.deepEqual(
          dirpaths.sort(),
          [paths.fixtures('code/js'),
           paths.fixtures('code/py')]);
      })
      .then(done, done);
    });
  });
});
