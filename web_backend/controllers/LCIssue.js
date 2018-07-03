'use strict';

var url = require('url');

var LCIssue = require('./LCIssueService');

module.exports.corporationConfirmDraft = function corporationConfirmDraft (req, res, next) {
  LCIssue.corporationConfirmDraft(req, res, next);
};

module.exports.getLCIssueByLcNo = function getLCIssueByLcNo (req, res, next) {
  LCIssue.getLCIssueByLcNo(req, res, next);
};

module.exports.lCIssueEdit = function lCIssueEdit (req, res, next) {
  LCIssue.lCIssueEdit(req, res, next);
};

module.exports.surrenderDocuments = function surrenderDocuments (req, res, next) {
  LCIssue.surrenderDocuments(req, res, next);
};
