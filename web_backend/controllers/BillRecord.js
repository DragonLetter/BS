'use strict';

var url = require('url');

var BillRecord = require('./BillRecordService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.getBillState = function getBillState(req, res, next) {
  Logger.info("operation for getBillState");
  BillRecord.getBillState(req, res, next);
};
module.exports.updateBillState = function updateBillState(req, res, next) {
  Logger.info("operation for updateBillState");
  BillRecord.updateBillState(req, res, next);
  BillRecord.addBillStateRecord(req, res, next);
};

module.exports.addBillRecord = function addBillRecord(req, res, next) {
  Logger.info("operation for addBillRecord");
  BillRecord.addBillRecord(req, res, next);
};
module.exports.getBillRecords = function getBillRecords(req, res, next) {
  Logger.info("operation for getBillRecords");
  BillRecord.getBillRecords(req, res, next);
};
module.exports.updateBillRecord = function updateBillRecord(req, res, next) {
  Logger.info("operation for updateBillRecord");
  BillRecord.updateBillRecord(req, res, next);
};
