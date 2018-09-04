'use strict';

var url = require('url');
var LCIssue = require('./LCIssueService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.corporationConfirmDraft = function corporationConfirmDraft(req, res, next) {
  Logger.info("corporationConfirmDraft");
  LCIssue.corporationConfirmDraft(req, res, next);
};

module.exports.getLCIssueByLcNo = function getLCIssueByLcNo(req, res, next) {
  Logger.info("getLCIssueByLcNo");
  LCIssue.getLCIssueByLcNo(req, res, next);
};

module.exports.lCIssueEdit = function lCIssueEdit(req, res, next) {
  Logger.info("lCIssueEdit");
  LCIssue.lCIssueEdit(req, res, next);
};

module.exports.surrenderDocuments = function surrenderDocuments(req, res, next) {
  Logger.info("surrenderDocuments");
  LCIssue.surrenderDocuments(req, res, next);
};
