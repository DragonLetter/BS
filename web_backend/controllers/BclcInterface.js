'use strict';

var BclcInterface = require('./BclcInterfaceService');

module.exports.unionChainSaveData = function unionChainSaveData(req, resp, next) {
    BclcInterface.unionChainSaveData(req, resp, next);
}