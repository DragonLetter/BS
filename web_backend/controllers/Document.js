'use strict';

var url = require('url');

var Document = require('./DocumentService');

module.exports.downloadFile = function downloadFile (req, res, next) {
  Document.downloadFile(req, res, next);
};

module.exports.uploadFile = function uploadFile (req, res, next) {
  Document.uploadFile(req, res, next);
};

module.exports.TransFData = function TransFData(req, res, next){
  Document.TransFData(req, res, next);
};

module.exports.getTransFData = function getTransFData(req, res, next){
  Document.getTransFData(req, res, next);
};