'use strict';

var url = require('url');

var ApplicationForm = require('./ApplicationFormService');

module.exports.addApplicationForm = function addApplicationForm (req, res, next) {
  ApplicationForm.addApplicationForm(req, res, next);
};

module.exports.addFile = function addFile (req, res, next) {
  ApplicationForm.addFile(req, res, next);
};

module.exports.deleteApplicationForm = function deleteApplicationForm (req, res, next) {
  ApplicationForm.deleteApplicationForm(req, res, next);
};

module.exports.findApplicationFormsByBank = function findApplicationFormsByBank (req, res, next) {
  ApplicationForm.findApplicationFormsByBank(req, res, next);
};

module.exports.findApplicationFormsByCorp = function findApplicationFormsByCorp (req, res, next) {
  ApplicationForm.findApplicationFormsByCorp(req, res, next);
};

module.exports.findApplicationFormsByMyBank = function findApplicationFormsByMyBank (req, res, next) {
  ApplicationForm.findApplicationFormsByMyBank(req, res, next);
};

module.exports.findApplicationFormsByMyCorp = function findApplicationFormsByMyCorp (req, res, next) {
  ApplicationForm.findApplicationFormsByMyCorp(req, res, next);
};

module.exports.getApplicationFormById = function getApplicationFormById (req, res, next) {
  ApplicationForm.getApplicationFormById(req, res, next);
};

module.exports.getApplicationForms = function getApplicationForms (req, res, next) {
  ApplicationForm.getApplicationForms(req, res, next);
};

module.exports.updateApplicationForm = function updateApplicationForm (req, res, next) {
  ApplicationForm.updateApplicationForm(req, res, next);
};

module.exports.submitApplicationForm = function submitApplicationForm (req, res, next) {
  ApplicationForm.submitApplicationForm(req, res, next);
};

module.exports.confirmApplicationForm = function submitApplicationForm (req, res, next) {
    ApplicationForm.confirmApplicationForm(req, res, next);
};

module.exports.getAFState = function getAFState (req, res, next) {
  ApplicationForm.getAFState(req, res, next);
};
module.exports.updateAFState = function updateAFState (req, res, next) {
  ApplicationForm.updateAFState(req, res, next);
};