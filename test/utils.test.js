var path = require('path');

describe("creep.utils", function() {
  describe(".load", function() {
    it("should load .json files", function() {
      assert.deepEqual(
        creep.utils.load(paths.fixtures('code/js/fib/.creep.json')),
        {tags: ['fibonnaci']});
    });

    it("should load .yml files", function() {
      assert.deepEqual(
        creep.utils.load(paths.fixtures('code/.creep.yml')),
        {type: 'code'});
    });

    it("should load .yaml files", function() {
      assert.deepEqual(
        creep.utils.load(paths.fixtures('code/py/.creeprc.yaml')),
        {parsers: {matter: {exts: ['.py']}}});
    });
  });

  describe(".loadFirst", function() {
    it("should load the first file it finds", function() {
      assert.deepEqual(
        creep.utils.loadFirst([
          paths.fixtures('code/foo'),
          paths.fixtures('code/js/fib/.creep.json'),
          paths.fixtures('code/js/.creep.yml')
        ]),
        {tags: ['fibonnaci']});
    });
  });

  describe(".filterPaths", function() {
    it("should filter through dir's paths", function() {
      return creep.utils
        .filterPaths(paths.fixtures('code'), function(p) {
          return path.basename(p).length === 2;
        })
        .then(function(pathnames) {
          assert.deepEqual(
            pathnames.sort(),
            [paths.fixtures('code/js'),
             paths.fixtures('code/py')]);
        });
    });
  });

  describe(".listFiles", function() {
    it("should list all files in a dir", function() {
      return creep.utils
        .listFiles(paths.fixtures('code/js/fib'))
        .then(function(filepaths) {
          assert.deepEqual(
            filepaths.sort(),
            [paths.fixtures('code/js/fib/.creep.json'),
             paths.fixtures('code/js/fib/basic.js'),
             paths.fixtures('code/js/fib/memoize.js')]);
        });
    });
  });

  describe(".listDirs", function() {
    it("should list all dirs in a dir", function() {
      return creep.utils
        .listDirs(paths.fixtures('code/'))
        .then(function(dirpaths) {
          assert.deepEqual(
            dirpaths.sort(),
            [paths.fixtures('code/js'),
             paths.fixtures('code/py')]);
      });
    });
  });
});
