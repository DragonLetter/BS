'use strict';

var url = require('url');
var ApplicationService = require('./BankApplicationService');
var BankAmendRecordService = require('./BankAmendRecordService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.applicationAudit = function applicationAudit(req, res, next) {
  Logger.info("applicationAudit");
  ApplicationService.applicationAudit(req, res, next);
};

module.exports.getApplicationById = function getApplicationById(req, res, next) {
  Logger.info("getApplicationById");
  ApplicationService.getApplicationById(req, res, next);
};

module.exports.getAmendState = function getAmendState(req, res, next) {
  Logger.info("getAmendState");
  ApplicationService.getAmendState(req, res, next);
};

module.exports.updateAmendState = function updateAmendState(req, res, next) {
  Logger.info("updateAmendState");
  ApplicationService.updateAmendState(req, res, next);
  BankAmendRecordService.updateAmendStateRecord(req, res, next);
};
