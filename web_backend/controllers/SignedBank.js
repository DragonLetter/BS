'use strict';

var url = require('url');
var SignedBank = require('./SignedBankService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.addSignedBank = function addSignedBank(req, res, next) {
  belogger.info("addSignedBank");
  SignedBank.addSignedBank(req, res, next);
};

module.exports.deleteSignedBank = function deleteSignedBank(req, res, next) {
  belogger.info("deleteSignedBank");
  SignedBank.deleteSignedBank(req, res, next);
};

module.exports.getSignedBankById = function getSignedBankById(req, res, next) {
  belogger.info("getSignedBankById");
  SignedBank.getSignedBankById(req, res, next);
};

module.exports.getSignedBanks = function getSignedBanks(req, res, next) {
  belogger.info("getSignedBanks");
  SignedBank.getSignedBanks(req, res, next);
};

module.exports.updateSignedBank = function updateSignedBank(req, res, next) {
  belogger.info("updateSignedBank");
  SignedBank.updateSignedBank(req, res, next);
};

module.exports.getCorpsByBankId = function getCorpsByBankId(req, res, next) {
  belogger.info("getCorpsByBankId");
  SignedBank.getCorpsByBankId(req, res, next);
};
module.exports.signBCAppAudit = function signBCAppAudit(req, res, next) {
  belogger.info("signBCAppAudit");
  SignedBank.signBCAppAudit(req, res, next);
};
