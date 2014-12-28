/**
 * Aligator
 */

var config = require('./config.global');

config.env = 'dev';

config.app.name = 'Aligator Test';
config.app.port = '1337';
config.app.log = false;
config.mongo.db = 'aligator-test';

module.exports = config;
