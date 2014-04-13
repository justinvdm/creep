var util = require('util');

var cli = require(paths.src('cli'));


describe("cli", function() {
  var logs;

  cli.print = function(msg) {
    logs.push(msg);
  };

  beforeEach(function() {
    logs = [];
  });

  describe("creep", function() {
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
});
