'use strict';

var BclcInterface = require('./BclcInterfaceService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.unionChainSaveData = function unionChainSaveData(req, resp, next) {
    belogger.info("unionChainSaveData");
    BclcInterface.unionChainSaveData(req, resp, next);
}