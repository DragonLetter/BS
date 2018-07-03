'use strict';

var url = require('url');

var LetterofCredit = require('./LetterofCreditService');

module.exports.lcAmendation = function lcAmendation (req, res, next) {
  LetterofCredit.lcAmendation(req, res, next);
};

module.exports.retireShippingBills = function retireShippingBills (req, res, next) {
  LetterofCredit.retireShippingBills(req, res, next);
};

module.exports.lcDeposit = function lcDeposit (req, res, next) {
  LetterofCredit.lcDeposit(req, res, next);
};

module.exports.beneficiaryHandleLCNotice = function beneficiaryHandleLCNotice(req, res, next){
  LetterofCredit.beneficiaryHandleLCNotice(req, res, next);
}

module.exports.beneficiaryHandoverBills = function beneficiaryHandoverBills(req, res, next){
  LetterofCredit.beneficiaryHandoverBills(req, res, next);
}