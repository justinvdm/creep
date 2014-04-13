var creep = require('../../../src');


creep.filters.register('name', function(query) {
  return function(filename, metadata) {
    return metadata.name === query;
  };
});
