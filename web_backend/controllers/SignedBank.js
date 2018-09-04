'use strict';

var url = require('url');
var SignedBank = require('./SignedBankService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.addSignedBank = function addSignedBank(req, res, next) {
  Logger.info("addSignedBank");
  SignedBank.addSignedBank2cc(req, res, next);
  //SignedBank.addSignedBank(req, res, next);
};

module.exports.deleteSignedBank = function deleteSignedBank(req, res, next) {
  Logger.info("deleteSignedBank");
  SignedBank.deleteSignedBank(req, res, next);
};

module.exports.getSignedBankById = function getSignedBankById(req, res, next) {
  Logger.info("getSignedBankById");
  SignedBank.getSignedBankById2cc(req, res, next);
};

module.exports.getSignedBanks = function getSignedBanks(req, res, next) {
  Logger.info("getSignedBanks");
  SignedBank.getSignedBanks(req, res, next);
};

module.exports.updateSignedBank = function updateSignedBank(req, res, next) {
  Logger.info("updateSignedBank");
  SignedBank.updateSignedBank(req, res, next);
};

module.exports.getCorpsByBankId = function getCorpsByBankId(req, res, next) {
  Logger.info("getCorpsByBankId");
  SignedBank.getCorpsByBankId2cc(req, res, next);
};
module.exports.signBCAppAudit = function signBCAppAudit(req, res, next) {
  Logger.info("signBCAppAudit");
  SignedBank.signBCAppAudit(req, res, next);
};
