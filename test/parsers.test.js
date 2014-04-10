describe("creep.parsers", function() {
  function foo() {
    return {
      lerp: 'larp',
      tags: [
        'vowels',
        'space',
        'time']
    };
  }

  describe(".register", function() {
    afterEach(function() {
      creep.parsers.unregister('foo');
    });

    it("should register a parser and the extensions it handles", function() {
      assert(!creep.parsers.get.byName('foo'));
      assert(!creep.parsers.get.byExt('.foo'));
      assert(!creep.parsers.get.byExt('.bar'));

      creep.parsers.register('foo', ['.foo', '.bar'], foo);

      assert.equal(creep.parsers.get.byName('foo'), foo);
      assert.equal(creep.parsers.get.byExt('.foo'), foo);
      assert.equal(creep.parsers.get.byExt('.bar'), foo);
    });

    describe(".parser", function() {
      it("should register a parser", function() {
        assert(!creep.parsers.get.byName('foo'));
        creep.parsers.register.parser('foo', foo);
        assert.equal(creep.parsers.get.byName('foo'), foo);
      });
    });

    describe(".ext", function() {
      it("should associate an extension to a parser", function() {
        creep.parsers.register.parser('foo', foo);

        assert(!creep.parsers.get.byExt('.foo'));
        creep.parsers.register.ext('foo', '.foo');
        assert.equal(creep.parsers.get.byExt('.foo'), foo);
      });
    });

    describe(".exts", function() {
      it("should associate extensions to a parser", function() {
        creep.parsers.register.parser('foo', foo);

        assert(!creep.parsers.get.byExt('.foo'));
        assert(!creep.parsers.get.byExt('.bar'));

        creep.parsers.register.exts('foo', ['.foo', '.bar']);

        assert.equal(creep.parsers.get.byExt('.foo'), foo);
        assert.equal(creep.parsers.get.byExt('.bar'), foo);
      });
    });
  });

  describe(".unregister", function() {
    beforeEach(function() {
      creep.parsers.register('foo', ['.foo', '.bar'], foo);
    });

    afterEach(function() {
      creep.parsers.unregister('foo');
    });

    it("should unregister a parser and the extensions it handles", function() {
      assert.equal(creep.parsers.get.byName('foo'), foo);
      assert.equal(creep.parsers.get.byExt('.foo'), foo);
      assert.equal(creep.parsers.get.byExt('.bar'), foo);

      creep.parsers.unregister('foo');

      assert(!creep.parsers.get.byName('foo'));
      assert(!creep.parsers.get.byExt('.foo'));
      assert(!creep.parsers.get.byExt('.bar'));
    });

    describe(".parser", function() {
      it("should unregister a parser and the extensions it handles", function() {
        assert.equal(creep.parsers.get.byName('foo'), foo);
        assert.equal(creep.parsers.get.byExt('.foo'), foo);
        assert.equal(creep.parsers.get.byExt('.bar'), foo);

        creep.parsers.unregister.parser('foo');

        assert(!creep.parsers.get.byName('foo'));
        assert(!creep.parsers.get.byExt('.foo'));
        assert(!creep.parsers.get.byExt('.bar'));
      });
    });

    describe(".ext", function() {
      it("should unassociate an extension from a parser", function() {
        assert.equal(creep.parsers.get.byExt('.foo'), foo);
        creep.parsers.unregister.ext('.foo');
        assert(!creep.parsers.get.byExt('.foo'));
      });
    });

    describe(".exts", function() {
      it("should unassociate extensions from a parser", function() {
        assert.equal(creep.parsers.get.byExt('.foo'), foo);
        assert.equal(creep.parsers.get.byExt('.bar'), foo);

        creep.parsers.unregister.exts(['.foo', '.bar']);

        assert(!creep.parsers.get.byExt('.foo'));
        assert(!creep.parsers.get.byExt('.bar'));
      });
    });
  });

  describe(".get", function() {
    beforeEach(function() {
      creep.parsers.register('foo', ['.foo', '.bar'], foo);
    });

    afterEach(function() {
      creep.parsers.unregister('foo');
    });

    it("should get a parser by name", function() {
      assert.equal(creep.parsers.get('foo'), foo);
    });

    describe(".byName", function() {
      it("should get a parser by name", function() {
        assert.equal(creep.parsers.get.byName('foo'), foo);
      });
    });

    describe(".ext", function() {
      it("should get a parser by extension", function() {
        assert.equal(creep.parsers.get.byExt('.foo'), foo);
        assert.equal(creep.parsers.get.byExt('.bar'), foo);
      });
    });

    describe(".byFilename", function() {
      it("should get a parser from the given filename", function() {
        assert.equal(creep.parsers.get.byFilename('luke.foo'), foo);
      });
    });
  });

  describe(".file", function() {
    beforeEach(function() {
      creep.parsers.register('foo', ['.foo', '.bar'], foo);
    });

    afterEach(function() {
      creep.parsers.unregister('foo');
    });

    it("proxy to the parser associated to the given filename", function(done) {
      creep.parsers.file('luke.foo')
        .then(function(metadata) {
          assert.deepEqual(
            metadata,
            {
              lerp: 'larp',
              tags: [
                'vowels',
                'space',
                'time']
            });
        })
        .then(done, done);
    });

    it("should deep merge defaults", function(done) {
      creep.parsers
        .file(paths.fixtures('luke.foo'), {
          defaults: {
            foo: 'bar',
            lerp: 'lorem',
            tags: ['stuff']
          }
        })
        .then(function(metadata) {
          assert.deepEqual(
            metadata,
            {
              foo: 'bar',
              lerp: 'larp',
              tags: [
                'stuff',
                'vowels',
                'space',
                'time']
            });
        })
        .then(done, done);
    });

    describe("if no parser is found for an extension", function() {
      it("should fall back to a no op parser ", function(done) {
        creep.parsers.file('luke.spam')
          .then(function(metadata) {
            assert.deepEqual(metadata, {});
          })
          .then(done, done);
      });
    });
  });

  describe(".dir", function() {
    it("should parse the dir's metadata from a manifest", function(done) {
      creep.parsers.dir(paths.fixtures('code/js/fib')).then(function(metadata) {
        assert.deepEqual(metadata, {tags: ['fibonnaci']});
      })
      .then(done, done);
    });

    it("should deep merge defaults", function(done) {
      creep.parsers
        .dir(paths.fixtures('code/js/fib'), {
          defaults: {
            foo: 'bar',
            tags: ['stuff']
          }
        })
        .then(function(metadata) {
          assert.deepEqual(
            metadata,
            {
              foo: 'bar',
              tags: [
                'stuff',
                'fibonnaci']
            });
        })
        .then(done, done);
    });

    describe(".manifest", function() {
      it("should require the first manifest it finds in the dir", function() {
        assert.deepEqual(
          creep.parsers.dir.manifest(paths.fixtures('code')),
          {type: 'code'});

        assert.deepEqual(
          creep.parsers.dir.manifest(paths.fixtures('code/js')),
          {lang: 'js'});

        assert.deepEqual(
          creep.parsers.dir.manifest(paths.fixtures('code/js/fib')),
          {tags: ['fibonnaci']});

        assert.deepEqual(
          creep.parsers.dir.manifest(paths.fixtures('i/do/not/exist')),
          {});
      });
    });
  });

  describe("bundled creep.parsers", function() {
    describe("matter", function() {
      var matter;
      
      beforeEach(function() {
        matter = creep.parsers.get('matter');
      });

      it("should parse and return a file's front matter metadata", function(done) {
        matter(paths.fixtures('code/js/fib/memoize.js'))
          .then(function(metadata) {
            assert.deepEqual(metadata, {
              name: 'fibonnaci sequence using memoization',
              tags: ['memoize']
            });
          })
          .then(done, done);
      });

      describe("if no matter parser is found for the requested format", function() {
        it("should errback", function(done) {
          matter('does/not/matter.js', {matterFormat: 'bleh'})
            .catch(function(e) {
              assert.equal(e.message, "No parser found for format 'bleh'");
            })
            .then(done, done);
        });
      });
    });
  });
});
