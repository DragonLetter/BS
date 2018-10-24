'use strict';
var models = require('../models');
var crypto = require('crypto');
var keyHelper = require("../keyhelper");
var pdf = require('html-pdf');
var fs = require('fs');
var fileServer = require('../utils/fileServer');
var uuid = require('node-uuid');
var validator = require('validator');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

exports.downloadFile = function (req, res, next) {
  var args = req.swagger.params;

  Logger.debug("args:" + inspect(args));

  /**
   * 根据文件Hash获得文件内容
   * 
   *
   * fileHash String 文件的Hash值
   * no response value expected for this operation
   **/
  models.Document.findOne({ where: { hash: args.fileHash.value } })
    .then(result => {
      var doc = result.dataValues;
      res.setHeader('Content-Type', doc.mime);
      res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(doc.fileName));
      res.setHeader("Content-Length", doc.length);
      res.send(doc.content);
      res.end();
    });
}

exports.uploadFile = function (req, res, next) {
  /**
   * 上传一个文档，返回文档的Hash值、长度等内容
   * 
   *
   * additionalMetadata String Additional data to pass to server (optional)
   * file File file to upload (optional)
   * returns DocResponse
   **/
  var args = req.swagger.params;

  Logger.debug("args:" + inspect(args));

  var content = args.file.value.buffer;
  var fileSize = args.file.value.size;
  var oriFileName = args.file.value.originalname;
  // var uniqFileName = uuid.v1() + "-" + oriFileName;
  var mime = args.file.value.mimetype;
  var sign = crypto.createSign('RSA-SHA256');
  sign.update(content);
  var privateKey = keyHelper.getPrivateKey(req);
  var signture = sign.sign(privateKey);
  var currentUser = req.session.user;
  var fileType = args.type.value;

  // 上传到文件服务器
  fileServer.uploadFileStream(fileType, content.toJSON(content).data.toString(), oriFileName, function (respFileServer) {
    Logger.debug(respFileServer);
    if (!validator.isJSON(respFileServer)){
      Logger.warn("Not JSON string");
      res.setHeader('Content-Type', 'application/json');
      res.status(404).end();
      return;
    }
    var valResp = JSON.parse(respFileServer);
    if (valResp.success == 1) {
      var resp = {
        // "id": 1,
        "fileName": oriFileName,
        "mime": mime,
        "length": fileSize,
        "fileHash": "0",
        "signature": Buffer.from(signture).toString("hex"),
        "dirName": valResp.result
      };
      if (currentUser != undefined) {
        resp.uploader = currentUser.username;
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(resp));
    }
  });

  // getCertificateId(req).then(certId => {
  // var doc = {
  //   "fileName": fileName,
  //   "mime": mime,
  //   "length": fileSize,
  //   "content": content,
  //   "hash": hash,
  //   "signature": Buffer.from(signture).toString("hex"),
  //   "certId": 1 //certId
  // };
  // models.Document.create(doc).then(function (data) {
  //   var result = {
  //     "id": data.id,
  //     "fileName": fileName,
  //     "mime": mime,
  //     "length": fileSize,
  //     "fileHash": hash,
  //     "signature": data.signature
  //   };
  //   if (currentUser != undefined) {
  //     result.uploader = currentUser.username;
  //   }

  //   res.setHeader('Content-Type', 'application/json');
  //   res.end(JSON.stringify(result));
  // });
  // });
}

function getCertificateId(req) {
  var cert = keyHelper.getCertificate(req);
  var findResult = models.Certificate.findOne({ where: { certificate: cert } })
    .then(result => {
      var row = result.dataValues;
      if (row) {
        return row.id;
      }
      else {
        Logger.error("根据当前用户的证书无法在UserCertificate中找到对应的ID");
      }
    });
  return findResult;
}

exports.transHtml2Pdf = function (req, res, next) {
  return res.end();
  var args = req.swagger.params;
  var value = args.body.value;
  var options = { format: true };

  Logger.debug("args:" + inspect(args));

  pdf.create(value.data.toString(), options).toBuffer(function (err, buffer) {
    if (err) return console.log(err);
    res.setHeader('Content-Type', 'application/json');
    var vals = { "pdf": buffer };
    res.end(JSON.stringify(vals));
  });
};

exports.TransFData = function (req, res, next) {
  var args = req.swagger.params;
  var options = { format: true };
  var content = args.body.data;

  Logger.debug("args:" + inspect(args));

  pdf.create(content, options).toBuffer(function (err, buffer) {
    if (err) return console.log(err);
    res.setHeader('Content-Type', 'application/json');
    var vals = { "data": buffer };
    res.end(JSON.stringify(vals));
  });
};

exports.getTransFData = function (req, res, next) {
  var path = require('path');
  var args = req.swagger.params;
  var filename = args.FileName.value;
  // var content = args.body.data;
  var options = { format: true };
  var filePath = path.resolve(__dirname, '../pdf/');

  Logger.debug("args:" + inspect(args));

  fs.readFile(filePath + '/' + filename, 'utf8', function (err, files) {
    Logger.debug(filePath + '/' + filename);
    res.setHeader('Content-Type', 'application/json');
    var vals = { "data": files };
    res.end(JSON.stringify(vals));
  });
};
