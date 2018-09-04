'use strict';
var fabric = require("../fabric");
var models = require('../models');
var Sequelize = require("sequelize");
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

exports.addBank = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Add a new bank to the store
   * 
   *
   * body Bank Bank object that needs to be added to the store
   * no response value expected for this operation
   **/
  models.Bank.create(args.body.value).then(function (data) {
    getBanks(args, res, next);
  });
}

exports.deleteBank = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  models.Bank.destroy({ where: { Id: args.BankId.value }, truncate: false });
  res.end();
}

exports.findBanksByName = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

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
  var query = '%' + args.bankName.value + '%';
  Logger.debug("query info:" + query);

  models.Bank.findAll({
    where: {
      name: {
        [Op.like]: query
      }
    }
  }).then(function (banks) {
    if (Object.keys(banks).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(banks, null, 2));
    } else {
      res.end();
    }
  });

}

exports.getBankById = function (req, res, next) {
  var args = req.swagger.params;
  var id = args.BankId.value;

  Logger.debug("args:" + args);

  models.Bank.findById(id).then(function (bank) {
    if (Object.keys(bank).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(bank));
    } else {
      res.end();
    }
  });
}

function getBanks(args, res, next) {
  models.Bank.findAll().then(function (banks) {
    if (Object.keys(banks).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(banks));
    } else {
      res.end();
    }
  });
}

exports.getBanks = getBanks;

exports.updateBank = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Update an existing Bank
   * 
   *
   * body Bank Bank object that needs to be added to the store
   * no response value expected for this operation
   **/
  res.end();
}

exports.addBank2cc = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Add a new bank to the store
   * body Bank Bank object that needs to be added to the store
   * no response value expected for this operation
   **/
  var vals = args.body.value;
  var bcsNo = "B" + vals.no;
  var bankvals = {
    "No": bcsNo,
    "Type": "Bank",
    "DataBank": {
      "No": vals.no,
      "Name": vals.name,
      "Domain": vals.domain,
      "Address": vals.address,
      "PostCode": vals.postcode,
      "Telephone": vals.telephone,
      "Telefax": vals.telefax,
      "Remark": vals.remark
    }
  };

  fabric.invoke2cc(req, "saveBCSInfo", [bcsNo, JSON.stringify(bankvals)], function (err, resp) {
    res.setHeader('Content-Type', 'application/json');
    res.end(resp.result);
  });
}

function getBanks2cc(args, res, next) {
  var Type = "Bank";//args.Type.value;
  fabric.invoke2cc(req, "getBCSList", [Type], function (err, resp) {
    res.setHeader('Content-Type', 'application/json');
    res.end(resp.result);
  });
}
