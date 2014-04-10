var creep = exports;

var _ = require('lodash');
var config = require('./config');

require('./parsers/matter');
creep.config = require('./config');
creep.crawl = require('./crawl');
creep.parsers = require('./parsers');
creep.utils = require('./utils');


creep.list = function(query) {
};


creep.link = function(query) {
};


creep.unlink = function(query) {
};


_.each(config.parsers, function(parser, name) {
  creep.parsers.register.exts(name, parser.exts);
});
