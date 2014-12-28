/**
 * Aligator
 */

var app = require('../index'),
  request = require('co-supertest').agent(app.listen()),
  expect = require('chai').expect,
  monk = require('monk'),
  config = require('../config'),
  db = monk(config.mongo.host + '/' + config.mongo.db);

after(function (){
  db.close();
});

/* Dummy Test */
describe('/api/test', function (){
  it('should return Hello, World', function *(){
    var res = yield request.get('/api/test').expect(200).end();
    expect(res.text).to.equal('Hello, World');
  });
});

describe('/api/posts', function (){
  var posts = {};

  beforeEach(function (done){
    posts = db.get('posts');
    done();
  });

  afterEach(function (done){
    posts.drop();
    done();
  });

  describe('GET', function (){
    it('when #db does not have data should return an empty array', function *(){
      var res = yield request.get('/api/posts').expect(200).end();
      expect(res.body.data.posts).to.empty;
    });

    describe('when #db do have data', function (){
      beforeEach(function (){
        posts.insert([
          {title: 'Toxicity', author: 'System Of A Down'},
          {title: 'Alone At Sea', author: 'The Pineapple Thief'}
        ]);
      });

      it('should return array with #db data', function *(){
        var res = yield request.get('/api/posts').expect(200).end(),
          posts = res.body.data.posts;
        expect(posts).to.have.length(2);
        expect(posts[0].title).to.equal('Toxicity');
        expect(posts[0].author).to.equal('System Of A Down');
        expect(posts[1].title).to.equal('Alone At Sea');
        expect(posts[1].author).to.equal('The Pineapple Thief');
      });

      it('should return the correct object if #id is given', function *(){
        var id = (yield posts.findOne({author: 'System Of A Down'}))._id,
          res = yield request.get('/api/posts/' + id).expect(200).end(),
          post = res.body.data.post;
        expect(post.title).to.equal('Toxicity');
        expect(post.author).to.equal('System Of A Down');
      });
    });
  });

  describe('POST', function (){
    it('should save received object on #db', function *(){
      yield request.post('/api/posts').send({
        title: 'The Depth of Self-Delusion',
        author: 'Riverside',
        year: 2013,
        content: 'I could be foreign forever'
      }).expect(200).end();

      var post = yield posts.findOne({author: 'Riverside'});
      expect(post.title).to.equal('The Depth of Self-Delusion');
      expect(post.year).to.equal(2013);
      expect(post.content).to.equal('I could be foreign forever');
    });

    it('should return saved object', function *(){
      var res = yield request.post('/api/posts').send({
        title: 'Bloodline',
        author: 'Slayer',
        year: 2001
      }).expect(200).end();
      expect(res.body.data.post.title).to.equal('Bloodline');
      expect(res.body.data.post.author).to.equal('Slayer');
      expect(res.body.data.post.year).to.equal(2001);
    });
  });

  describe('PUT', function (){
    it('should update an object on #db that matches with given id', function *(){
      posts.insert([
        {title: 'Fall On Pieces', author: 'Velvet Revolver', album: 'Contraband'},
        {title: 'Kuraman', author: 'Soen'}
      ]);

      var id = (yield posts.findOne({author: 'Velvet Revolver'}))._id,
        post;

      yield request.put('/api/posts/' + id).send({
        title: 'Fall To Pieces',
        author: 'Velvet Revolver',
        year: 2004,
        content: 'It\'s been a long year'
      }).expect(200).end();

      post = yield posts.findOne({author: 'Velvet Revolver'});
      expect(post.title).to.equal('Fall To Pieces');
      expect(post.year).to.equal(2004);
      expect(post.content).to.equal('It\'s been a long year');
      expect(post.album).to.be.undefined;

      post = yield posts.findOne({author: 'Soen'});
      expect(post.title).to.equal('Kuraman');
      expect(post.year).to.be.undefined;
      expect(post.content).to.be.undefined;
      expect(post.album).to.be.undefined;
    });

    it('should return saved object', function *(){
      var res = yield request.post('/api/posts').send({
        title: 'Bloodline',
        author: 'Slayer',
        year: 2001
      }).expect(200).end();
      expect(res.body.data.post.title).to.equal('Bloodline');
      expect(res.body.data.post.author).to.equal('Slayer');
      expect(res.body.data.post.year).to.equal(2001);
    });
  });

  describe('DELETE', function (){
    beforeEach(function (){
      posts.insert([
        {title: 'Storm', author: 'Devin Townsend Band'},
        {title: 'Cold Afterall', author: 'Nosound'}
      ]);
    });

    it('should delete from #db the object that matches with given id', function *(){
      var id = (yield posts.findOne({author: 'Nosound'}))._id,
        postList;

      yield request.delete('/api/posts/' + id).expect(204).end();

      postList = yield posts.find({author: 'Nosound'});
      expect(postList).to.be.empty();
      postList = yield posts.find({title: 'Cold Afterall'});
      expect(postList).to.be.empty();
      postList = yield posts.find({title: 'Storm'});
      expect(postList).to.have.length(1);
    });

    it('should return no response', function *(){
      var id = (yield posts.findOne({author: 'Nosound'}))._id,
        res = yield request.delete('/api/posts/' + id).expect(204).end();
      expect(res.body).to.be.empty();
    });
  });
});
