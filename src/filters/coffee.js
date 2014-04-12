var coffee = require('coffee-script');

var filters = require('./');


filters.register('coffee', function(query) {
  return filters.get('js')(coffee.compile(query, {bare: true}));
});
