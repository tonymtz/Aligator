/**
 * Aligator
 */

var env = process.env.NODE_ENV || 'dev',
  config = require('./config/config.' + env);

module.exports = config;
