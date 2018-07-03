'use strict';
var fabric = require("../fabric");
var models = require('../models');

/**
 * 申请人：修改信用证（信用证修改由申请人发起）
 * 
 *
 * Params：body
 * return: nil
 **/
exports.lcAmendation = function (req, res, next) { var args=req.swagger.params;
    let value = args.body.value, no = value.no;
    let fabricArg = {
            "AmendTimes": value.amendTimes,
            "AmendedCurrency": value.amendedCurrency,
            "AmendedAmt": value.amendedAmt,
            "AddedDays": value.addedDays,
            "AmendExpiryDate": value.amendExpiryDate,
            "TransPortName": value.transPortName,
            "AddedDepositAmt": value.addedDepositAmt,
    };
    fabric.invoke(req,"lcAmendSubmit", [no, JSON.stringify(fabricArg)], function(err, resp){
        if(!err) {
            res.end();
        } else {
            console.log(err);
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
exports.amendCountersign = function (req, res, next) { var args=req.swagger.params;
    var values = args.body.value,
        p1 = values.no,
        p2 = values.opinion,
        p3 = values.isAgreed.toString();
    fabric.invoke(req,"lcAmendConfirm", [p1, p2, p3], function(err, resp){
        if(!err){
            res.end();
        }else{
            console.log(err);
        }
    });
};

/**
 * 申请人：提交保证金
 * 
 * Params：body
 * return: nil
 **/
exports.lcDeposit = function (req, res, next) { var args=req.swagger.params;
    let value = args.body.value, no = value.no, commitAmount = value.commitAmount, depositDoc = value.depositDoc,
        fabricArg = {
            "CommitAmount": commitAmount,
            "DepositDoc": depositDoc ? depositDoc : {},
        };
    fabric.invoke(req,"deposit", [no, JSON.stringify(fabricArg)], function(err, resp){
        if(!err){
            res.end(JSON.stringify("处理成功"));
        }else{
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
exports.beneficiaryHandleLCNotice = function (req, res, next) { var args=req.swagger.params;
    let value = args.body.value, no = value.no, suggestion = value.suggestion, isAgreed = value.isAgreed;
    fabric.invoke(req,"beneficiaryReceiveLCNotice", [no, suggestion, isAgreed], function(err, resp){
        if(!err) {
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
exports.beneficiaryHandoverBills = function (req, res, next) { var args=req.swagger.params;
    let value = args.body.value, no = value.no, 
        // billInfo = {
        //     "BolNO": "20170192102",
        //     "GoodsNo": "20170192102",
        //     "GoodsDesc": "expensive goods",
        //     "ShippingTime": "2017-08-09",
        // }, 
        // docInfo = {
        //     "FileName": "lixiaohucontract",
        //     "FileUri": "FileUri",
        //     "FileHash": "56d34dad234bbdabcb3213",
        //     "FileSignature": "lixiaohussignature",
        //     "Uploader": "lixiaohu",
        // },
        // fabricArg = {
        //     "BillOfLandings": [billInfo]
        // },
        // fabricArg1 = [docInfo];
        fabricArg = {
                "BillOfLandings": value.billInfo,
            }, fabricArg1 = value.billFile;
    fabric.invoke(req,"handOverBills", [no, JSON.stringify(fabricArg), JSON.stringify(fabricArg1)], function(err, resp){
        if(!err) {
            res.end(JSON.stringify("交单成功"));
        } else {
            res.end(JSON.stringify(err));
        }
    })
}

/**
 * 申请人：赎单
 * 
 * Params：body
 * return: nil
 **/
exports.retireShippingBills = function (req, res, next) { var args=req.swagger.params;
    let value = args.body.value, no = value.no, commitAmount = value.commitAmount;
    fabric.invoke(req,"retireShippingBills", [no, commitAmount], function(err, resp){
        if(!err) {
            res.end(JSON.stringify("赎单成功"));
        } else {
            res.end(JSON.stringify(err));
        }
    })
}