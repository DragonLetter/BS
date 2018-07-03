'use strict';
var models  = require('../models');
var Sequelize=require("sequelize");

exports.addCorpPartnership = function (req, res, next) { var args=req.swagger.params;
    var corpId = args.body.value.hostCorpId;
    args.body.value.creationTime = args.body.value.creationTime.split("T")[0];
    models.CorpPartnership.create(args.body.value).then(function(data){
        getCorpPartnershipById(corpId, res);
    });
}

exports.deleteCorpPartnership = function (req, res, next) { var args=req.swagger.params;
  /**
   * Deletes a CorpPartnership
   * 
   *
   * CorpPartnershipId Long CorpPartnership id to delete
   * no response value expected for this operation
   **/
  res.end();
}


function getCorpPartnershipById(corpId, res) {
    models.CorpPartnership.findAll({
        where: {
            hostCorpId: corpId,
        },
        include: [
            {model: models.Corporation, as: 'Corporation'}
        ]
    }).then(function(corpPartnerships){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(corpPartnerships));
    })
}

exports.getCorpPartnershipById = function (req, res, next) { var args=req.swagger.params;
    var corpId=args.corpId.value;
    getCorpPartnershipById(corpId, res);
}

exports.updateCorpPartnership = function (req, res, next) { var args=req.swagger.params;
  /**
   * Update an existing CorpPartnership
   * 
   *
   * body CorpPartnership CorpPartnership object that needs to be added to the store
   * no response value expected for this operation
   **/
  res.end();
}

