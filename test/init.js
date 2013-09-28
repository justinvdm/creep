var path = require('path');

global.assert = require('assert');

global.paths = {};
global.paths.base = path.resolve(__dirname, '..');

paths.src = function(p) {
  return path.join(paths.base, 'src', p);
};
