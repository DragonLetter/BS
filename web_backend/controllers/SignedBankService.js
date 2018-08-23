'use strict';
var models  = require('../models');
var Sequelize=require("sequelize");

exports.addSignedBank = function (req, res, next) { var args=req.swagger.params;
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
exports.signBCAppAudit = function (req, res, next) { 
    var args=req.swagger.params;
    let value = args.body.value, no = value.NO, isAudit = value.isAudit;
    return res.end(JSON.stringify("审核通过"));

    fabric.invoke(req,"bankConfirmApplication", [no, isAudit], function(err, resp) {
        if(!err) {
            res.end(JSON.stringify("审核通过"));
        } else{
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};
