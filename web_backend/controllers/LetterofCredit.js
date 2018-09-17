'use strict';

var LetterofCredit = require('./LetterofCreditService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.lcAmendation = function lcAmendation(req, res, next) {
  Logger.info("lcAmendation");
  LetterofCredit.lcAmendation(req, res, next);
};

module.exports.retireShippingBills = function retireShippingBills(req, res, next) {
  Logger.info("retireShippingBills");
  LetterofCredit.retireShippingBills(req, res, next);
};

module.exports.lcDeposit = function lcDeposit(req, res, next) {
  Logger.info("lcDeposit");
  LetterofCredit.lcDeposit(req, res, next);
};

module.exports.beneficiaryHandleLCNotice = function beneficiaryHandleLCNotice(req, res, next) {
  Logger.info("beneficiaryHandleLCNotice");
  LetterofCredit.beneficiaryHandleLCNotice(req, res, next);
}

module.exports.beneficiaryHandoverBills = function beneficiaryHandoverBills(req, res, next) {
  Logger.info("beneficiaryHandoverBills");
  LetterofCredit.beneficiaryHandoverBills(req, res, next);
}

module.exports.appliciantCheckBills = function appliciantCheckBills(req, res, next) {
  Logger.info("appliciantCheckBills");
  LetterofCredit.appliciantCheckBills(req, res, next);
}

module.exports.beneficiaryOfAmendHandle = function beneficiaryOfAmendHandle(req, res, next) {
  Logger.info("beneficiaryOfAmendHandle");
  LetterofCredit.beneficiaryOfAmendHandle(req, res, next);
}
