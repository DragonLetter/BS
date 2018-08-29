'use strict';

var url = require('url');
var LCIssue = require('./LCIssueService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.corporationConfirmDraft = function corporationConfirmDraft(req, res, next) {
  belogger.info("corporationConfirmDraft");
  LCIssue.corporationConfirmDraft(req, res, next);
};

module.exports.getLCIssueByLcNo = function getLCIssueByLcNo(req, res, next) {
  belogger.info("getLCIssueByLcNo");
  LCIssue.getLCIssueByLcNo(req, res, next);
};

module.exports.lCIssueEdit = function lCIssueEdit(req, res, next) {
  belogger.info("lCIssueEdit");
  LCIssue.lCIssueEdit(req, res, next);
};

module.exports.surrenderDocuments = function surrenderDocuments(req, res, next) {
  belogger.info("surrenderDocuments");
  LCIssue.surrenderDocuments(req, res, next);
};
