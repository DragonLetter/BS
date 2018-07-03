'use strict';

var url = require('url');

var Transaction = require('./CorpTransactionService');

module.exports.getProcessingTransByCorpId = function getProcessingTransByCorpId (req, res, next) {
  Transaction.getProcessingTransByCorpId(req, res, next);
};

module.exports.getProgressFlowByTransId = function getProgressFlowByTransId (req, res, next) {
  Transaction.getProgressFlowByTransId(req, res, next);
};

module.exports.getTransByCorpId = function getTransByCorpId (req, res, next) {
  Transaction.getTransByCorpId(req, res, next);
};