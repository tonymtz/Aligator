/**
 * Aligator
 */

var config = module.exports = {};

config.env = 'example';

config.mongo = {};
config.mongo.db = 'aligator-example';
config.mongo.host = 'localhost';
config.mongo.port = '27017';

config.app = {};
config.app.name = 'Aligator Example';
config.app.host = "localhost";
config.app.port = '3000';
config.app.log = true;
