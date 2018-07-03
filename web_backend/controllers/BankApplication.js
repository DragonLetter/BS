'use strict';

var url = require('url');

var ApplicationService = require('./BankApplicationService');

module.exports.applicationAudit = function applicationAudit (req, res, next) {
  ApplicationService.applicationAudit(req, res, next);
};

module.exports.getApplicationById = function getApplicationById (req, res, next) {
  ApplicationService.getApplicationById(req, res, next);
};
