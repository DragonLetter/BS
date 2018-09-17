'use strict';

var url = require('url');

var BillRecord = require('./BankAmendRecordService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.addBankAmendRecord = function addBankAmendRecord(req, res, next) {
    Logger.info("operation for addBankAmendRecord");
    BillRecord.addBankAmendRecord(req, res, next);
};

module.exports.getBankAmendRecords = function getBankAmendRecords(req, res, next) {
    Logger.info("operation for getBankAmendRecords");
    BillRecord.getBankAmendRecords(req, res, next);
};

module.exports.updateBankAmendRecord = function updateBankAmendRecord(req, res, next) {
    Logger.info("operation for updateBankAmendRecord");
    BillRecord.updateBankAmendRecord(req, res, next);
};
