'use strict';

var url = require('url');
var Certificate = require('./CertificateService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.cancelCertificateApply = function cancelCertificateApply(req, res, next) {
  Logger.info("cancelCertificateApply");
  Certificate.cancelCertificateApply(req, res, next);
};

module.exports.cancelCertificateEnroll = function cancelCertificateEnroll(req, res, next) {
  Logger.info("cancelCertificateEnroll");
  Certificate.cancelCertificateEnroll(req, res, next);
};

module.exports.certificateApply = function certificateApply(req, res, next) {
  Logger.info("certificateApply");
  Certificate.certificateApply(req, res, next);
};

module.exports.certificatePublish = function certificatePublish(req, res, next) {
  Logger.info("certificatePublish");
  Certificate.certificatePublish(req, res, next);
};

module.exports.certificateRevoke = function certificateRevoke(req, res, next) {
  Logger.info("certificateRevoke");
  Certificate.certificateRevoke(req, res, next);
};

module.exports.confirmCertificateApply = function confirmCertificateApply(req, res, next) {
  Logger.info("confirmCertificateApply");
  Certificate.confirmCertificateApply(req, res, next);
};

module.exports.confirmCertificateEnroll = function confirmCertificateEnroll(req, res, next) {
  Logger.info("confirmCertificateEnroll");
  Certificate.confirmCertificateEnroll(req, res, next);
};

module.exports.enrollCertificate = function enrollCertificate(req, res, next) {
  Logger.info("enrollCertificate");
  Certificate.enrollCertificate(req, res, next);
};

module.exports.queryCertificateApplyState = function queryCertificateApplyState(req, res, next) {
  Logger.info("queryCertificateApplyState");
  Certificate.queryCertificateApplyState(req, res, next);
};

module.exports.queryCertificateEnrollState = function queryCertificateEnrollState(req, res, next) {
  Logger.info("queryCertificateEnrollState");
  Certificate.queryCertificateEnrollState(req, res, next);
};

module.exports.getCertificateState = function getCertificateState(req, res, next) {
  Logger.info("getCertificateState");
  Certificate.getCertificateState(req, res, next);
};