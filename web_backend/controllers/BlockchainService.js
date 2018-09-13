'use strict';
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

exports.getConsensusByTransId = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + inspect(args));

  /**
   * 获取指定交易的共识状态
   * 
   *
   * transId String 
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [{
    "no": "aeiou",
    "applStatus": "aeiou",
    "IBStatus": "aeiou",
    "advisingBankId": "aeiou",
    "ABStatus": "aeiou",
    "issuingBankId": "aeiou",
    "applicantId": "aeiou",
    "benefStatus": "aeiou",
    "transactionId": "aeiou",
    "beneficiaryId": "aeiou"
  }];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

