'use strict';

var url = require('url');
var CorpPartnership = require('./CorpPartnershipService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.addCorpPartnership = function addCorpPartnership(req, res, next) {
  belogger.info("addCorpPartnership");
  CorpPartnership.addCorpPartnership(req, res, next);
};

module.exports.deleteCorpPartnership = function deleteCorpPartnership(req, res, next) {
  belogger.info("deleteCorpPartnership");
  CorpPartnership.deleteCorpPartnership(req, res, next);
};

module.exports.getCorpPartnershipById = function getCorpPartnershipById(req, res, next) {
  belogger.info("getCorpPartnershipById");
  CorpPartnership.getCorpPartnershipById(req, res, next);
};

module.exports.updateCorpPartnership = function updateCorpPartnership(req, res, next) {
  belogger.info("updateCorpPartnership");
  CorpPartnership.updateCorpPartnership(req, res, next);
};
