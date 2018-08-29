'use strict';

var url = require('url');
var Document = require('./DocumentService');
const log4js = require('../utils/log4js');
const belogger = log4js.getLogger('be');

module.exports.downloadFile = function downloadFile(req, res, next) {
  belogger.info("downloadFile");
  Document.downloadFile(req, res, next);
};

module.exports.uploadFile = function uploadFile(req, res, next) {
  belogger.info("uploadFile");
  Document.uploadFile(req, res, next);
};

module.exports.TransFData = function TransFData(req, res, next) {
  belogger.info("TransFData");
  Document.TransFData(req, res, next);
};

module.exports.getTransFData = function getTransFData(req, res, next) {
  belogger.info("getTransFData");
  Document.getTransFData(req, res, next);
};