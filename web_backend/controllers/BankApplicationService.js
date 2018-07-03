'use strict';
var fabric = require("../fabric");
var models = require('../models');
var sequenceHelper = require("./SequenceHelper");

exports.applicationAudit = function (req, res, next) { var args=req.swagger.params;
    let value = args.body.value, no = value.no, depositAmount = value.depositAmount, lcNo = value.lcNo, suggestion = value.suggestion, isAgreed = value.isAgreed;
    fabric.invoke(req,"bankConfirmApplication", [no, lcNo, depositAmount, suggestion, isAgreed], function(err, resp) {
        if(!err) {
            res.end(JSON.stringify("审核通过"));
        } else{
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

exports.getApplicationById = function (req, res, next) { var args=req.swagger.params;
    var id = args.appId.value.toString();
    fabric.query(req,"getLcByNo", [id], function (error, resp) {
        res.setHeader('Content-Type', 'application/json');
        res.end(resp.result);
    });
};