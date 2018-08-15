'use strict';

// import BclcApi from '../bclc/BclcApi';

var fabric = require("../fabric");

exports.unionChainSaveData = function(req, resp, next) {
    var args = req.swagger.params;
    var id = args.appId.value.toString();
    console.log('Query appid:' + id + 'from fabric.')
    fabric.query(req, "getLcByNo", [id], function (error, resp) {
        console.log('Credit detail:' + resp.result);
        var respObj = JSON.parse(resp.result);
        // res.setHeader('Content-Type', 'application/json');
        // res.end(resp.result);
    });
}