'use strict';

var url = require('url');

var BankRecord = require('./BankRecordService');

module.exports.addBankRecord = function addBankRecord (req, res, next) {
  Bank.addBankRecord(req, res, next);
};

module.exports.deleteBankRecord = function deleteBankRecord (req, res, next) {
  Bank.deleteBankRecord(req, res, next);
};

module.exports.getBankRecordByAppId = function getBankRecordByAppId (req, res, next) {
  Bank.getBankRecordByAppId(req, res, next);
};

module.exports.updateBankRecord = function updateBankRecord (req, res, next) {
  Bank.updateBankRecord(req, res, next);
};
