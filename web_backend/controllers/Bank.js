'use strict';

var url = require('url');

var Bank = require('./BankService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.addBank = function addBank(req, res, next) {
  Logger.info("addBank");
//  Bank.addBank(req, res, next);
  Bank.addBank2cc(req, res, next);
};

module.exports.deleteBank = function deleteBank(req, res, next) {
  Logger.info("deleteBank");
  Bank.deleteBank(req, res, next);
};

module.exports.findBanksByName = function findBanksByName(req, res, next) {
  Logger.info("findBanksByName");
  Bank.findBanksByName(req, res, next);
};

module.exports.getBankById = function getBankById(req, res, next) {
  Logger.info("getBankById");
  Bank.getBankById(req, res, next);
};

module.exports.getBanks = function getBanks(req, res, next) {
  Logger.info("getBanks");
  Bank.getBanks(req, res, next);
};

module.exports.updateBank = function updateBank(req, res, next) {
  Logger.info("updateBank");
  Bank.updateBank(req, res, next);
};
