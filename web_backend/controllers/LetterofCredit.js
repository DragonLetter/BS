'use strict';

var url = require('url');
var LetterofCredit = require('./LetterofCreditService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.lcAmendation = function lcAmendation(req, res, next) {
  belogger.info("lcAmendation");
  LetterofCredit.lcAmendation(req, res, next);
};

module.exports.retireShippingBills = function retireShippingBills(req, res, next) {
  belogger.info("retireShippingBills");
  LetterofCredit.retireShippingBills(req, res, next);
};

module.exports.lcDeposit = function lcDeposit(req, res, next) {
  belogger.info("lcDeposit");
  LetterofCredit.lcDeposit(req, res, next);
};

module.exports.beneficiaryHandleLCNotice = function beneficiaryHandleLCNotice(req, res, next) {
  belogger.info("beneficiaryHandleLCNotice");
  LetterofCredit.beneficiaryHandleLCNotice(req, res, next);
}

module.exports.beneficiaryHandoverBills = function beneficiaryHandoverBills(req, res, next) {
  belogger.info("beneficiaryHandoverBills");
  LetterofCredit.beneficiaryHandoverBills(req, res, next);
}