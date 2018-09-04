'use strict';

var BclcInterface = require('./BclcInterfaceService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.unionChainSaveData = function unionChainSaveData(req, resp, next) {
    Logger.info("unionChainSaveData");
    BclcInterface.unionChainSaveData(req, resp, next);
}