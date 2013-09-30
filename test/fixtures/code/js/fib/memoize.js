// ---
// name: fibonnaci sequence using memoization
// tags:
//   - memoize
// ---

exports.fib = function() {
  var memo = [0, 1];

  return function(n) {
    var result = memo[n];

    return typeof result != 'number'
      ? memo[n] = exports.fib(n - 1) + exports.fib(n - 2)
      : result;
  };
}.call();
