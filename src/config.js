var _ = require('lodash');
var path = require('path');


var config = module.exports = {
  matterFormat: 'yaml',

  query: {
    filter: 'coffee'
  },

  parsers: {
    matter: {
      exts: [
        '.md',
        '.js',
        '.py',
        '.rb',
        '.coffee'
      ]
    },
  },

  files: {
    meta: [
      '.creep.yml',
      '.creep.yaml',
      'creep.yml',
      'creep.yaml',
      '.creep.json',
      'creep.json'
    ],
    rc: [
      '.creeprc.yml',
      '.creeprc.yaml',
      '.creeprc.json',
      path.join(process.env.HOME, '.creeprc.yml'),
      path.join(process.env.HOME, '.creeprc.yaml'),
      path.join(process.env.HOME, '.creeprc.json')
    ]
  }
};


config.files.ignore = _.union(config.files.meta, config.files.rc);
