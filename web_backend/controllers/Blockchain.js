'use strict';

var url = require('url');

var Blockchain = require('./BlockchainService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.getConsensusByTransId = function getConsensusByTransId(req, res, next) {
  belogger.info("getConsensusByTransId");
  Blockchain.getConsensusByTransId(req, res, next);
};
