'use strict';

var url = require('url');
var Corporation = require('./CorporationService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.addCorporation = function addCorporation(req, res, next) {
  belogger.info("addCorporation");
  Corporation.addCorporation(req, res, next);
};

module.exports.deleteCorporation = function deleteCorporation(req, res, next) {
  belogger.info("deleteCorporation");
  Corporation.deleteCorporation(req, res, next);
};

module.exports.findCorporationsByName = function findCorporationsByName(req, res, next) {
  belogger.info("findCorporationsByName");
  Corporation.findCorporationsByName(req, res, next);
};

module.exports.getCorporationById = function getCorporationById(req, res, next) {
  belogger.info("getCorporationById");
  Corporation.getCorporationById(req, res, next);
};

module.exports.getCorporations = function getCorporations(req, res, next) {
  belogger.info("getCorporations");
  Corporation.getCorporations(req, res, next);
};

module.exports.updateCorporation = function updateCorporation(req, res, next) {
  belogger.info("updateCorporation");
  Corporation.updateCorporation(req, res, next);
};
