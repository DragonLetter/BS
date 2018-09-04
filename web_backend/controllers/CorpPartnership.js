'use strict';

var CorpPartnership = require('./CorpPartnershipService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.addCorpPartnership = function addCorpPartnership(req, res, next) {
  Logger.info("addCorpPartnership");
  CorpPartnership.addCorpPartnership(req, res, next);
};

module.exports.deleteCorpPartnership = function deleteCorpPartnership(req, res, next) {
  Logger.info("deleteCorpPartnership");
  CorpPartnership.deleteCorpPartnership(req, res, next);
};

module.exports.getCorpPartnershipById = function getCorpPartnershipById(req, res, next) {
  Logger.info("getCorpPartnershipById");
  CorpPartnership.getCorpPartnershipById(req, res, next);
};

module.exports.updateCorpPartnership = function updateCorpPartnership(req, res, next) {
  Logger.info("updateCorpPartnership");
  CorpPartnership.updateCorpPartnership(req, res, next);
};
