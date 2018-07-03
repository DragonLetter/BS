'use strict';

var url = require('url');

var Test = require('./TestService');

module.exports.getAccountBalance = function getAccountBalance (req, res, next) {
  Test.getAccountBalance(req, res, next);
};
module.exports.transfer = function transfer (req, res, next) {
  Test.transfer(req, res, next);
};
