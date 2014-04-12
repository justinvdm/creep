describe("creep.query", function() {
  describe(".filter", function() {
    it("should return the filenames and metadata of matching files", function() {
      return creep
        .query.filter(paths.fixtures('code'), "lang == 'js'")
        .then(function(results) {
          assert.deepEqual(
            results.sort(function(d) {
              return d.filename;
            }),
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
  });

  describe(".filter.filenames", function() {
    it("should return the filenames of matching files", function() {
      return creep
        .query.filter.filenames(paths.fixtures('code'), "lang == 'js'")
        .then(function(results) {
          assert.deepEqual(
            results.sort(),
            [paths.fixtures('code/js/fib/basic.js'),
             paths.fixtures('code/js/fib/memoize.js')]);
        });
    });
  });

  describe(".filter.metadata", function() {
    it("should return the metadata of matching files", function() {
      return creep
        .query.filter.metadata(paths.fixtures('code'), "lang == 'js'")
        .then(function(results) {
          assert.deepEqual(
            results.sort(function(d) {
              return d.name;
            }),
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
