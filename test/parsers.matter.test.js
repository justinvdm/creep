describe("creep.parsers:matter", function() {
  var matter = creep.parsers.get('matter');

  it("should parse and return a file's front matter metadata", function() {
    return matter(paths.fixtures('code/js/fib/memoize.js'))
      .then(function(metadata) {
        assert.deepEqual(metadata, {
          name: 'fibonnaci sequence using memoization',
          tags: ['memoize']
        });
      });
  });

  it("should return an empty object if parse errors are encountered", function() {
    return matter(paths.fixtures('irrelevant.md'))
      .then(function(metadata) {
        assert.deepEqual(metadata, {});
      });
  });

  it("should return an empty object if the parser returns a non-object", function() {
    return matter(paths.fixtures('weird-matter.md'))
      .then(function(metadata) {
        assert.deepEqual(metadata, {});
      });
  });

  describe("if no matter parser is found for the requested format", function() {
    it("should errback", function() {
      return matter('does/not/matter.js', {matterFormat: 'bleh'})
        .catch(function(e) {
          assert.equal(e.message, "No matter parser found for format 'bleh'");
        });
    });
  });
});
