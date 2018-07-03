'use strict';

var url = require('url');

var Corporation = require('./CorporationService');

module.exports.addCorporation = function addCorporation (req, res, next) {
  Corporation.addCorporation(req, res, next);
};

module.exports.deleteCorporation = function deleteCorporation (req, res, next) {
  Corporation.deleteCorporation(req, res, next);
};

module.exports.findCorporationsByName = function findCorporationsByName (req, res, next) {
  Corporation.findCorporationsByName(req, res, next);
};

module.exports.getCorporationById = function getCorporationById (req, res, next) {
  Corporation.getCorporationById(req, res, next);
};

module.exports.getCorporations = function getCorporations (req, res, next) {
  Corporation.getCorporations(req, res, next);
};

module.exports.updateCorporation = function updateCorporation (req, res, next) {
  Corporation.updateCorporation(req, res, next);
};
