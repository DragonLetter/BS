'use strict';
var models  = require('../models');
var Sequelize=require("sequelize");

exports.addCorporation = function (req, res, next) { var args=req.swagger.params;
  /**
   * Add a new bank to the store
   * 
   *
   * body Corporation Corporation object that needs to be added to the store
   * no response value expected for this operation
   **/
    models.Corporation.create(args.body.value).then(function(data){
        getCorporations(args, res, next);
    });
}

exports.deleteCorporation = function (req, res, next) { var args=req.swagger.params;
  /**
   * Deletes a Corporation
   * 
   *
   * corporationId Long Corporation id to delete
   * no response value expected for this operation
   **/
  res.end();
}

exports.findCorporationsByName = function (req, res, next) { var args=req.swagger.params;
  models.Corporation.findOne({
    'where': {
        'name': args.bankName.value,
    }
}).then(function(corporation){
    if (Object.keys(corporation).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(corporation));
    } else {
      res.end();
    }
})
}

exports.getCorporationById = function (req, res, next) { var args=req.swagger.params;
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
  }).then(function(corporation){
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
    models.Corporation.findAll().then(function(corporations) {
        if (Object.keys(corporations).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(corporations));
        } else {
          res.end();
        }
    });
}

exports.getCorporations = getCorporations;

exports.updateCorporation = function (req, res, next) { var args=req.swagger.params;
  /**
   * Update an existing Corporation
   * 
   *
   * body Corporation Corporation object that needs to be added to the store
   * no response value expected for this operation
   **/
  res.end();
}

