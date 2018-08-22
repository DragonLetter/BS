'use strict';

var models = require('../models');
var Sequelize = require("sequelize");

function addBankRecord(req, res, next) {
    var args = req.swagger.params;
    console.log("Try to save a new bank");
    console.log(args);

    /**
     * Add a new operation record to the db
     **/
    models.BankRecord.create(args.body.value).then(function (data) {
        getBankRecordByLcNo(args, res, next);
    });
};
exports.addBankRecord = addBankRecord;

function deleteBankRecordByLcNo(req, res, next) {
    var args = req.swagger.params;
    var lcID = args.LcNo.value;
    models.BankRecord.destroy({ where: { Id: lcID }, truncate: false });

    res.end();
};
exports.deleteBankRecordByLcNo = deleteBankRecordByLcNo;

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
};
exports.getBankRecordByLcNo = getBankRecordByLcNo;

function updateBankRecord(req, res, next) {
    var args = req.swagger.params;

    /**
     * Update an existing Bank
     * 
     *
     * body Bank Bank object that needs to be added to the store
     * no response value expected for this operation
     **/
    res.end();
};
exports.updateBankRecord = updateBankRecord;

//以下接口为backend内部使用，不提供给上层使用
exports.updateAFStateRecord = function (req, res, next) {
    var args = req.swagger.params;
    var userID = req.session.user.id;
    var userName = req.session.user.username;
    var values = args.body.value;

    var dbVal;
    dbVal.AFNo = values.AFNo;
    dbVal.LcNo = values.lcNo;
    dbVal.step = values.step;
    dbVal.userID = userID;
    dbVal.userName = userName;
    dbVal.isAgreed = values.isAgreed;
    dbVal.suggestion = values.suggestion;
    dbVal.depositAmount = values.depositAmount;

    /**
     * Add a new operation record to the db
     **/
    models.BankRecord.create(dbVal).then(function (data) {
        console.log('Add record:' + dbVal);
    });
};