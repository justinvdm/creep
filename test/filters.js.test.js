describe("creep.filters:js", function() {
  var filter = creep.filters.get('js');

  it("should run the given query", function() {
    return filter("foo.bar.baz === 'qux'")('a.md', {foo: {bar: {baz: 'qux'}}})
      .then(function(match) {
        assert.strictEqual(match, true);
      });
  });

  it("should return false if `TypeError`s are encountered", function() {
    filter("foo.bar.baz")('a.md', {foo: {}})
      .then(function(match) {
        assert.strictEqual(match, false);
      });
  });

  it("should return false if `ReferenceError`s are encountered", function() {
    filter("foo")('a.md', {})
      .then(function(match) {
        assert.strictEqual(match, false);
      });
  });
});
