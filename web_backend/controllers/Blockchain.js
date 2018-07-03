'use strict';

var url = require('url');

var Blockchain = require('./BlockchainService');

module.exports.getConsensusByTransId = function getConsensusByTransId (req, res, next) {
  Blockchain.getConsensusByTransId(req, res, next);
};
