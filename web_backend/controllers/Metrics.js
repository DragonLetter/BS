'use strict';

var url = require('url');
var Metrics = require('./MetricsService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.getMetrcsByBankId = function getMetrcsByBankId(req, res, next) {
  belogger.info("getMetrcsByBankId");
  Metrics.getMetrcsByBankId(req, res, next);
};

module.exports.getNetworkMetrics = function getNetworkMetrics(req, res, next) {
  belogger.info("getNetworkMetrics");
  Metrics.getNetworkMetrics(req, res, next);
};
