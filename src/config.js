module.exports = {
  matterFormat: 'yaml',

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

  manifests: [
    '.creep.yml',
    '.creep.yaml',
    'creep.yml',
    'creep.yaml',
    '.creep.json',
    'creep.json'
  ]
};
