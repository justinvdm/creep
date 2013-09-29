var q = require('q');

describe("parsers", function() {
  var parsers = require(paths.src('./parsers'));

  function foo() {
    return {lerp: 'larp'};
  }

  describe(".register", function() {
    afterEach(function() {
      parsers.unregister('foo');
    });

    it("should register a parser and the extensions it handles", function() {
      assert(!parsers.get.byName('foo'));
      assert(!parsers.get.byExt('.foo'));
      assert(!parsers.get.byExt('.bar'));

      parsers.register('foo', ['.foo', '.bar'], foo);

      assert.equal(parsers.get.byName('foo'), foo);
      assert.equal(parsers.get.byExt('.foo'), foo);
      assert.equal(parsers.get.byExt('.bar'), foo);
    });

    describe(".parser", function() {
      it("should register a parser", function() {
        assert(!parsers.get.byName('foo'));
        parsers.register.parser('foo', foo);
        assert.equal(parsers.get.byName('foo'), foo);
      });
    });

    describe(".ext", function() {
      it("should associate an extension to a parser", function() {
        parsers.register.parser('foo', foo);

        assert(!parsers.get.byExt('.foo'));
        parsers.register.ext('foo', '.foo');
        assert.equal(parsers.get.byExt('.foo'), foo);
      });
    });

    describe(".exts", function() {
      it("should associate extensions to a parser", function() {
        parsers.register.parser('foo', foo);

        assert(!parsers.get.byExt('.foo'));
        assert(!parsers.get.byExt('.bar'));

        parsers.register.exts('foo', ['.foo', '.bar']);

        assert.equal(parsers.get.byExt('.foo'), foo);
        assert.equal(parsers.get.byExt('.bar'), foo);
      });
    });
  });

  describe(".unregister", function() {
    beforeEach(function() {
      parsers.register('foo', ['.foo', '.bar'], foo);
    });

    afterEach(function() {
      parsers.unregister('foo');
    });

    it("should unregister a parser and the extensions it handles", function() {
      assert.equal(parsers.get.byName('foo'), foo);
      assert.equal(parsers.get.byExt('.foo'), foo);
      assert.equal(parsers.get.byExt('.bar'), foo);

      parsers.unregister('foo');

      assert(!parsers.get.byName('foo'));
      assert(!parsers.get.byExt('.foo'));
      assert(!parsers.get.byExt('.bar'));
    });

    describe(".parser", function() {
      it("should unregister a parser and the extensions it handles", function() {
        assert.equal(parsers.get.byName('foo'), foo);
        assert.equal(parsers.get.byExt('.foo'), foo);
        assert.equal(parsers.get.byExt('.bar'), foo);

        parsers.unregister.parser('foo');

        assert(!parsers.get.byName('foo'));
        assert(!parsers.get.byExt('.foo'));
        assert(!parsers.get.byExt('.bar'));
      });
    });

    describe(".ext", function() {
      it("should unassociate an extension from a parser", function() {
        assert.equal(parsers.get.byExt('.foo'), foo);
        parsers.unregister.ext('.foo');
        assert(!parsers.get.byExt('.foo'));
      });
    });

    describe(".exts", function() {
      it("should unassociate extensions from a parser", function() {
        assert.equal(parsers.get.byExt('.foo'), foo);
        assert.equal(parsers.get.byExt('.bar'), foo);

        parsers.unregister.exts(['.foo', '.bar']);

        assert(!parsers.get.byExt('.foo'));
        assert(!parsers.get.byExt('.bar'));
      });
    });
  });

  describe(".get", function() {
    beforeEach(function() {
      parsers.register('foo', ['.foo', '.bar'], foo);
    });

    afterEach(function() {
      parsers.unregister('foo');
    });

    it("should get a parser by name", function() {
      assert.equal(parsers.get('foo'), foo);
    });

    describe(".byName", function() {
      it("should get a parser by name", function() {
        assert.equal(parsers.get.byName('foo'), foo);
      });
    });

    describe(".ext", function() {
      it("should get a parser by extension", function() {
        assert.equal(parsers.get.byExt('.foo'), foo);
        assert.equal(parsers.get.byExt('.bar'), foo);
      });
    });

    describe(".byFilename", function() {
      it("should get a parser from the given filename", function() {
        assert.equal(parsers.get.byFilename('luke.foo'), foo);
      });
    });
  });

  describe(".file", function() {
    beforeEach(function() {
      parsers.register('foo', ['.foo', '.bar'], foo);
    });

    afterEach(function() {
      parsers.unregister('foo');
    });

    it("proxy to the parser associated to the given filename", function(done) {
      parsers.file('luke.foo').then(function(metadata) {
        assert.deepEqual(metadata, {lerp: 'larp'});
        done();
      });
    });

    describe("if no parser is found for an extension", function() {
      it("should fall back to a no op parser ", function(done) {
        parsers.file('luke.spam').then(function(metadata) {
          assert.deepEqual(metadata, {});
          done();
        });
      });
    });
  });

  describe(".dir", function() {
    it("should use the first dir metadata file it finds", function(done) {
      var a = parsers.dir(paths.fixtures('a')).then(function(metadata) {
        assert.deepEqual(metadata, {spam: 'ham'});
      });

      var b = parsers.dir(paths.fixtures('b')).then(function(metadata) {
        assert.deepEqual(metadata, {swan: 'lake'});
      });

      q.all([a, b]).done(function() { done(); });
    });
  });

  describe("bundled parsers", function() {
    describe("matter", function() {
      var matter;
      
      beforeEach(function() {
        matter = parsers.get('matter');
      });

      it("should parse and return a file's front matter metadata", function(done) {
        matter(paths.fixtures('a/simple.md'))
          .then(function(metadata) {
            assert.deepEqual(metadata, {
              foo: 'bar',
              baz: 'qux',
              racecar: [
                'lerp',
                'larp',
                'lorem'
              ]
            });
          })
          .done(function() { done(); });
      });

      describe("if no matter parser is found for the requested format", function() {
        it("should errback", function(done) {
          matter('does/not/matter.js', {matterFormat: 'bleh'})
            .catch(function(e) {
              assert.equal(e.message, "No parser found for format 'bleh'");
            })
            .done(function() { done(); });
        });
      });
    });
  });
});
