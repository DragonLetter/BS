'use strict';

var url = require('url');
var Certificate = require('./CertificateService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.cancelCertificateApply = function cancelCertificateApply(req, res, next) {
  belogger.info("cancelCertificateApply");
  Certificate.cancelCertificateApply(req, res, next);
};

module.exports.cancelCertificateEnroll = function cancelCertificateEnroll(req, res, next) {
  belogger.info("cancelCertificateEnroll");
  Certificate.cancelCertificateEnroll(req, res, next);
};

module.exports.certificateApply = function certificateApply(req, res, next) {
  belogger.info("certificateApply");
  Certificate.certificateApply(req, res, next);
};

module.exports.certificatePublish = function certificatePublish(req, res, next) {
  belogger.info("certificatePublish");
  Certificate.certificatePublish(req, res, next);
};

module.exports.certificateRevoke = function certificateRevoke(req, res, next) {
  belogger.info("certificateRevoke");
  Certificate.certificateRevoke(req, res, next);
};

module.exports.confirmCertificateApply = function confirmCertificateApply(req, res, next) {
  belogger.info("confirmCertificateApply");
  Certificate.confirmCertificateApply(req, res, next);
};

module.exports.confirmCertificateEnroll = function confirmCertificateEnroll(req, res, next) {
  belogger.info("confirmCertificateEnroll");
  Certificate.confirmCertificateEnroll(req, res, next);
};

module.exports.enrollCertificate = function enrollCertificate(req, res, next) {
  belogger.info("enrollCertificate");
  Certificate.enrollCertificate(req, res, next);
};

module.exports.queryCertificateApplyState = function queryCertificateApplyState(req, res, next) {
  belogger.info("queryCertificateApplyState");
  Certificate.queryCertificateApplyState(req, res, next);
};

module.exports.queryCertificateEnrollState = function queryCertificateEnrollState(req, res, next) {
  belogger.info("queryCertificateEnrollState");
  Certificate.queryCertificateEnrollState(req, res, next);
};

module.exports.getCertificateState = function getCertificateState(req, res, next) {
  belogger.info("getCertificateState");
  Certificate.getCertificateState(req, res, next);
};