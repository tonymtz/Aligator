/**
 * Aligator
 */

var monk = require('monk'),
  wrap = require('co-monk'),
  config = require('../config'),
  db = monk(config.mongo.host + '/' + config.mongo.db),
  posts = wrap(db.get('posts'));

module.exports.create = function *(record){
  yield posts.insert(record);
  return record;
};

module.exports.getAll = function *(){
  var list = yield posts.find({});
  return list;
};

module.exports.getById = function *(id){
  var post = yield posts.findOne({_id: id});
  return post;
};

module.exports.update = function *(id, record){
  yield posts.updateById(id, record);
  return record;
};

module.exports.destroy = function *(id){
  yield posts.remove({_id: id});
};
