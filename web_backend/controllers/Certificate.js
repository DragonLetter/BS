'use strict';

var url = require('url');


var Certificate = require('./CertificateService');


module.exports.cancelCertificateApply = function cancelCertificateApply (req, res, next) {
  Certificate.cancelCertificateApply(req, res, next);
};

module.exports.cancelCertificateEnroll = function cancelCertificateEnroll (req, res, next) {
  Certificate.cancelCertificateEnroll(req, res, next);
};

module.exports.certificateApply = function certificateApply (req, res, next) {
  Certificate.certificateApply(req, res, next);
};

module.exports.certificatePublish = function certificatePublish (req, res, next) {
  Certificate.certificatePublish(req, res, next);
};

module.exports.certificateRevoke = function certificateRevoke (req, res, next) {
  Certificate.certificateRevoke(req, res, next);
};

module.exports.confirmCertificateApply = function confirmCertificateApply (req, res, next) {
  Certificate.confirmCertificateApply(req, res, next);
};

module.exports.confirmCertificateEnroll = function confirmCertificateEnroll (req, res, next) {
  Certificate.confirmCertificateEnroll(req, res, next);
};

module.exports.enrollCertificate = function enrollCertificate (req, res, next) {
  Certificate.enrollCertificate(req, res, next);
};

module.exports.queryCertificateApplyState = function queryCertificateApplyState (req, res, next) {
  Certificate.queryCertificateApplyState(req, res, next);
};

module.exports.queryCertificateEnrollState = function queryCertificateEnrollState (req, res, next) {
  Certificate.queryCertificateEnrollState(req, res, next);
};

module.exports.getCertificateState = function getCertificateState (req, res, next) {
  Certificate.getCertificateState(req, res, next);
};