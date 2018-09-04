'use strict';

var url = require('url');
var BlockchainStatus = require('./BlockchainStatusService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.getLatestBlock = function getLatestBlock(req, res, next) {
    Logger.info("getLatestBlock");
    BlockchainStatus.getLatestBlock(req, res, next);
};

module.exports.getBlocks = function getBlocks(req, res, next) {
    Logger.info("getBlocks");
    BlockchainStatus.getBlocks(req, res, next);
};

module.exports.getTransactions = function getTransactions(req, res, next) {
    Logger.info("getTransactions");
    BlockchainStatus.getTransactions(req, res, next);
};

module.exports.getAllChannels = function getAllChannels(req, res, next) {
    Logger.info("getAllChannels");
    BlockchainStatus.getAllChannels(req, res, next);
};
