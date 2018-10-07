'use strict';

var bclcSock = require("./BclcSock");
var bclcConst = require("./BclcConst");
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

function get_length(str) {
  //获得字符串实际长度，中文2，英文1
  //要获得长度的字符串
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128)
      realLength += 1;
    else
      realLength += 2;
  }
  return realLength;
};

function encap_req(req) {
  var JsonReq = JSON.stringify(req);
  var reqLen = get_length(JsonReq).toString();
  var length = get_length(reqLen);
  for (; length < 6; length++) {
    reqLen = '0' + reqLen;
  }
  JsonReq = reqLen + JsonReq;
  return JsonReq;
}

// 保存交易数据
exports.UnionChainSaveData = function (transData, callback) {
  Logger.debug("UnionChainSaveData Req:" + JSON.stringify(transData));
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperSaveDataCode"],
    "trandata": transData
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  bclcSock.BclcSockSendData(JsonReq, callback);
}

// 读取交易数据
exports.UnionChainReadData = function (txID, callback) {
  // 构造请求数据
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperReadDataCode"],
    "trandata": {
      "TxId": txID
    }
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  bclcSock.BclcSockSendData(JsonReq, callback);
}

// 同步StepNo
exports.UnionChainReadStepNo = function (rootID, callback) {
  // 构造请求数据
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperReadStepNoCode"],
    "trandata": {
      "RootID": rootID
    }
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  bclcSock.BclcSockSendData(JsonReq, callback);
}

// 读取根交易列表
exports.UnionChainReadRootIds = function (callback) {
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperReadRootIDsCode"],
    "trandata": {}
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  return bclcSock.BclcSockSendData(JsonReq, callback);
}

// 获取未处理交易
exports.UnionChainGetPendingTx = function (callback) {
  // 构造请求数据
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperGetPendingTxCode"],
    "trandata": {}
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  return bclcSock.BclcSockSendData(JsonReq, callback);
}

// 删除待处理交易记录
exports.UnionChainDelPendingTx = function (txID, callback) {
  // 构造请求数据
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperDelPendingTxCode"],
    "trandata": {
      "TxId": txID
    }
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  return bclcSock.BclcSockSendData(JsonReq, callback);
}

// 模拟交易
exports.UnionChainSync = function (callback) {
  // 构造请求数据
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperSyncCode"],
    "trandata": {}
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  return bclcSock.BclcSockSendData(JsonReq, callback);
}

// 查询交易状态
exports.QueryTransactionState = function (txID, callback) {
  // 构造请求数据
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperQueryTransStatusCode"],
    "trandata": {
      "TxId": txID
    }
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  bclcSock.BclcSockSendData(JsonReq, callback);
}

// 数据迁移上链部分
exports.MigrateUnionChainData = function () {
  // 构造请求数据
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperMigrateDataCode"],
    "trandata": {
      "TxData": {
        "OWNREF": "1233",
        "ISSUE_DT": "20170203",
        "ISS_BK_SC": "7211111111",
        "LC_TX_CODE": "BCL0101",
        "ADV_BK_SC": "CITICBNK",
        "LC_REF_ID": "7211111100000000",
        "LC_TYPE": "test",
        "LC_EXPIRY_DT": "20170202"
      },
      "ReceiveMember": "CIBKCNBJ",
      "rootId": "2",
      "TxId": "1234455",
      "CurStep": 1,
      "LC_TX_CODE": "BCL0102",
      "NotifyMemberList": [

      ]
    }
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = JSON.stringify(UnionChainReq);
  bclcSock.BclcSockSendData(JsonReq);

  // 获取服务器端响应结果
  // var JsonResp = bclcSock.recvData();
  // var JsonRespObj = JSON.parse(JsonResp);
}

// 读取信用证下TxID列表
exports.UnionChainReadTxIDs = function (rootID, callback) {
  // 构造请求数据
  var UnionChainReq = {
    "trancode": bclcConst.OPERATIONCODES["OperReadTxIDsCode"],
    "trandata": {
      "RootID": rootID
    }
  };

  // 将请求转化为JSON串，发送给BCLC服务器端
  var JsonReq = encap_req(UnionChainReq);
  bclcSock.BclcSockSendData(JsonReq, callback);
}
