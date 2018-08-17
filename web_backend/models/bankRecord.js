"use strict";

module.exports = function (sequelize, DataTypes) {
  var BankRecord = sequelize.define("Bank", {
    AFNo: DataTypes.STRING,
    LcNo: DataTypes.STRING,
    step: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    isAgreed: DataTypes.BOOLEAN,
    suggestion: DataTypes.STRING,
    depositAmount: DataTypes.STRING
  });

  return BankRecord;
};