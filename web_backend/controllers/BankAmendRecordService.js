'use strict';

const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

var models = require('../models');
var Sequelize = require("sequelize");

//以下接口为backend内部使用，不提供给上层使用
exports.addBankAmendRecord = function (req, res, next) {
    var args = req.swagger.params;
    Logger.debug("Add a new bank amend record:" + inspect(args));

    /**
     * Add a new operation record to the db
     **/
    models.BankAmendRecord.create(args.body.value).then(function (data) {
        res.end();
    });
};

exports.getBankAmendRecords = function (req, res, next) {
    var args = req.swagger.params;
    var AFNo = args.AFNo.value;
    Logger.debug("get all bank amend records:" + inspect(args));
    models.BankAmendRecord.findAll({
        'where': {
            'AFNo': AFNo,
        }
    }).then(function (bankAmendRecords) {
        if (Object.keys(bankAmendRecords).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(bankAmendRecords));
        } else {
            res.end();
        }
    });
};

exports.updateBankAmendRecord = function (req, res, next) {
    var args = req.swagger.params;
    var AFNo = args.AFNo.value;
    res.end();
};

//以下接口为backend内部使用，不提供给上层使用
exports.updateAmendStateRecord = function (req, res, next) {
    var args = req.swagger.params;
    var userID = req.session.user.id;
    var userName = req.session.user.username;
    var values = args.body.value;

    Logger.debug("updateAmendStateRecord:" + inspect(args));

    var dbVal;
    dbVal = {
        "AFNo": values.AFNo,
        "lcNo": values.lcNo,
        "amendNo": values.amendNo,
        "step": values.step,
        "state": values.state,
        "userID": userID,
        "userName": userName,
        "isAgreed": values.isAgreed,
        "suggestion": values.suggestion,
        "backup": values.backup
    };

    Logger.debug("updateAmendStateRecord: Add record:" + JSON.stringify(dbVal));

    /**
     * Add a new operation record to the db
     **/
    models.BankAmendRecord.create(dbVal).then(function (data) {
        Logger.debug("updateAmendStateRecord: resp:" + JSON.stringify(data));
    });
};