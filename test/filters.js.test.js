describe("creep.filters:js", function() {
  var filter = creep.filters.get('js');

  it("should run the given query", function() {
    var f = filter("foo.bar.baz === 'qux'");
    return f('a.md', {foo: {bar: {baz: 'qux'}}}).then(function(match) {
      assert.strictEqual(match, true);
    });
  });

  it("should return false if `TypeError`s are encountered", function() {
    var f = filter("foo.bar.baz");
    return f('a.md', {foo: {}}).then(function(match) {
      assert.strictEqual(match, false);
    });
  });

  it("should return false if `ReferenceError`s are encountered", function() {
    var f = filter("foo");
    return f('a.md', {}) .then(function(match) {
      assert.strictEqual(match, false);
    });
  });
});
