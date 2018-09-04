'use strict';

var url = require('url');

var Blockchain = require('./BlockchainService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.getConsensusByTransId = function getConsensusByTransId(req, res, next) {
  Logger.info("getConsensusByTransId");
  Blockchain.getConsensusByTransId(req, res, next);
};
