'use strict';

var url = require('url');
var Transaction = require('./CorpTransactionService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.getProcessingTransByCorpId = function getProcessingTransByCorpId(req, res, next) {
  belogger.info("getProcessingTransByCorpId");
  Transaction.getProcessingTransByCorpId(req, res, next);
};

module.exports.getProgressFlowByTransId = function getProgressFlowByTransId(req, res, next) {
  belogger.info("getProgressFlowByTransId");
  Transaction.getProgressFlowByTransId(req, res, next);
};

module.exports.getTransByCorpId = function getTransByCorpId(req, res, next) {
  belogger.info("getTransByCorpId");
  Transaction.getTransByCorpId(req, res, next);
};