'use strict';
var fabric = require("../fabric");
var models = require('../models');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

exports.applicationAudit = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value,
        no = value.no,
        depositAmount = value.depositAmount,
        lcNo = value.lcNo,
        suggestion = value.suggestion,
        isAgreed = value.isAgreed;

    Logger.debug("args:" + inspect(args));

    fabric.invoke(req, "bankConfirmApplication", [no, lcNo, depositAmount, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

exports.getApplicationById = function (req, res, next) {
    var args = req.swagger.params;
    var id = args.appId.value.toString();

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [id], function (error, resp) {
        res.setHeader('Content-Type', 'application/json');
        res.end(resp.result);
    });
};

//更新信用证修改银行操作最新状态，如果新记录生成，否则更新
exports.updateAmendState = function (req, res, next) {
    var args = req.swagger.params;
    Logger.debug("args:" + inspect(args));

    models.AmendState.findOne({
        'where': {
            'AFNo': args.AFNo.value,
            'amendNo': args.amendNo.value,
        }
    }).then(function (data) {
        if (data == null) {
            Logger.debug("query amend AFNo:" + args.AFNo.value + " query amend amendNo: " + args.amendNo.value);
            
            models.AmendState.create({
                'AFNo': args.AFNo.value,
                'amendNo': args.amendNo.value,
                'step': args.body.value.step,
                'state': args.body.value.state,
                'lcNo' : args.body.value.lcNo,
                'suggestion' : args.body.value.suggestion,
            }).then(function (data) {
                Logger.debug("insert amend state");
                res.end();
                
            }).catch(function (e) {
                Logger.debug("insert amend state error:" + e);              
                res.end();
            });
        }
        else {
            var info = {
                'AFNo': args.AFNo.value,
                'amendNo': args.amendNo.value,
                'step': args.body.value.step,
                'state': args.body.value.state,
                'lcNo' : args.body.value.lcNo,
                'suggestion' : args.body.value.suggestion,
              };

            models.AmendState.update(
                info,                
                {
                    'where': {
                        'AFNo': args.AFNo.value,
                        'amendNo': args.amendNo.value
                    }
                }
            ).then(function (data) {
                Logger.debug("update resp:" + data);
                if (data[0] == 0) {
                    Logger.debug("unknown amend info");
                    res.end(JSON.stringify("unknown amend info"));
                } else if (data[0] == 1) {
                    Logger.debug("true");
                    res.end(JSON.stringify("true"));
                } else {
                    Logger.debug("false");
                    res.end(JSON.stringify("false"));
                }
            }).catch(function (e) {
                Logger.error("Exception:" + e);
                res.end();
            })
        }
    });
};

//获取当前信用证修改银行的最新操作状态
exports.getAmendState = function (req, res, next) {
    var args = req.swagger.params;
    Logger.debug("args:" + inspect(args));

    models.AmendState.findOne({
        'where': {
            'AFNo': args.AFNo.value,
            'amendNo': args.amendNo.value
        }
    }).then(function (data) {
        if (data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data.dataValues || {}, null, 2));
        }
        res.end();
    });
};