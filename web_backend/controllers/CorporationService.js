'use strict';
var fabric = require("../fabric");
var models = require('../models');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

exports.addCorporation = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Add a new bank to the store
   * 
   *
   * body Corporation Corporation object that needs to be added to the store
   * no response value expected for this operation
   **/
  models.Corporation.create(args.body.value).then(function (data) {
    getCorporations(args, res, next);
  });
}

exports.deleteCorporation = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Deletes a Corporation
   * 
   *
   * corporationId Long Corporation id to delete
   * no response value expected for this operation
   **/
  res.end();
}

exports.findCorporationsByName = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Finds Corporations by name
   * Multiple status values can be provided with comma separated strings
   *
   * bankName String name of Corporation to return
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [{
    "no": "aeiou",
    "domain": "aeiou",
    "name": "aeiou"
  }];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getCorporationById = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Find Corporation by ID
   * Returns a single Corporation
   *
   * corporationId Long ID of Corporation to return
   * returns Corporation
   **/
  models.Corporation.findOne({
    'where': {
      'id': args.CorporationId.value,
    }
  }).then(function (corporation) {
    if (Object.keys(corporation).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(corporation));
    } else {
      res.end();
    }
  })
}

function getCorporations(args, res, next) {
  /**
   * Get all Corporations
   * Returns Corporation list
   *
   * returns List
   **/
  models.Corporation.findAll().then(function (corporations) {
    if (Object.keys(corporations).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(corporations));
    } else {
      res.end();
    }
  });
}

exports.getCorporations = getCorporations;

exports.updateCorporation = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Update an existing Corporation
   * 
   *
   * body Corporation Corporation object that needs to be added to the store
   * no response value expected for this operation
   **/
  res.end();
}

exports.addCorporation2cc = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + args);

  /**
   * Add a new bank to the store
   * body Bank Bank object that needs to be added to the store
   * no response value expected for this operation
   **/
  var vals = args.body.value;
  var bcsNo = "C" + vals.no;
  var corpvals = {
    "No": bcsNo,
    "Type": "Corp",
    "DataCorp": {
      "No": vals.no,
      "Name": vals.name,
      "Domain": vals.domain,
      "Address": vals.address,
      "PostCode": vals.postcode,
      "Telephone": vals.telephone,
      "Telefax": vals.telefax
    }
  };

  fabric.invoke2cc(req, "saveBCSInfo", [bcsNo, JSON.stringify(corpvals)], function (err, resp) {
    res.setHeader('Content-Type', 'application/json');
    res.end(resp.result);
  });
}

function getCorporations2cc(args, res, next) {
  var Type = "Corp";//args.Type.value;
  fabric.invoke2cc(req, "getBCSList", [Type], function (err, resp) {
    res.setHeader('Content-Type', 'application/json');
    res.end(resp.result);
  });
}
