"use strict";

module.exports = function (sequelize, DataTypes) {
  var BankRecord = sequelize.define("Bank", {
    AFNo: DataTypes.STRING,
    LcNo: DataTypes.STRING,
    step: DataTypes.STRING,
    userID: DataTypes.STRING,
    userName: DataTypes.STRING,
    isAgreed: DataTypes.STRING,
    suggestion: DataTypes.STRING,
    depositAmount: DataTypes.STRING
  });

  return BankRecord;
};