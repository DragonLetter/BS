'use strict';

var models = require('../models');
var Sequelize = require("sequelize");

exports.addBankRecord = function (req, res, next) {
    var args = req.swagger.params;
    console.log("Try to save a new bank");
    console.log(args);

    /**
     * Add a new operation record to the db
     **/
    models.BankRecord.create(args.body.value).then(function (data) {
        getBankRecordByLcNo(args, res, next);
    });
}

exports.deleteBankRecordByLcNo = function (req, res, next) {
    var args = req.swagger.params;
    var lcID = args.LcNo.value;
    models.BankRecord.destroy({ where: { Id: lcID }, truncate: false });

    res.end();
}

function getBankRecordByLcNo(req, res, next) {
    var args = req.swagger.params;
    var lcID = args.LcNo.value;
    models.BankRecord.findById(lcID).then(function (bank) {
        if (Object.keys(bank).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(bank));
        } else {
            res.end();
        }
    });
}
exports.getBankRecordByLcNo = getBankRecordByLcNo;

exports.updateBankRecord = function (req, res, next) {
    var args = req.swagger.params;

    /**
     * Update an existing Bank
     * 
     *
     * body Bank Bank object that needs to be added to the store
     * no response value expected for this operation
     **/
    res.end();
}