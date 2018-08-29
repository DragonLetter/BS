'use strict';

const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

var models = require('../models');
var Sequelize = require("sequelize");

function addBankRecord(req, res, next) {
    var args = req.swagger.params;
    belogger.debug("Add a new bank record:" + args);

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

    belogger.debug("Delete a bank record:" + args);

    models.BankRecord.destroy({ where: { Id: lcID }, truncate: false });

    res.end();
};
exports.deleteBankRecordByLcNo = deleteBankRecordByLcNo;

function getBankRecordByLcNo(req, res, next) {
    var args = req.swagger.params;
    var lcNo = args.lcNo.value;

    belogger.debug("Get a bank record:" + args);

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
    belogger.debug("Update a bank record:" + args);

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

    belogger.debug("updateAFStateRecord:" + JSON.stringify(args));

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

    belogger.debug("updateAFStateRecord: Add record:" + JSON.stringify(dbVal));

    /**
     * Add a new operation record to the db
     **/
    models.BankRecord.create(dbVal).then(function (data) {
        belogger.debug("updateAFStateRecord: resp:" + JSON.stringify(data));
    });
};