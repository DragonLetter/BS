'use strict';

var url = require('url');
var Test = require('./TestService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.getAccountBalance = function getAccountBalance(req, res, next) {
  belogger.info("getAccountBalance");
  Test.getAccountBalance(req, res, next);
};

module.exports.transfer = function transfer(req, res, next) {
  belogger.info("transfer");
  Test.transfer(req, res, next);
};
