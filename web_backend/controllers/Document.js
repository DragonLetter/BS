'use strict';

var Document = require('./DocumentService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.downloadFile = function downloadFile(req, res, next) {
  Logger.info("downloadFile");
  Document.downloadFile(req, res, next);
};

module.exports.uploadFile = function uploadFile(req, res, next) {
  Logger.info("uploadFile");
  Document.uploadFile(req, res, next);
};

module.exports.TransFData = function TransFData(req, res, next) {
  Logger.info("TransFData");
  Document.TransFData(req, res, next);
};

module.exports.getTransFData = function getTransFData(req, res, next) {
  Logger.info("getTransFData");
  Document.getTransFData(req, res, next);
};