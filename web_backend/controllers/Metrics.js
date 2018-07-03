'use strict';

var url = require('url');

var Metrics = require('./MetricsService');

module.exports.getMetrcsByBankId = function getMetrcsByBankId (req, res, next) {
  Metrics.getMetrcsByBankId(req, res, next);
};

module.exports.getNetworkMetrics = function getNetworkMetrics (req, res, next) {
  Metrics.getNetworkMetrics(req, res, next);
};
