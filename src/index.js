var _ = require('underscore');

var creep = module.exports = require('./api');
var config = require('./config');

require('./parsers/matter');

_(config.parsers).each(function(parser, name) {
  creep.parsers.register.exts(name, parser.exts);
});
