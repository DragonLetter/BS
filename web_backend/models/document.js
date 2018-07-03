"use strict";

module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define("Document", {
    fileName: DataTypes.STRING,
    mime:DataTypes.STRING,
    length:DataTypes.INTEGER,
    content:DataTypes.BLOB,
    hash:DataTypes.STRING,
    signature:DataTypes.STRING,
    certId:DataTypes.INTEGER//哪个用户证书上传的，便于对签名进行验证
  });

 
  return Document;
};
