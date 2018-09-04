'use strict';

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
    var args = req.swagger.params;
    var examples = {};
    examples['application/json'] = {
        "StartDate": "-",
        "no": "-",
        "bankId": "icbc1",
        "AverageAmount": "10.12",
        "Customers": 50,
        "LCAmount": "1,103.08",
        "Currency": "RMB",
        "LCNumbers": 109,
        "EndDate": "-"
    };

    Logger.debug("args:" + args);

    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
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

