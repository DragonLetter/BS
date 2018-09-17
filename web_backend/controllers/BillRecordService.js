'use strict';

const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

var models = require('../models');
var Sequelize = require("sequelize");

exports.updateBillState = function (req, res, next) {
    var args = req.swagger.params;
    Logger.debug("args:" + inspect(args));
  
    models.BillState.update(args.body.value,
      {
        'where': { 'AFNo': args.body.value.AFNo, 'No': args.body.value.No }
      }
    ).then(function (data) {
      Logger.debug("update resp:" + data);
      if (data[0] == 0) {
        Logger.debug("unknown bill");
        res.end(JSON.stringify("unknown bill"));
      } else if (data[0] == 1) {
        Logger.debug("true");
        res.end(JSON.stringify("true"));
      } else {
        Logger.debug("false");
        res.end(JSON.stringify("false"));
      }
    }).catch(function (e) {
      Logger.error("Exception:" + e);
    })
  };
  
  exports.getBillState = function (req, res, next) {
    var args = req.swagger.params;
    Logger.debug("args:" + inspect(args));
    models.BillState.findOne({
      'where': {
        'AFNo': args.body.value.AFNo,
        'No': args.body.value.No
      }
    }).then(function (data) {
      if (data) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data.dataValues || {}, null, 2));
      }else{
        var dbVal;
        dbVal = {
            "AFNo": args.body.value.AFNo,
            "No": args.body.value.No,
            "step": 'IssuingBankCheckBillStep',
            "state": '11',
            "suggestion": ' ',
            "accAmount":' ',
            "isAgreet": ' '
        };
        models.BillState.create(dbVal).then(function (val) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(dbVal || {}, null, 2));
        });
      }
    });
};
//以下接口为backend内部使用，不提供给上层使用
exports.addBillStateRecord = function (req, res, next) {
    var args = req.swagger.params;
    var userID = req.session.user.id;
    var userName = req.session.user.username;
    var values = args.body.value;

    Logger.debug("updateAFStateRecord:" + inspect(args));

    var dbVal;
    dbVal = {
        "AFNo": values.AFNo,
        "No": values.No,
        "step": values.step,
        "userID": userID,
        "userName": userName,
        "isAgreed": values.isAgreed,
        "suggestion": values.suggestion,
        "accAmount": values.accAmount
    };

    Logger.debug("addBillStateRecord: Add record:" + JSON.stringify(dbVal));
    console.log(JSON.stringify(dbVal));
    /**
     * Add a new operation record to the db
     **/
    models.BillRecord.create(dbVal).then(function (data) {
        Logger.debug("addBillStateRecord: resp:" + JSON.stringify(data));
    });
};  
exports.addBillRecord = function(req, res, next) {
    var args = req.swagger.params;
    Logger.debug("Add a new Bill record:" + inspect(args));

    /**
     * Add a new operation record to the db
     **/
    models.BillRecord.create(args.body.value).then(function (data) {
        res.end();
    });
};
exports.getBillRecords = function(req, res, next) {
    var args = req.swagger.params;
    var AFNo = args.AFNo.value;
    Logger.debug("get all Bill records:" + inspect(args));
    models.BillRecord.findAll({
        'where': {
            'AFNo': AFNo,
        }
    }).then(function (billRecords) {
        if (Object.keys(billRecords).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(billRecords));
        } else {
            res.end();
        }
    });
};
exports.updateBillRecord = function(req, res, next) {
    var args = req.swagger.params;
    var AFNo = args.AFNo.value;
    res.end();
};