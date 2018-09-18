'use strict';
var fabric = require("../fabric");
var models = require('../models');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

/**
 * 申请人：修改信用证（信用证修改由申请人发起）
 * 
 *
 * Params：body
 * return: nil
 **/
exports.lcAmendation = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value,
        no = value.no;
    let fabricArg = {
        "AmendTimes": value.amendTimes,
        "AmendedCurrency": value.amendedCurrency,
        "AmendedAmt": value.amendedAmt,
        "AddedDays": value.addedDays,
        "AmendExpiryDate": value.amendExpiryDate,
        "TransPortName": value.transPortName,
        "AddedDepositAmt": value.addedDepositAmt,
    };

    Logger.debug("input args:" + inspect(args)
        + "\n fabric req:" + JSON.stringify(fabricArg));
    // console.log(JSON.stringify(fabricArg))
    fabric.invoke(req, "lcAmendSubmit", [no, JSON.stringify(fabricArg)], function (err, resp) {
        if (!err) {            
            res.end(JSON.stringify("处理成功"));
        } else {
            Logger.error(err);
        }
    })
};

/**
 * 开证行、通知行、受益人同意通知或者拒绝信用证正本修改
 *
 *
 * Params：body
 * return: nil
 **/
exports.amendCountersign = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value,
        p1 = values.no,
        p2 = values.opinion,
        p3 = values.isAgreed.toString();

    Logger.debug("args:" + inspect(args));

    fabric.invoke(req, "lcAmendConfirm", [p1, p2, p3], function (err, resp) {
        if (!err) {
            res.end();
        } else {
            Logger.error(err);
        }
    });
};

/**
 * 申请人：提交保证金
 * 
 * Params：body
 * return: nil
 **/
exports.lcDeposit = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value,
        no = value.no,
        commitAmount = value.commitAmount,
        depositDoc = value.depositDoc,
        fabricArg = {
            "CommitAmount": commitAmount,
            "DepositDoc": depositDoc ? depositDoc : {},
        };

    Logger.debug("input args:" + inspect(args)
        + "\n fabric req:" + fabricArg);

    fabric.invoke(req, "deposit", [no, JSON.stringify(fabricArg)], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("处理成功"));
        } else {
            res.end(JSON.stringify(err));
        }
    })
};

/**
 * 受益人：处理信用证通知
 * 
 * Params：body
 * return: nil
 **/
exports.beneficiaryHandleLCNotice = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value,
        no = value.no,
        suggestion = value.suggestion,
        isAgreed = value.isAgreed;

    Logger.debug("args:" + inspect(args));

    fabric.invoke(req, "beneficiaryReceiveLCNotice", [no, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("处理成功"));
        } else {
            res.end(JSON.stringify(err));
        }
    })
}

/**
 * 受益人：交单
 * 
 * Params：body
 * return: nil
 **/
exports.beneficiaryHandoverBills = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value,
        no = value.no,
        amount = value.amount,
        fabricArg = {
        },
        billLandings = [],
        // "BillOfLandings": value.billinfo,
        fabricArg1 = value.billFile;

    for (var i = 0; i < value.billinfo.length; i++) {
        var billLanding = {};
        billLanding.BolNO = value.billinfo[i].bolNo;
        billLanding.GoodsNo = value.billinfo[i].goodsNo;
        billLanding.GoodsDesc = value.billinfo[i].goodsInfo;
        billLanding.ShippingTime = value.billinfo[i].shippingTime;
        billLandings[i] = billLanding;
    }
    fabricArg.HandoverAmount = amount;
    fabricArg.BillOfLandings = billLandings;

    Logger.debug("input args:" + inspect(args)
        + "\n fabric arg:" + JSON.stringify(fabricArg)
        + "\n fabric arg1:" + JSON.stringify(fabricArg1));

    fabric.invoke(req, "handOverBills", [no, JSON.stringify(fabricArg), JSON.stringify(fabricArg1)], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("交单成功"));
        } else {
            res.end(JSON.stringify(err));
        }
    })
}

/**
 * 申请人：检查交单
 * 
 * Params：body
 * return: nil
 **/
exports.appliciantCheckBills = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value,
        lcNo = value.lcNo,
        billNo = value.billNo,
        suggestion = value.suggestion,
        isAgreed = value.isAgreed

    Logger.debug("input args:" + inspect(args));

    fabric.invoke(req, "appliantCheckBills", [lcNo, billNo, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("交单校验成功"));
        } else {
            res.end(JSON.stringify(err));
        }
    })
}

/**
 * 申请人：付款
 * 
 * Params：body
 * return: nil
 **/
exports.retireShippingBills = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value,
        no = value.no,
        commitAmount = value.commitAmount;

    Logger.debug("args:" + inspect(args));

    fabric.invoke(req, "retireShippingBills", [no, commitAmount], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("付款成功"));
        } else {
            res.end(JSON.stringify(err));
        }
    })
}

/**
 * 受益人：发起修改同意或拒绝
 *
 * Params：body
 * return: nil
 **/
exports.beneficiaryOfAmendHandle = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value, no = values.no, amendNo = values.amendNo,
        suggestion = values.suggestion, isAgreed = values.isAgreed.toString();

    fabric.invoke(req, "beneficiaryLetterOfAmend", [no, amendNo, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            // writeAcceptancePdf(req, no, res)
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};