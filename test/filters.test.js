describe("creep.filters", function() {
  function foo() {}

  describe(".register", function() {
    afterEach(function() {
      creep.filters.unregister('foo');
    });

    it("should register a filter and the extensions it handles", function() {
      assert(!creep.filters.get('foo'));
      creep.filters.register('foo', foo);
      assert.equal(creep.filters.get('foo'), foo);
    });
  });

  describe(".unregister", function() {
    beforeEach(function() {
      creep.filters.register('foo', foo);
    });

    afterEach(function() {
      creep.filters.unregister('foo');
    });

    it("should unregister a filter and the extensions it handles", function() {
      assert.equal(creep.filters.get('foo'), foo);
      creep.filters.unregister('foo');
      assert(!creep.filters.get('foo'));
    });
  });

  describe(".get", function() {
    beforeEach(function() {
      creep.filters.register('foo', foo);
    });

    afterEach(function() {
      creep.filters.unregister('foo');
    });

    it("should get a filter by name", function() {
      assert.equal(creep.filters.get('foo'), foo);
    });
  });
});
