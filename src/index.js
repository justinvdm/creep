var _ = require('lodash');

var creep = module.exports = require('./api');
var config = require('./config');

require('./parsers/matter');

_.each(config.parsers, function(parser, name) {
  creep.parsers.register.exts(name, parser.exts);
});
