"use strict";

module.exports = function (sequelize, DataTypes) {
  var BankRecord = sequelize.define("BankRecord", {
    AFNo: DataTypes.STRING,
    lcNo: DataTypes.STRING,
    step: DataTypes.STRING,
    userID: DataTypes.STRING,
    userName: DataTypes.STRING,
    isAgreed: DataTypes.STRING,
    suggestion: DataTypes.STRING,
    depositAmount: DataTypes.STRING
  });

  return BankRecord;
};