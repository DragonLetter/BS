'use strict';

var url = require('url');

var BankRecord = require('./BankRecordService');
var log4js = require('../utils/log4js');
var belogger = log4js.getLogger('be'); 

module.exports.addBankRecord = function addBankRecord (req, res, next) {
  belogger.info("operation for addBankRecord");
  BankRecord.addBankRecord(req, res, next);
};

module.exports.deleteBankRecordByLcNo = function deleteBankRecordByLcNo (req, res, next) {
  belogger.info("operation for deleteBankRecordByLcNo");
  BankRecord.deleteBankRecordByLcNo(req, res, next);
};

module.exports.getBankRecordByLcNo = function getBankRecordByLcNo (req, res, next) {
  belogger.info("operation for getBankRecordByLcNo");
  BankRecord.getBankRecordByLcNo(req, res, next);
};

module.exports.updateBankRecord = function updateBankRecord (req, res, next) {
  belogger.info("operation updateBankRecord");
  BankRecord.updateBankRecord(req, res, next);
};
