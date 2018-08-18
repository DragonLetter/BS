'use strict';

var url = require('url');

var Document = require('./DocumentService');

module.exports.downloadFile = function downloadFile (req, res, next) {
  Document.downloadFile(req, res, next);
};

module.exports.uploadFile = function uploadFile (req, res, next) {
  Document.uploadFile(req, res, next);
};

module.exports.transHtml2Pdf = function transHtml2Pdf(req, res, next){
  Document.transHtml2Pdf(req, res, next);
}