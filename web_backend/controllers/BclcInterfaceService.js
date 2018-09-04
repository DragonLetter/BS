'use strict';

var fabric = require("../fabric");
var bclcApi = require("../bclc/BclcApi");
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

exports.unionChainSaveData = function (req, resp, next) {
    var args = req.swagger.params;
    var id = args.appId.value.toString();

    Logger.debug("args:" + args);

    fabric.query(req, "getLcByNo", [id], function (error, resp) {
        Logger.debug("Credit detail:" + resp.result);
        var respObj = JSON.parse(resp.result);
        var bclcRespData = bclcApi.UnionChainSaveData(respObj);
        return bclcRespData;
    });
}