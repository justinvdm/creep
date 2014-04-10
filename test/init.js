var path = require('path');

global.paths = {};
global.paths.base = path.resolve(__dirname, '..');

paths.src = function(p) {
  return path.join(paths.base, 'src', p);
};

paths.fixtures = function(p) {
  return path.join(paths.base, 'test', 'fixtures', p);
};


global.assert = require('assert');
global.creep = require(paths.src('./'));
