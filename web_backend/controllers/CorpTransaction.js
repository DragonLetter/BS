'use strict';

var Transaction = require('./CorpTransactionService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.getProcessingTransByCorpId = function getProcessingTransByCorpId(req, res, next) {
  Logger.info("getProcessingTransByCorpId");
  Transaction.getProcessingTransByCorpId(req, res, next);
};

module.exports.getProgressFlowByTransId = function getProgressFlowByTransId(req, res, next) {
  Logger.info("getProgressFlowByTransId");
  Transaction.getProgressFlowByTransId(req, res, next);
};

module.exports.getTransByCorpId = function getTransByCorpId(req, res, next) {
  Logger.info("getTransByCorpId");
  Transaction.getTransByCorpId(req, res, next);
};