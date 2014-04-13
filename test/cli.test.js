var cli = require(paths.src('cli'));


describe("cli", function() {
  var logs;

  cli.print = function(msg) {
    logs.push(msg);
  };

  beforeEach(function() {
    logs = [];
  });

  describe(".run", function() {
    it("should print out the names of files matching the query", function() {
      return cli.run([
        'node',
        'creep',
        "lang == 'js'",
        paths.fixtures('code/py'),
        paths.fixtures('code/js')
      ]).then(function() {
        assert.deepEqual(logs.sort(), [
          paths.fixtures('code/js/fib/basic.js'),
          paths.fixtures('code/js/fib/memoize.js')
        ]);
      });
    });
  });

  describe(".configure", function() {
    var cwd;
    var config;

    before(function() {
      cwd = process.cwd();
      config = creep.config;
    });

    after(function() {
      process.chdir(cwd);
      creep.config = config;
    });

    it("should override config defaults if a config file is present", function() {
      process.chdir(paths.fixtures('code/py'));
      assert.notDeepEqual(creep.config.parsers.matter.exts, ['.py']);
      cli.configure();
      assert.deepEqual(creep.config.parsers.matter.exts, ['.py']);
    });
  });
});
