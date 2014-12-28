/**
 * Aligator
 */

var Resource = require('../lib/resource'),
  Post = require('../models/post'),
  parse = require('co-body');

var postRes = new Resource('/posts', {
  get: function *(){
    var postsList = yield Post.getAll();
    if (Array.isArray.call(postsList)) {
      postsList = [postsList];
    }
    this.body = {posts: postsList};
  },
  getById: function *(){
    this.body = yield {post: Post.getById(this.params.id)};
  },
  post: function *(){
    var record = yield parse(this);
    this.body = yield {post: Post.create(record)};
  },
  put: function *(){
    var record = yield parse(this);
    this.body = yield Post.update(this.params.id, record);
  },
  delete: function *(){
    this.body = yield Post.destroy(this.params.id);
  }
});

module.exports = function (api){
  postRes.mount(api);
};
