var q = require('q');
var _ = require('lodash');
var vm = require('vm');

var filters = require('./');


filters.register('js', function(query) {
  return function(filename, metadata) {
    var context = _.extend({}, metadata, {
      _: _,
      q: q
    });

    return q()
      .then(function() {
        return vm.runInNewContext(query, context);
      })
      .catch(function(e) {
        // ignore type and reference errors so we can do queries like:
        // `creep "foo.bar.baz == 'qux'"`
        if (e.name == 'TypeError') { return false; }
        if (e.name == 'ReferenceError') { return false; }
        throw e;
      });
  };
});
