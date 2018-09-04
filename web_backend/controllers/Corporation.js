'use strict';

var Corporation = require('./CorporationService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.addCorporation = function addCorporation(req, res, next) {
  Logger.info("addCorporation");
  Corporation.addCorporation(req, res, next);
};

module.exports.deleteCorporation = function deleteCorporation(req, res, next) {
  Logger.info("deleteCorporation");
  Corporation.deleteCorporation(req, res, next);
};

module.exports.findCorporationsByName = function findCorporationsByName(req, res, next) {
  Logger.info("findCorporationsByName");
  Corporation.findCorporationsByName(req, res, next);
};

module.exports.getCorporationById = function getCorporationById(req, res, next) {
  Logger.info("getCorporationById");
  Corporation.getCorporationById(req, res, next);
};

module.exports.getCorporations = function getCorporations(req, res, next) {
  Logger.info("getCorporations");
  Corporation.getCorporations(req, res, next);
};

module.exports.updateCorporation = function updateCorporation(req, res, next) {
  Logger.info("updateCorporation");
  Corporation.updateCorporation(req, res, next);
};
