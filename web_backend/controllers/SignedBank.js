'use strict';

var url = require('url');

var SignedBank = require('./SignedBankService');

module.exports.addSignedBank = function addSignedBank (req, res, next) {
  SignedBank.addSignedBank(req, res, next);
};

module.exports.deleteSignedBank = function deleteSignedBank (req, res, next) {
  SignedBank.deleteSignedBank(req, res, next);
};

module.exports.getSignedBankById = function getSignedBankById (req, res, next) {
  SignedBank.getSignedBankById(req, res, next);
};

module.exports.getSignedBanks = function getSignedBanks (req, res, next) {
  SignedBank.getSignedBanks(req, res, next);
};

module.exports.updateSignedBank = function updateSignedBank (req, res, next) {
  SignedBank.updateSignedBank(req, res, next);
};

module.exports.getCorpsByBankId = function getCorpsByBankId (req, res, next) {
  SignedBank.getCorpsByBankId(req, res, next);
};
module.exports.signBCAppAudit = function signBCAppAudit (req, res, next) {
  SignedBank.signBCAppAudit(req, res, next);
};
