/**
 * Aligator
 */

var config = require('./config.global');

config.env = 'dev';

config.app.name = 'Aligator Dev';
config.mongo.db = 'aligator-dev';

module.exports = config;
