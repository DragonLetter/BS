'use strict';

var url = require('url');

var BlockchainStatus = require('./BlockchainStatusService');

module.exports.getLatestBlock = function getLatestBlock(req, res, next) {
    BlockchainStatus.getLatestBlock(req, res, next);
};

module.exports.getBlocks = function getBlocks(req, res, next) {
    BlockchainStatus.getBlocks(req, res, next);
};

module.exports.getTransactions = function getTransactions(req, res, next) {
    BlockchainStatus.getTransactions(req, res, next);
};
module.exports.getAllChannels = function getAllChannels(req, res, next) {
    BlockchainStatus.getAllChannels(req, res, next);
};
