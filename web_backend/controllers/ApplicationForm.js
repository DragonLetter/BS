'use strict';

var url = require('url');

var ApplicationForm = require('./ApplicationFormService');
var BankRecordService = require('./BankRecordService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.addApplicationForm = function addApplicationForm(req, res, next) {
  belogger.info("operation for addApplicationForm");
  ApplicationForm.addApplicationForm(req, res, next);
};

module.exports.addFile = function addFile(req, res, next) {
  belogger.info("operation for addFile");
  ApplicationForm.addFile(req, res, next);
};

module.exports.deleteApplicationForm = function deleteApplicationForm(req, res, next) {
  belogger.info("operation for deleteApplicationForm");
  ApplicationForm.deleteApplicationForm(req, res, next);
};

module.exports.findApplicationFormsByBank = function findApplicationFormsByBank(req, res, next) {
  belogger.info("operation for findApplicationFormsByBank");
  ApplicationForm.findApplicationFormsByBank(req, res, next);
};

module.exports.findApplicationFormsByCorp = function findApplicationFormsByCorp(req, res, next) {
  belogger.info("operation for findApplicationFormsByCorp");
  ApplicationForm.findApplicationFormsByCorp(req, res, next);
};

module.exports.findApplicationFormsByMyBank = function findApplicationFormsByMyBank(req, res, next) {
  belogger.info("operation for findApplicationFormsByMyBank");
  ApplicationForm.findApplicationFormsByMyBank(req, res, next);
};

module.exports.findApplicationFormsByMyCorp = function findApplicationFormsByMyCorp(req, res, next) {
  belogger.info("operation for findApplicationFormsByMyCorp");
  ApplicationForm.findApplicationFormsByMyCorp(req, res, next);
};

module.exports.getApplicationFormById = function getApplicationFormById(req, res, next) {
  belogger.info("operation for getApplicationFormById");
  ApplicationForm.getApplicationFormById(req, res, next);
};

module.exports.getApplicationForms = function getApplicationForms(req, res, next) {
  belogger.info("operation for getApplicationForms");
  ApplicationForm.getApplicationForms(req, res, next);
};

module.exports.updateApplicationForm = function updateApplicationForm(req, res, next) {
  belogger.info("operation for updateApplicationForm");
  ApplicationForm.updateApplicationForm(req, res, next);
};

module.exports.submitApplicationForm = function submitApplicationForm(req, res, next) {
  belogger.info("operation for submitApplicationForm");
  ApplicationForm.submitApplicationForm(req, res, next);
};

module.exports.confirmApplicationForm = function submitApplicationForm(req, res, next) {
  belogger.info("operation for confirmApplicationForm");
  ApplicationForm.confirmApplicationForm(req, res, next);
};

module.exports.getAFState = function getAFState(req, res, next) {
  belogger.info("operation for getAFState");
  ApplicationForm.getAFState(req, res, next);
};
module.exports.updateAFState = function updateAFState(req, res, next) {
  belogger.info("operation for updateAFState");
  ApplicationForm.updateAFState(req, res, next);
  BankRecordService.updateAFStateRecord(req, res, next);
};