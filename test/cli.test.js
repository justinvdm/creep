var cli = require(paths.src('cli'));


describe("creep.cli", function() {
  var logs;

  cli.print = function(msg) {
    logs.push(msg);
  };

  beforeEach(function() {
    logs = [];
    creep.filters.unregister('name');
  });

  describe(".run", function() {
    var cwd;
    var config;

    cli
      .opts
      .command('test')
      .action(function() {
        cli.opts.emit('done');
      });

    before(function() {
      cwd = process.cwd();
      config = creep.config;
    });

    after(function() {
      process.chdir(cwd);
      creep.config = config;
    });

    it("should override config defaults if a config file exists", function(done) {
      process.chdir(paths.fixtures('code/py'));
      assert.notDeepEqual(creep.config.parsers.matter.exts, ['.py']);

      cli.opts.once('done', function() {
        assert.deepEqual(creep.config.parsers.matter.exts, ['.py']);
        done();
      });

      cli.run(['node', 'creep', 'test']);
    });

    it("should plug in configured plugins", function(done) {
      creep.config.plugins = [paths.fixtures('plugins/name.filter.js')];

      cli.opts.once('done', function() {
        assert(creep.filters.get('name'));
        done();
      });

      cli.run(['node', 'creep', 'test']);
    });
  });

  describe("*", function() {
    it("should print out the names of files matching the query", function(done) {
      cli.run([
        'node',
        'creep',
        "lang == 'js'",
        paths.fixtures('code/py'),
        paths.fixtures('code/js')
      ]);
      
      cli.opts.once('done', function() {
        assert.deepEqual(logs.sort(), [
          paths.fixtures('code/js/fib/basic.js'),
          paths.fixtures('code/js/fib/memoize.js')
        ]);

        done();
      });
    });
  });
});
