'use strict';
var models  = require('../models');
var Sequelize=require("sequelize");

exports.addBank = function (req, res, next) { var args=req.swagger.params;
  /**
   * Add a new bank to the store
   * 
   *
   * body Bank Bank object that needs to be added to the store
   * no response value expected for this operation
   **/
  console.log("Try to save a new bank")
  console.log(args)
  models.Bank.create(args.body.value).then(function(data){
    getBanks(args, res, next);
  });
}

exports.deleteBank = function (req, res, next) { var args=req.swagger.params;
  models.Bank.destroy({where:{Id:args.BankId.value},truncate:false});
  
  res.end();
}

exports.findBanksByName = function (req, res, next) { var args=req.swagger.params;
  /**
   * Finds Banks by name
   * Multiple status values can be provided with comma separated strings
   *
   * bankName String name of Bank to return
   * returns List
   **/
//   var examples = {};
//   examples['application/json'] = [ {
//   "no" : "aeiou",
//   "domain" : "aeiou",
//   "name" : "aeiou"
// } ];
const Op = Sequelize.Op;
var query='%'+args.bankName.value+'%'
console.log("Call findBanksByName:Args:"+query)
models.Bank.findAll({
  where: { name: {
    [Op.like]: query
    }
  }
}).then(function(banks) {
  if (Object.keys(banks).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(banks, null, 2));
  } else {
    res.end();
  }
});
  
}

exports.getBankById = function (req, res, next) { var args=req.swagger.params;
  var id=args.BankId.value;
  models.Bank.findById(id).then(function(bank) {
    if (Object.keys(bank).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(bank));
    } else {
      res.end();
    }
  });
  
}

function getBanks(args, res, next) {
  models.Bank.findAll().then(function(banks) {
    if (Object.keys(banks).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(banks));
    } else {
      res.end();
    }
  });
}

exports.getBanks = getBanks;

exports.updateBank = function (req, res, next) { var args=req.swagger.params;
  
  /**
   * Update an existing Bank
   * 
   *
   * body Bank Bank object that needs to be added to the store
   * no response value expected for this operation
   **/
  res.end();
}

