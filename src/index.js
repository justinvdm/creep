var creep = exports;

var _ = require('lodash');
var config = require('./config');

require('./filters/js');
require('./filters/coffee');
require('./parsers/matter');


creep.config = require('./config');
creep.crawl = require('./crawl');
creep.query = require('./query');
creep.filters = require('./filters');
creep.parsers = require('./parsers');
creep.utils = require('./utils');


_.each(config.parsers, function(parser, name) {
  creep.parsers.register.exts(name, parser.exts);
});
