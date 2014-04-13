#!/usr/bin/env node
var cli = exports;
cli.opts = require('commander');

var _ = require('lodash');
var q = require('q');
var fs = require('fs');
var pkg = require('../package');
var creep = require('./');


cli.opts
  .version(pkg.version)
  .usage('<query> [paths]');


cli.print = function() {
  console.log.apply(null, arguments);
};


cli.configure = function() {
  creep.config.files.rc.some(function(p) {
    if (fs.existsSync(p)) {
      _.extend(creep.config, require(p));
      return true;
    }
  });
};


cli.run = function(args) {
  cli.opts.parse(args);
  cli.opts.query = cli.opts.args[0];
  cli.opts.paths = cli.opts.args[1]
    ? cli.opts.args.slice(1)
    : ['.'];

  return q.all(cli.opts.paths.map(function(p) {
    return creep
      .query.filter.filenames(p, cli.opts.query)
      .then(function(filenames) {
        filenames.forEach(function(filename) {
          cli.print(filename);
        });
      });
  }));
};


if (require.main === module) {
  cli.configure();

  cli.run(process.argv).done(function() {
    process.exit();
  });
}
