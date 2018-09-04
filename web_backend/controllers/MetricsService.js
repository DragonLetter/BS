'use strict';
var fabric = require("../fabric");
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

/**
 * 获取指定银行的关键业务指标
 * 
 *
 * bankId String 
 * returns Metrics
 **/
exports.getMetrcsByBankId = function (req, res, next) { 
    var LCNumbers = 0;
    var LCAmount = 0.0;
    var Customers = 0;
    var args=req.swagger.params;
    var bankId = args.bankId.value;
    fabric.query(req, "getLcListByBankId", [bankId], function (err, resp) {
        if(resp == null || resp.result == null) {
            res.status(405).end();
        } else {
            var resultObj=JSON.parse(resp.result);
            LCNumbers = resultObj.length;
            for(var i=0;i<resultObj.length;i++){
                LCAmount = LCAmount + parseFloat(resultObj[i].Record.LetterOfCredit.amount);
            }
            var examples = {};
            examples['application/json'] = {
              "StartDate" : "-",
              "no" : "-",
              "bankId" : bankId,
              "AverageAmount" : LCAmount/LCNumbers,
              "Customers" : LCNumbers,
              "LCAmount" : LCAmount,
              "Currency" : "RMB",
              "LCNumbers" : LCNumbers,
              "EndDate" : "-"
          };
          if (Object.keys(examples).length > 0) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
          } else {
              res.end();
          }
        }
    });
}

/**
 * 获取整个网络的交易量级业务指标
 * 
 *
 * returns Metrics
 **/
exports.getNetworkMetrics = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + args);

    res.end();
}

