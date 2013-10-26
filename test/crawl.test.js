describe("crawl", function() {
  var crawl = require(paths.src('./crawl'));

  describe(".invoke", function() {
    it("should call a function with the file's metadata", function(done) {
      crawl
        .invoke(
          paths.fixtures('code/js/fib/memoize.js'),
          function(filename, metadata) {
            assert.equal(filename, paths.fixtures('code/js/fib/memoize.js'));

            assert.deepEqual(metadata, {
              name: 'fibonnaci sequence using memoization',
              tags: ['memoize']
            });
          })
        .then(done, done);
    });
  });

  describe(".each", function() {
    it("should call a function with the metadata of each child file in the dir",
    function(done) {
      var files = [];

      crawl.each(paths.fixtures('code'), function(filename, metadata) {
        files.push({
          filename: filename,
          metadata: metadata
        });
      })
      .then(function() {
        console.log(JSON.stringify(files.sort(function(d) { return d.filename; })));

        assert.deepEqual(
          files.sort(function(d) { return d.filename; }),
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
      })
      .then(done, done);
    });
  });
});
