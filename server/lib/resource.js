/**
 * Aligator
 */

var methods = ['get', 'post', 'put', 'delete', 'getById'];

var Resource = function (name, callbacks){
  var self = this;
  this.name = name;
  methods.forEach(function (method){
    self[method] = callbacks[method];
  });
};

Resource.prototype.mount = function (app){
  app.get(this.name, this.get);
  app.get(this.name + '/:id', this.getById);
  app.post(this.name, this.post);
  app.put(this.name + '/:id', this.put);
  app.delete(this.name + '/:id', this.delete);
};

module.exports = Resource;
