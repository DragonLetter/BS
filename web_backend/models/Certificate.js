"use strict";

module.exports = function (sequelize, DataTypes) {
  var Certificate = sequelize.define("Certificate", {
    companyName: DataTypes.STRING,
    businessLicense: DataTypes.STRING,
    businessEntity: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    csr: DataTypes.STRING,
    applySerialNumber: DataTypes.STRING,
    enrollSerialNumber: DataTypes.STRING,
    certificate: DataTypes.STRING,
    enrollState: DataTypes.INTEGER,
    applyState: DataTypes.INTEGER,
    certificateState: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  });

  return Certificate;
};