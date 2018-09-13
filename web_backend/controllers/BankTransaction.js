'use strict';

var url = require('url');
var TransactionService = require('./BankTransactionService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

// 获取符合条件的信用证交易列表（包含，历史的，正在进行中的）
module.exports.getTxsByBankId = function getTxsByBankId(req, res, next) {
  Logger.info("getTxsByBankId");
  TransactionService.getTxsByBankId(req, res, next);
};

// 获取指定银行正在进行中的交易列表
module.exports.getProcessingTxByBankId = function getProcessingTxByBankId(req, res, next) {
  Logger.info("getProcessingTxByBankId");
  TransactionService.getProcessingTxByBankId(req, res, next);
};

// 获取指定交易的交易进度信息
module.exports.getProcessFlowByTxId = function getProcessflowByTxId(req, res, next) {
  Logger.info("getProcessFlowByTxId");
  TransactionService.getProcessFlowByTxId(req, res, next);
};

// 获取指定交易(信用证)的草稿信息
module.exports.getLCDraftByTxId = function getLCDraftByTxId(req, res, next) {
  Logger.info("getLCDraftByTxId");
  TransactionService.getLCDraftByTxId(req, res, next);
};

// 获取指定交易的保证金记录
module.exports.getDepositByTxId = function getDepositByTxId(req, res, next) {
  Logger.info("getDepositByTxId");
  TransactionService.getDepositByTxId(req, res, next);
};

// 获取指定交易的保证金信息的电子凭证及附件
module.exports.getDepositDocsByTxId = function getDepositDocsByTxId(req, res, next) {
  Logger.info("getDepositDocsByTxId");
  TransactionService.getDepositDocsByTxId(req, res, next);
};

// 获取指定交易的合同及附件材料
module.exports.getContractsByTxId = function getContractsByTxId(req, res, next) {
  Logger.info("getContractsByTxId");
  TransactionService.getContractsByTxId(req, res, next);
};

// 获取指定交易的信用证，正本附件
module.exports.getLCOriginalByTxId = function getLCOriginalByTxId(req, res, next) {
  Logger.info("getLCOriginalByTxId");
  TransactionService.getLCOriginalByTxId(req, res, next);
};

// 获取指定交易的来单信息
module.exports.getLCDocsReceivedByTxId = function getLCDocsReceivedByTxId(req, res, next) {
  Logger.info("getLCDocsReceivedByTxId");
  TransactionService.getLCDocsReceivedByTxId(req, res, next);
};

// 获取指定交易的承兑信息
module.exports.getLCAcceptPaymentByTxId = function getLCAcceptPaymentByTxId(req, res, next) {
  Logger.info("getLCAcceptPaymentByTxId");
  TransactionService.getLCAcceptPaymentByTxId(req, res, next);
};

// 获取指定交易的闭卷信息
module.exports.getLCClosingByTxId = function getLCClosingByTxId(req, res, next) {
  Logger.info("getLCClosingByTxId");
  TransactionService.getLCClosingByTxId(req, res, next);
};
