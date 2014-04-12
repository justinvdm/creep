var filters = exports;
filters.registry = {};


filters.register = function(name, fn) {
  filters.registry[name] = fn;
  return this;
};


filters.unregister = function(name) {
  delete filters.registry[name];
  return this;
};


filters.get = function(name) {
  return filters.registry[name];
};
