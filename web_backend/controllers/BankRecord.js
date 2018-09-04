'use strict';

var url = require('url');

var BankRecord = require('./BankRecordService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.addBankRecord = function addBankRecord(req, res, next) {
  Logger.info("operation for addBankRecord");
  BankRecord.addBankRecord(req, res, next);
};

module.exports.deleteBankRecordByLcNo = function deleteBankRecordByLcNo(req, res, next) {
  Logger.info("operation for deleteBankRecordByLcNo");
  BankRecord.deleteBankRecordByLcNo(req, res, next);
};

module.exports.getBankRecordByLcNo = function getBankRecordByLcNo(req, res, next) {
  Logger.info("operation for getBankRecordByLcNo");
  BankRecord.getBankRecordByLcNo(req, res, next);
};

module.exports.updateBankRecord = function updateBankRecord(req, res, next) {
  Logger.info("operation updateBankRecord");
  BankRecord.updateBankRecord(req, res, next);
};
