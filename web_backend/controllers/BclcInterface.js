'use strict';

var BclcInterface = require('./BclcInterfaceService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.unionChainSaveData = function unionChainSaveData(req, resp, next) {
    Logger.info("unionChainSaveData");
    BclcInterface.unionChainSaveData(req, resp, next);
}

module.exports.uionChainReadData = function uionChainReadData(req, resp, next) {
    Logger.info("uionChainReadData");
    BclcInterface.uionChainReadData(req, resp, next);
}

module.exports.unionChainReadRootIds = function unionChainReadRootIds(req, resp, next) {
    Logger.info("unionChainReadRootIds");
    BclcInterface.unionChainReadRootIds(req, resp, next);
}

module.exports.unionChainReadStepNo = function unionChainReadStepNo(req, resp, next) {
    Logger.info("unionChainReadStepNo");
    BclcInterface.unionChainReadStepNo(req, resp, next);
}

module.exports.queryTransactionState = function queryTransactionState(req, resp, next) {
    Logger.info("queryTransactionState");
    BclcInterface.queryTransactionState(req, resp, next);
}

module.exports.unionChainReadTxIDs = function unionChainReadTxIDs(req, resp, next) {
    Logger.info("unionChainReadTxIDs");
    BclcInterface.unionChainReadTxIDs(req, resp, next);
}

module.exports.unionChainGetPendingTx = function unionChainGetPendingTx(req, resp, next) {
    Logger.info("unionChainGetPendingTx");
    BclcInterface.unionChainGetPendingTx(req, resp, next);
}

module.exports.unionChainDelPendingTx = function unionChainDelPendingTx(req, resp, next) {
    Logger.info("unionChainDelPendingTx");
    BclcInterface.unionChainDelPendingTx(req, resp, next);
}

module.exports.unionChainSync = function unionChainSync(req, resp, next) {
    Logger.info("unionChainSync");
    BclcInterface.unionChainSync(req, resp, next);
}