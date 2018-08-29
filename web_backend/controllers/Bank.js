'use strict';

var url = require('url');

var Bank = require('./BankService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.addBank = function addBank(req, res, next) {
  belogger.info("addBank");
  Bank.addBank(req, res, next);
};

module.exports.deleteBank = function deleteBank(req, res, next) {
  belogger.info("deleteBank");
  Bank.deleteBank(req, res, next);
};

module.exports.findBanksByName = function findBanksByName(req, res, next) {
  belogger.info("findBanksByName");
  Bank.findBanksByName(req, res, next);
};

module.exports.getBankById = function getBankById(req, res, next) {
  belogger.info("getBankById");
  Bank.getBankById(req, res, next);
};

module.exports.getBanks = function getBanks(req, res, next) {
  belogger.info("getBanks");
  Bank.getBanks(req, res, next);
};

module.exports.updateBank = function updateBank(req, res, next) {
  belogger.info("updateBank");
  Bank.updateBank(req, res, next);
};
