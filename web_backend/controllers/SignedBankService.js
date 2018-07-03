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
        var results = corps.map(corp => corp.Corporation)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
}