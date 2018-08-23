'use strict';

var url = require('url');

var Bank = require('./BankService');
var log4js = require('../utils/log4js');
var belogger = log4js.getLogger('be');

module.exports.addBank = function addBank (req, res, next) {
  Bank.addBank(req, res, next);
};

module.exports.deleteBank = function deleteBank (req, res, next) {
  Bank.deleteBank(req, res, next);
};

module.exports.findBanksByName = function findBanksByName (req, res, next) {
  Bank.findBanksByName(req, res, next);
};

module.exports.getBankById = function getBankById (req, res, next) {
  belogger.info("getBankById");
  Bank.getBankById(req, res, next);
};

module.exports.getBanks = function getBanks (req, res, next) {
  Bank.getBanks(req, res, next);
};

module.exports.updateBank = function updateBank (req, res, next) {
  Bank.updateBank(req, res, next);
};
