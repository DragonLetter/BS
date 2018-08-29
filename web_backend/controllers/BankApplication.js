'use strict';

var url = require('url');
var ApplicationService = require('./BankApplicationService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.applicationAudit = function applicationAudit(req, res, next) {
  belogger.info("applicationAudit");
  ApplicationService.applicationAudit(req, res, next);
};

module.exports.getApplicationById = function getApplicationById(req, res, next) {
  belogger.info("getApplicationById");
  ApplicationService.getApplicationById(req, res, next);
};
