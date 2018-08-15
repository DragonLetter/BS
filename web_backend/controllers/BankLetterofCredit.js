'use strict';

var url = require('url');

var LetterofCreditService = require('./BankLetterofCreditService');

// 开证行：正式开立信用证，共识，并发送通知给网络参与方（开证 or 拒绝）
module.exports.bankIssuing = function bankIssuing (req, res, next) {
  LetterofCreditService.bankIssuing(req, res, next);
};

// 通知行：审核并签名共识（同意通知 or 拒绝通知）
module.exports.advisingBankAudit = function advisingBankAudit (req, res, next) {
  LetterofCreditService.advisingBankAudit(req, res, next);
};

// 开证行、通知行、受益人同意通知或者拒绝信用证正本修改
module.exports.amendCountersign = function lCAmendation (req, res, next) {
  LetterofCreditService.amendCountersign(req, res, next);
};

// 通知行：确认交单
module.exports.advisingBankDocsReceivedAudit = function advisingBankDocsReceivedAudit (req, res, next) {
  LetterofCreditService.advisingBankDocsReceivedAudit(req, res, next);
};

// 开证行：办理交单（拒绝之后，不符点修改）
module.exports.issuingBankDocsReceivedAudit = function issuingBankDocsReceivedAudit (req, res, next) {
  LetterofCreditService.issuingBankDocsReceivedAudit(req, res, next);
};

// 开证行：承兑或者拒付
module.exports.acceptancePayment = function acceptancePayment (req, res, next) {
  LetterofCreditService.acceptancePayment(req, res, next);
};

// 开证行：闭卷
module.exports.LCClosing = function LCClosing (req, res, next) {
  LetterofCreditService.LCClosing(req, res, next);
};

module.exports.issuingBankReviseRetire = function issuingBankReviseRetire ( req, res, next){
  LetterofCreditService.issuingBankReviseRetire(req, res, next);
}