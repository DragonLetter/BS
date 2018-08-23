'use strict';

var url = require('url');

var BankRecord = require('./BankRecordService');
var log4js = require('../utils/log4js');
var belogger = log4js.getLogger('be'); 

module.exports.addBankRecord = function addBankRecord (req, res, next) {
  belogger.info("operation for addBankRecord");
  Bank.addBankRecord(req, res, next);
};

module.exports.deleteBankRecordByLcNo = function deleteBankRecordByLcNo (req, res, next) {
  belogger.info("operation for deleteBankRecordByLcNo");
  Bank.deleteBankRecordByLcNo(req, res, next);
};

module.exports.getBankRecordByLcNo = function getBankRecordByLcNo (req, res, next) {
  belogger.info("operation for getBankRecordByLcNo");
  Bank.getBankRecordByLcNo(req, res, next);
};

module.exports.updateBankRecord = function updateBankRecord (req, res, next) {
  belogger.info("operation updateBankRecord");
  Bank.updateBankRecord(req, res, next);
};
