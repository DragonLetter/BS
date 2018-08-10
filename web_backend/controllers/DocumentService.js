'use strict';
var models = require('../models');
var Sequelize = require("sequelize");
var crypto = require('crypto');
var keyHelper=require("../keyhelper");
exports.downloadFile = function (req, res, next) { var args=req.swagger.params;
  /**
   * 根据文件Hash获得文件内容
   * 
   *
   * fileHash String 文件的Hash值
   * no response value expected for this operation
   **/
  models.Document.findOne( { where: {hash: args.fileHash.value} })
  .then(result=>{
    var doc=result.dataValues;
    res.setHeader('Content-Type', doc.mime);
    res.setHeader("Content-Disposition","attachment;filename="+encodeURI(doc.fileName));
    res.setHeader("Content-Length",doc.length);
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
  var args=req.swagger.params;
  var content = args.file.value.buffer;
  var fileSize = args.file.value.size;
  var fileName = args.file.value.originalname;
  var mime = args.file.value.mimetype;
  var md5sum = crypto.createHash("md5");
  md5sum.update(content);
  var hash=md5sum.digest("hex");
  var sign = crypto.createSign('RSA-SHA256');
  sign.update(content);
  var privateKey = keyHelper.getPrivateKey(req);
  var signture =sign.sign(privateKey);
  var currentUser=req.session.user;
  getCertificateId(req).then(certId=>{
  var doc = {
    "fileName": fileName,
    "mime": mime,
    "length": fileSize,
    "content": content,
    "hash":hash,
    "signature":Buffer.from( signture).toString("hex"),
    "certId":certId
  };
  models.Document.create(doc).then(function (data) {
    var result = {
      "id":data.id,
      "fileName": fileName,
      "mime": mime,
      "length": fileSize,
      "fileHash": hash,
      "signature":data.signature
    };
    if(currentUser!=undefined){
      result.uploader=currentUser.username;
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
});
}

function getCertificateId(req)
{
  var cert= keyHelper.getCertificate(req);

  var findResult= models.Certificate.findOne( { where: {certificate: cert} })
  .then(result=>{
    var row=result.dataValues;
    if(row){
      return row.id;
    }
    else{
      console.error("根据当前用户的证书无法在UserCertificate中找到对应的ID");
    }
  });
   return findResult;
}

// function md5(str) {
//   var md5sum = crypto.createHash("md5");
//   md5sum.update(str);
//   str = md5sum.digest("hex");
//   return str;
// };
