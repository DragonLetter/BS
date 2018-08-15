'use strict';
var fabric = require("../fabric");
var models = require('../models');

/**
 * 开证行：正式开立信用证，共识，并发送通知给网络参与方（开证 or 拒绝）
 * 
 *
 * Params：body
 * return: nil
 **/
exports.bankIssuing = function (req, res, next) { var args=req.swagger.params;
    let value = args.body.value, no = value.no, suggestion = value.suggestion, isAgreed = value.isAgreed, 
        file = value.depositDoc, docArg = {
            "FileName": file.name,
            "FileUri": file.uri,
            "FileHash": file.hash,
            "FileSignature": file.signature,
            "Uploader": file.uploader,
        };

    fabric.invoke(req,"issueLetterOfCredit", [no, suggestion, isAgreed, JSON.stringify(docArg)], function(err, resp){
        if(!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 通知行：审核并签名共识（同意通知 or 拒绝通知）
 * 
 *
 * Params：body
 * return: nil
 **/
exports.advisingBankAudit = function (req, res, next) { var args=req.swagger.params;
    let value = args.body.value, no = value.no, suggestion = value.suggestion, isAgreed = value.isAgreed;
    fabric.invoke(req,"advisingBankReceiveLCNotice", [no, suggestion, isAgreed], function(err, resp){
        if(!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 开证行、通知行、受益人同意通知或者拒绝信用证正本修改
 *
 *
 * Params：body
 * return: nil
 **/
exports.amendCountersign = function (req, res, next) { var args=req.swagger.params;
    var values = args.body.value,
        p1 = values.no,
        p2 = values.opinion,
        p3 = values.isAgreed.toString();
    fabric.invoke(req,"lcAmendConfirm", [p1, p2, p3], function(err, resp){
        if(!err){
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 通知行：确认交单
 *
 *
 * Params：body
 * return: nil
 **/
exports.advisingBankDocsReceivedAudit = function (req, res, next) { var args=req.swagger.params;
    var values = args.body.value, no = values.no,
        suggestion = values.suggestion, isAgreed = values.isAgreed.toString();

    fabric.invoke(req,"reviewBills", [no, suggestion, isAgreed], function(err, resp){
        if(!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 开证行：办理交单（拒绝之后，不符点修改）
 *
 *
 * Params：body
 * return: nil
 **/
exports.issuingBankDocsReceivedAudit = function (req, res, next) { var args=req.swagger.params;
    res.end();    
};

/**
 * 开证行：承兑或者拒付
 *
 * Params：body
 * return: nil
 **/
exports.acceptancePayment = function (req, res, next) { var args=req.swagger.params;
    var values = args.body.value, no = values.no, amount = values.amount.toString(), dismatchPoints = values.dismatchPoints, 
        suggestion = values.suggestion, isAgreed = values.isAgreed.toString();

    fabric.invoke(req,"lcAcceptOrReject", [no, amount, dismatchPoints, suggestion, isAgreed], function(err, resp){
        if(!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 开证行：闭卷
 * 
 * Params：body
 * return: nil
 **/
exports.LCClosing = function (req, res, next) { var args=req.swagger.params;
    var values = args.body.value,
        p1 = values.no,
        p2 = values.description;

    fabric.invoke(req,"lcClose", [p1, p2], function(err, resp){
        if(!err) {
            res.end(JSON.stringify("恭喜，信用证闭卷完成！"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

exports.issuingBankReviseRetire = function (req, res, next) {
    let args = req.swagger.params,
        values = args.body.value,
        no = values.no,
        suggestion = values.no,
        isAgreed = values.isAgreed;
    
    fabric.invoke(req, "reviewRetireBills", [no, suggestion, isAgreed], function(err, resp){
        if(!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
}