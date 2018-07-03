'use strict';

var url = require('url');

var CorpPartnership = require('./CorpPartnershipService');

module.exports.addCorpPartnership = function addCorpPartnership (req, res, next) {
  CorpPartnership.addCorpPartnership(req, res, next);
};

module.exports.deleteCorpPartnership = function deleteCorpPartnership (req, res, next) {
  CorpPartnership.deleteCorpPartnership(req, res, next);
};

module.exports.getCorpPartnershipById = function getCorpPartnershipById (req, res, next) {
  CorpPartnership.getCorpPartnershipById(req, res, next);
};

module.exports.updateCorpPartnership = function updateCorpPartnership (req, res, next) {
  CorpPartnership.updateCorpPartnership(req, res, next);
};
