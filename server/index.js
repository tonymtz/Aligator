/**
 * Aligator
 */

var koa = require('koa'),
  mount = require('koa-mount'),
  Router = require('koa-router'),
  json = require('./lib/json'),
  config = require('./config'),

/* Create koa app */
  app = module.exports = koa(),
  api = new Router();

/* Habemus fancy colors :) */
require('colors'); // This guy extends String prototype

/* Middlewares */
if (config.app.log) {
  app.use(require('koa-logger')());
}
app.use(json());
app.use(mount('/api', api.middleware()));

/* Resources */
// TODO - Automatize resources loading
require('./resources/posts')(api);
// Test route
api.get('/test', function *(){
  this.body = "Hello, World";
});

/* Create Server */
app.listen(config.app.port, function (){
  console.log('###################################'.green);
  console.log('##'.green, '[ [   '.cyan.bold, 'A L I G A T O R'.random.bold, '   ] ]'.cyan.bold, '##'.green);
  console.log('###################################\n'.green);
  console.log(config.app.name.magenta.bold, 'is listening on port'.yellow, config.app.port.red.bold);
  console.log('Follow me'.cyan, '@_tonymtz'.white);
  console.log('\x1b[0m\n');
});
