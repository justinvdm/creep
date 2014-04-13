describe("creep.crawl", function() {
  describe(".invoke", function() {
    it("should call a function with the file's metadata", function() {
      return creep.crawl
        .invoke(
          paths.fixtures('code/js/fib/memoize.js'),
          function(filename, metadata) {
            assert.equal(filename, paths.fixtures('code/js/fib/memoize.js'));

            assert.deepEqual(metadata, {
              name: 'fibonnaci sequence using memoization',
              tags: ['memoize']
            });
          });
    });
  });

  describe(".each", function() {
    it("should call a function with a given file's metadata", function() {
      var results = [];

      return creep.crawl
        .each(paths.fixtures('code/js/fib/basic.js'), function(filename, metadata) {
          results.push({
            filename: filename,
            metadata: metadata
          });
        })
        .then(function() {
          assert.deepEqual(results, [{
            filename: paths.fixtures('code/js/fib/basic.js'),
            metadata: {
              name: 'fibonnaci sequence',
              tags: ['fibonnaci']
            }
          }]);
        });
    });

    it("should call a function with a given dir's metadata", function() {
      var results = [];

      return creep.crawl
        .each(paths.fixtures('code'), function(filename, metadata) {
          results.push({
            filename: filename,
            metadata: metadata
          });
        })
        .then(function() {
          assert.deepEqual(
            results.sort(function(d) { return d.filename; }),
            [{
              filename: paths.fixtures('code/py/fib-gen.py'),
              metadata: {
                name: 'fibonnaci sequence generator',
                type: 'code',
                lang: 'py',
                tags: [
                  'fibonnaci',
                  'generator']
              }
            }, {
              filename: paths.fixtures('code/js/fib/basic.js'),
              metadata: {
                name: 'fibonnaci sequence',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci']
              }
            }, {
              filename: paths.fixtures('code/js/fib/memoize.js'),
              metadata: {
                name: 'fibonnaci sequence using memoization',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci',
                  'memoize']
              }
            }]);
        });
    });
  });

  describe(".map", function() {
    it("should do a map for each child file's metadata", function() {
      return creep.crawl
        .map(paths.fixtures('code'), function(filename, metadata) {
          return metadata.name;
        })
        .then(function(results) {
          assert.deepEqual(
            results.sort(),
            ['fibonnaci sequence',
             'fibonnaci sequence generator',
             'fibonnaci sequence using memoization']);
        });
    });
  });

  describe(".all", function() {
    it("should return all the child files' names and metadata", function() {
      return creep.crawl
        .all(paths.fixtures('code'))
        .then(function(results) {
          assert.deepEqual(
            results.sort(function(d) { return d.filename; }),
            [{
              filename: paths.fixtures('code/py/fib-gen.py'),
              metadata: {
                name: 'fibonnaci sequence generator',
                type: 'code',
                lang: 'py',
                tags: [
                  'fibonnaci',
                  'generator']
              }
            }, {
              filename: paths.fixtures('code/js/fib/basic.js'),
              metadata: {
                name: 'fibonnaci sequence',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci']
              }
            }, {
              filename: paths.fixtures('code/js/fib/memoize.js'),
              metadata: {
                name: 'fibonnaci sequence using memoization',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci',
                  'memoize']
              }
            }]);
        });
    });

    describe(".metadata", function() {
      it("should return all the child files' metadata", function() {
        return creep.crawl
          .all
          .metadata(paths.fixtures('code'))
          .then(function(results) {
            assert.deepEqual(
              results.sort(function(d) { return d.name; }),
              [{
                name: 'fibonnaci sequence generator',
                type: 'code',
                lang: 'py',
                tags: [
                  'fibonnaci',
                  'generator']
              }, {
                name: 'fibonnaci sequence',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci']
              }, {
                name: 'fibonnaci sequence using memoization',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci',
                  'memoize']
              }]);
          });
      });
    });
  });

  describe(".filter", function() {
    it("should filter its child files' names and metadata", function() {
      return creep.crawl
        .filter(paths.fixtures('code'), function(filename, metadata) {
          return metadata.lang == 'js';
        })
        .then(function(results) {
          assert.deepEqual(
            results.sort(function(d) { return d.filename; }),
            [{
              filename: paths.fixtures('code/js/fib/basic.js'),
              metadata: {
                name: 'fibonnaci sequence',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci']
              }
            }, {
              filename: paths.fixtures('code/js/fib/memoize.js'),
              metadata: {
                name: 'fibonnaci sequence using memoization',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci',
                  'memoize']
              }
            }]);
        });
    });

    describe(".filenames", function() {
      it("should filter its child files' names", function() {
        return creep.crawl
          .filter
          .filenames(paths.fixtures('code'), function(filename, metadata) {
            return metadata.lang == 'js';
          })
          .then(function(results) {
            assert.deepEqual(
              results.sort(),
              [paths.fixtures('code/js/fib/basic.js'),
               paths.fixtures('code/js/fib/memoize.js')]);
          });
      });
    });

    describe(".metadata", function() {
      it("should filter its child files' metadata", function() {
        return creep.crawl
          .filter
          .metadata(paths.fixtures('code'), function(filename, metadata) {
            return metadata.lang == 'js';
          })
          .then(function(results) {
            assert.deepEqual(
              results.sort(function(d) { return d.name; }),
              [{
                name: 'fibonnaci sequence',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci']
              }, {
                name: 'fibonnaci sequence using memoization',
                type: 'code',
                lang: 'js',
                tags: [
                  'fibonnaci',
                  'memoize']
              }]);
          });
      });
    });
  });
});
