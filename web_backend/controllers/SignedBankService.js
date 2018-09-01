'use strict';
var fabric = require("../fabric");
var models  = require('../models');
var Sequelize=require("sequelize");

exports.addSignedBank = function (req, res, next) { 
    var args=req.swagger.params;
    var corpId = args.body.value.corporationId;
    models.SignedBank.create(args.body.value).then(function(data){
        getSignedBankById(corpId, res);
    });
}

exports.deleteSignedBank = function (req, res, next) { var args=req.swagger.params;
  models.SignedBank.destroy({where:{Id:args.SignedBankId.value},truncate:false});
  
  res.end();
}

function getSignedBankById(corpId, res) {
    models.SignedBank.findAll({
        where: {
            corporationId: corpId,
        },
        include: [
            {model: models.Bank, as: 'Bank'}
        ]
    }).then(function(signedBanks){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(signedBanks));
    });
}

exports.getSignedBankById = function (req, res, next) { var args=req.swagger.params;
    var corpId=args.corpId.value;
    getSignedBankById(corpId, res);
}

exports.updateSignedBank = function (req, res, next) { var args=req.swagger.params;
  
  /**
   * Update an existing SignedBank
   * 
   *
   * body SignedBank SignedBank object that needs to be added to the store
   * no response value expected for this operation
   **/
  res.end();
}
function dbCorp2ViewCorp(corp){
    return {
    "id": corp.id,
    "name": corp.name,
    "domain": corp.domain,
    "nation": corp.nation,
    "contact": corp.contact,
    "email":corp.email,
    "account": corp.account,
    "depositBank": corp.depositBank,
    "address": corp.address,
    "postcode": corp.postcode,
    "telephone": corp.telephone,
    "telefax": corp.telefax,
    "creationTime": corp.creationTime}
  }
  
exports.getCorpsByBankId = function (req, res, next) { 
    var args=req.swagger.params, bankId=args.bankId.value;
    models.SignedBank.findAll({
        where: {
            bankId: bankId,
        },
        include: [
            {model: models.Corporation, as: 'Corporation'}
        ]
    }).then(function(corps){
        var results = corps.map(corp => corp.Corporation);
        var result=[];
        for(var i=0;i<results.length;i++){
          var corp=dbCorp2ViewCorp(results[i]);
          corp.signState = corps[i].state;
          result.push(corp);
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    });
}

exports.addSignedBank2cc = function (req, res, next) { 
    var args=req.swagger.params;
    var vals = args.body.value;
    var bcsNo = vals.No;
    var signvals = {
      "No" : bcsNo,
      "Type": "Sign",
      "DataBank":{
        "No": vals.bank.no,
        "Name": vals.bank.name,
        "Domain": vals.bank.domain,
        "Address": vals.bank.address,
        "PostCode": vals.bank.postcode,
        "Telephone": vals.bank.telephone,
        "Telefax": vals.bank.telefax,
        "Remark": vals.bank.remark
      },
      "DataCorp":{
        "No": vals.corp.no,
        "Name": vals.corp.name,
        "Account": vals.corp.account,
        "Domain": vals.corp.domain,
        "Address": vals.corp.address,
        "PostCode": vals.corp.postcode,
        "Telephone": vals.corp.telephone,
        "Telefax": vals.corp.telefax
      },
      "StateSign": 0
    };
    
    fabric.invoke2cc(req, "saveBCSInfo",[bcsNo, JSON.stringify(signvals)], function(err, resp) {
      res.setHeader('Content-Type', 'application/json');
      res.end(resp.result);
    });
}
exports.signBCAppAudit = function (req, res, next) { 
    var args=req.swagger.params;
    var vals = args.body.value;
    var bcsNo = vals.No;
    var signvals = {
      "No" : bcsNo,
      "Type": vals.Type,
      "DataBank":{
        "No": vals.bank.no,
        "Name": vals.bank.name,
        "Domain": vals.bank.domain,
        "Address": vals.bank.address,
        "PostCode": vals.bank.postcode,
        "Telephone": vals.bank.telephone,
        "Telefax": vals.bank.telefax,
        "Remark": vals.bank.remark
      },
      "DataCorp":{
        "No": vals.corp.no,
        "Name": vals.corp.name,
        "Account": vals.corp.account,
        "Domain": vals.corp.domain,
        "Address": vals.corp.address,
        "PostCode": vals.corp.postcode,
        "Telephone": vals.corp.telephone,
        "Telefax": vals.corp.telefax
      },
      "StateSign": vals.StateSign
    };
    fabric.invoke2cc(req, "saveBCSInfo",[bcsNo, JSON.stringify(signvals)], function(err, resp) {
        res.setHeader('Content-Type', 'application/json');
        if( !err ){
            res.end(JSON.stringify("银行已经审核！"));
        }
        else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};
/**
 * 获取转换字符串
 *
 * Params：chaincodeTx
 * return: viewTx
 **/
function chaincodeSignBank(cctx){
    var bcstx = {
        "No": cctx.Record.No,
        "Type":cctx.Record.Type,
        "bank":{
            "no":cctx.Record.DataBank.No,
            "name":cctx.Record.DataBank.Name,
            "domain":cctx.Record.DataBank.Domain,
            "address":cctx.Record.DataBank.Address,
            "postcode":cctx.Record.DataBank.PostCode,
            "telephone":cctx.Record.DataBank.Telephone,
            "telefax":cctx.Record.DataBank.Telefax,
            "remark":cctx.Record.DataBank.Remark
    
        },
        "corp":{
            "no":cctx.Record.DataCorp.No,
            "name":cctx.Record.DataCorp.Name,
            "domain":cctx.Record.DataCorp.Domain,
            "address":cctx.Record.DataCorp.Address,
            "account":cctx.Record.DataCorp.Account,
            "postcode":cctx.Record.DataCorp.PostCode,
            "telephone":cctx.Record.DataCorp.Telephone,
            "telefax":cctx.Record.DataCorp.Telefax,
        },
        "StateSign":cctx.Record.StateSign
    };
    return bcstx;
}
exports.getSignedBankById2cc = function (req, res, next) { 
    var args=req.swagger.params;
    var corpId = args.corpId.value;
    var dtype = "Sign";
    fabric.query2cc(req, "getBCSList", [dtype], function(err, resp){
        res.setHeader('Content-Type', 'application/json');
        if(err) {
            res.status(405).end();
        } else {
            var corps= [];
            var resultObj=JSON.parse(resp.result);
            for(var i=0;i<resultObj.length;i++){
                if( resultObj[i].Record.DataCorp.No == corpId )
                {
                    var bcstx = chaincodeSignBank(resultObj[i]);
                    corps.push(bcstx);
                }
            }
            console.log(JSON.stringify(corps));
            res.end(JSON.stringify(corps));
        }
    });
}

exports.getCorpsByBankId2cc = function (req, res, next) { 
    var args=req.swagger.params, 
    bankId=args.bankId.value;
    var dtype = "Sign";
    fabric.query2cc(req, "getBCSList",[dtype], function(err, resp){
        res.setHeader('Content-Type', 'application/json');
        if(err) {
            res.status(405).end();
        } else {
            var corps= [];
            var resultObj=JSON.parse(resp.result);
            for(var i=0;i<resultObj.length;i++){
                if( resultObj[i].Record.DataBank.No == bankId )
                {
                    var bcstx = chaincodeSignBank(resultObj[i]);
                    corps.push(bcstx);
                }
            }
            console.log(JSON.stringify(corps));
            res.end(JSON.stringify(corps));
        }
    });
}
