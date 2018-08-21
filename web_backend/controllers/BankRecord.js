'use strict';

var url = require('url');

var BankRecord = require('./BankRecordService');

module.exports.addBankRecord = function addBankRecord (req, res, next) {
  Bank.addBankRecord(req, res, next);
};

module.exports.deleteBankRecordByLcNo = function deleteBankRecordByLcNo (req, res, next) {
  Bank.deleteBankRecordByLcNo(req, res, next);
};

module.exports.getBankRecordByLcNo = function getBankRecordByLcNo (req, res, next) {
  Bank.getBankRecordByLcNo(req, res, next);
};

module.exports.updateBankRecord = function updateBankRecord (req, res, next) {
  Bank.updateBankRecord(req, res, next);
};
