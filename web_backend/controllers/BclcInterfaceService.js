'use strict';

var fabric = require("../fabric");
var bclcApi = require("../bclc/BclcApi");
var constants = require("./Constants");
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

function callbackBclc(respData, res) {
    Logger.debug("save resp:" + JSON.stringify(respData));

    var result = JSON.parse(respData.substring(6));
    // 返回数据中Code为0表示成功，1表示失败，504表示未收到区块链节点的共识响应信息
    if (result.Code == 0) {
        Logger.debug("Bclc resp successfully");
    } else if (result.Code == 1) {
        Logger.info("Bclc resp failed");
    } else if (result.Code == 504) {
        Logger.info("Bclc Tx timeout");
        res.status(504);
    } else if (result.Code == 600) {
        Logger.info("Bclc Tx not me");
        res.status(600);
    } else if (result.Code == 900) {
        Logger.info("Bclc Json encode failed");
        res.status(900);
    } else if (result.Code == 901) {
        Logger.info("Bclc Json unmarshal failed");
        res.status(901);
    } else if (result.Code == 999) {
        Logger.info("Bclc unsupport Tx");
        res.status(999);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
}

exports.unionChainSaveData = function (req, res, next) {
    var args = req.swagger.params;
    var tranData = args.body.value;
    var recvFlag = false;

    Logger.debug("args:" + inspect(tranData));

    bclcApi.UnionChainSaveData(tranData, function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}

exports.unionChainSaveDataBE = function (lcID) {
    Logger.debug("lcID:" + lcID);

    fabric.query(req, "getLcByNo", [lcID], function (error, resp) {
        Logger.debug("Credit detail:" + resp.result);
        var respObj = JSON.parse(resp.result);
        var rootID = respObj.no;
        var lcInfo = respObj.LetterOfCredit;
        var currStep = respObj.CurrentStep;

        // 构造请求数据
        var txDataReq = {
            "OWNREF": lcInfo.LCNo, //"1233",
            "ISSUE_DT": lcInfo.applyTime, //"20170203",
            "ISS_BK_SC": lcInfo.IssuingBank.No, //"7211111111",
            "LC_TX_CODE": lcInfo.LCNo, //"BCL0101",业务交易码
            "ADV_BK_SC": lcInfo.AdvisingBank.No, //"CITICBNK",
            "LC_REF_ID": lcInfo.LCNo, //"7211111100000000",
            "LC_TYPE": lcInfo.isAtSight, // 即期还是远期
            "LC_EXPIRY_DT": lcInfo.expiryDate //"20170202"
        };
        var transData = {
            "ReceiveMember": lcInfo.Beneficiary.No, // "CIBKCNBJ",
            "NotifyMemberList": [lcInfo.AdvisingBank.No],
            "TxData": JSON.stringify(txDataReq),
            "CurStep": constants.STEPS_NUM[currStep], //1,
            "rootId": rootID,
            "PermTable": null,
            "LC_TX_CODE": "BCL0102"
        };
        Logger.debug("UnionChainSaveData Req:" + JSON.stringify(transData));

        bclcApi.UnionChainSaveData(transData, function (data) {
            Logger.debug("save resp:" + JSON.stringify(data));
        });
    });
}

exports.uionChainReadData = function (req, res, next) {
    var args = req.swagger.params;
    var txID = args.TxID.value;
    var recvFlag = false;

    Logger.debug("args:" + inspect(txID));

    bclcApi.UnionChainReadData(txID, function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}

exports.unionChainReadStepNo = function (req, res, next) {
    var args = req.swagger.params;
    var rootID = args.RootID.value;
    var recvFlag = false;

    Logger.debug("args:" + inspect(rootID));

    bclcApi.UnionChainReadStepNo(rootID, function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}

exports.unionChainReadRootIds = function (req, res, next) {
    var args = req.swagger.params;
    var recvFlag = false;

    Logger.debug("args:" + inspect(args));

    bclcApi.UnionChainReadRootIds(function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}

exports.queryTransactionState = function (req, res, next) {
    var args = req.swagger.params;
    var txID = args.TxID.value;
    var recvFlag = false;

    Logger.debug("args:" + inspect(txID));

    bclcApi.QueryTransactionState(txID, function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}

exports.unionChainReadTxIDs = function (req, res, next) {
    var args = req.swagger.params;
    var rootID = args.RootID.value;
    var recvFlag = false;

    Logger.debug("args:" + inspect(rootID));

    bclcApi.UnionChainReadTxIDs(rootID, function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}

exports.unionChainGetPendingTx = function (req, res, next) {
    var args = req.swagger.params;
    var recvFlag = false;

    Logger.debug("args:" + inspect(args));

    bclcApi.UnionChainGetPendingTx(function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}

exports.unionChainDelPendingTx = function (req, res, next) {
    var args = req.swagger.params;
    var txID = args.TxID.value;
    var recvFlag = false;

    Logger.debug("args:" + inspect(txID));

    bclcApi.UnionChainDelPendingTx(txID, function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}

exports.unionChainSync = function (req, res, next) {
    var args = req.swagger.params;
    var recvFlag = false;

    Logger.debug("args:" + inspect(args));

    bclcApi.UnionChainSync(function (data) {
        if (false == recvFlag) {
            Logger.debug("Receive resp data first time.");
            callbackBclc(data, res);
            recvFlag = true;
        } else {
            Logger.debug("Have receive resp data more than once.");
        }
    });
}