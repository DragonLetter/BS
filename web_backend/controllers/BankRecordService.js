'use strict';

const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

var models = require('../models');
var Sequelize = require("sequelize");

function addBankRecord(req, res, next) {
    var args = req.swagger.params;
    Logger.debug("Add a new bank record:" + inspect(args));

    /**
     * Add a new operation record to the db
     **/
    models.BankRecord.create(args.body.value).then(function (data) {
        getBankRecordByLcNo(req, res, next);
    });
};
exports.addBankRecord = addBankRecord;

function deleteBankRecordByLcNo(req, res, next) {
    var args = req.swagger.params;
    var lcID = args.LcNo.value;

    Logger.debug("Delete a bank record:" + inspect(args));

    models.BankRecord.destroy({ where: { Id: lcID }, truncate: false });

    res.end();
};
exports.deleteBankRecordByLcNo = deleteBankRecordByLcNo;

function getBankRecordByLcNo(req, res, next) {
    var args = req.swagger.params;
    var lcNo = args.lcNo.value;

    Logger.debug("Get a bank record:" + inspect(args));

    models.BankRecord.findAll({
        'where': {
            'lcNo': lcNo,
        }
    }).then(function (bankRecords) {
        if (Object.keys(bankRecords).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(bankRecords));
        } else {
            res.end();
        }
    });
};
exports.getBankRecordByLcNo = getBankRecordByLcNo;

function updateBankRecord(req, res, next) {
    var args = req.swagger.params;
    Logger.debug("Update a bank record:" + inspect(args));

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

    Logger.debug("updateAFStateRecord:" + inspect(args));

    var dbVal;
    dbVal = {
        "AFNo": values.AFNo,
        "lcNo": values.lcNo,
        "step": values.step,
        "userID": userID,
        "userName": userName,
        "isAgreed": values.isAgreed,
        "suggestion": values.suggestion,
        "depositAmount": values.depositAmount
    };

    Logger.debug("updateAFStateRecord: Add record:" + JSON.stringify(dbVal));

    /**
     * Add a new operation record to the db
     **/
    models.BankRecord.create(dbVal).then(function (data) {
        Logger.debug("updateAFStateRecord: resp:" + JSON.stringify(data));
    });
};