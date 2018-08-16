'use strict';

var fabric = require("../fabric");
var bclcApi = require("../bclc/BclcApi");

exports.unionChainSaveData = function (req, resp, next) {
    var args = req.swagger.params;
    var id = args.appId.value.toString();
    console.log('Query appid:' + id + 'from fabric.');
    fabric.query(req, "getLcByNo", [id], function (error, resp) {
        console.log('Credit detail:' + resp.result);
        var respObj = JSON.parse(resp.result);
        var bclcRespData = bclcApi.UnionChainSaveData(respObj);
        return bclcRespData;
    });
}