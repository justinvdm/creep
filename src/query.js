var query = module.exports;

var _ = require('lodash');

var crawl = require('./crawl');
var config = require('./config');
var filters = require('./filters');


query.filter = function(dirname, options, qry) {
  return _filter(dirname, options, qry);
};


query.filter.filenames = function(dirname, options, qry) {
  return _filter(dirname, options, qry, 'filenames');
};


query.filter.metadata = function(dirname, options, qry) {
  return _filter(dirname, options, qry, 'metadata');
};


function _filter(dirname, options, qry, type) {
  if (!qry) {
    qry = options;
    options = {};
  }

  options = _.defaults(options || {}, {
    filter: config.query.filter
  });

  var filter = filters.get(options.filter)(qry);
  return type
    ? crawl.filter[type](dirname, options, filter)
    : crawl.filter(dirname, options, filter);
}
