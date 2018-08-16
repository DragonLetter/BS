'use strict';

var bclcSock = require("./BclcSock");
var bclcConst = require("./BclcConst");
var constants = require("../controllers/Constants");

// BCLC接口类，提供和BCLC系统查询/数据保存等接口
class bclcApi {
  constructor() {
  }

  // 保存交易数据
  UnionChainSaveData(fabricData) {
    var owner = fabricData.Owner;
    var lcInfo = fabricData.LetterOfCredit;
    var currStep = fabricData.CurrentStep;

    // 构造请求数据
    var UnionChainReq = {
      "trancode": bclcConst.OPERATIONCODES["OperSaveDataCode"],
      "trandata": {
        "TxData": {
          "OWNREF": owner.no, //"1233",
          "ISSUE_DT": lcInfo.applyTime, //"20170203",
          "ISS_BK_SC": lcInfo.IssuingBank, //"7211111111",
          "LC_TX_CODE": lcInfo.LCNo, //"BCL0101",
          "ADV_BK_SC": lcInfo.AdvisingBank.Name, //"CITICBNK",
          "LC_REF_ID": lcInfo.lcNo,Name, //"7211111100000000",
          "LC_TYPE": "test",
          "LC_EXPIRY_DT": lcInfo.expiryDate //"20170202"
        },
        "ReceiveMember": "CIBKCNBJ",
        "rootId": "1",
        "CurStep": constants.STEPS_NUM[currStep], //1,
        "LC_TX_CODE": "BCL0102",
        "NotifyMemberList": []
      }
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 读取交易数据
  UnionChainReadData() {
    // 构造请求数据
    var UnionChainReq = {
      "trancode": bclcConst.OPERATIONCODES["OperReadDataCode"],
      "trandata": {
        "TxId": "2acb8d63e42969f551a6404e7c3142a6af42b6b4fd1f827178af84d0979edda5"
      }
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 同步StepNo
  UnionChainReadStepNo() {
    // 构造请求数据
    var UnionChainReq = {
      "trancode":bclcConst.OPERATIONCODES["OperReadStepNoCode"],
      "trandata":{
        "RootID":"1"
      }
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 读取根交易列表
  UnionChainReadRootIds() {
    var UnionChainReq = {
      "trancode": bclcConst.OPERATIONCODES["OperReadRootIDsCode"],
      "trandata": {}
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 获取未处理交易
  UnionChainGetPendingTx() {
    // 构造请求数据
    var UnionChainReq = {
      "trancode": bclcConst.OPERATIONCODES["OperGetPendingTxCode"],
      "trandata": {}
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 删除待处理交易记录
  UnionChainDelPendingTx() {
    // 构造请求数据
    var UnionChainReq = {
      "trancode":bclcConst.OPERATIONCODES["OperDelPendingTxCode"],
      "trandata":{
        "TxId":"2acb8d63e42969f551a6404e7c3142a6af42b6b4fd1f827178af84d0979edda5"
      }
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 模拟交易
  UnionChainSync() {
    // 构造请求数据
    var UnionChainReq = {
      "trancode":bclcConst.OPERATIONCODES["OperSyncCode"],
      "trandata":{}
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 查询交易状态
  QueryTransactionState() {
    // 构造请求数据
    var UnionChainReq = {
      "trancode":bclcConst.OPERATIONCODES["OperQueryTransStatusCode"],
      "trandata":{
        "TxId":"15b72352db00d5a0a8cbc975be8e542e2ed25f0d0d711375a4dea4df926e8d52"
      }
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 数据迁移上链部分
  MigrateUnionChainData() {
    // 构造请求数据
    var UnionChainReq = {
      "trancode":bclcConst.OPERATIONCODES["OperMigrateDataCode"],
      "trandata":{
        "TxData":{
          "OWNREF":"1233",
          "ISSUE_DT":"20170203",
          "ISS_BK_SC":"7211111111",
          "LC_TX_CODE":"BCL0101",
          "ADV_BK_SC":"CITICBNK",
          "LC_REF_ID":"7211111100000000",
          "LC_TYPE":"test",
          "LC_EXPIRY_DT":"20170202"
        },
        "ReceiveMember":"CIBKCNBJ",
        "rootId":"2",
        "TxId":"1234455",
        "CurStep":1,
        "LC_TX_CODE":"BCL0102",
        "NotifyMemberList":[

        ]
      }
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 读取信用证下TxID列表
  UnionChainReadTxIDs() {
    // 构造请求数据
    var UnionChainReq = {
      "trancode":bclcConst.OPERATIONCODES["OperReadTxIDsCode"],
      "trandata":{
        "RootID":"1"
      }
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    bclcSock.sendData(JsonReq);

    // 获取服务器端响应结果
    var JsonResp = bclcSock.recvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }
}

module.exports = bclcApi;