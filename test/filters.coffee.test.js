describe("creep.filters:coffee", function() {
  var filter = creep.filters.get('coffee');

  it("should run the given query", function() {
    return filter("'baz' in foo.bar")('a.md', {foo: {bar: ['baz', 'qux']}})
      .then(function(match) {
        assert.strictEqual(match, true);
      });
  });
});
