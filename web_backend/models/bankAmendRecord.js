"use strict";

module.exports = function (sequelize, DataTypes) {
  var BankAmendRecord = sequelize.define("BankAmendRecord", {
    AFNo: DataTypes.STRING,
    lcNo: DataTypes.STRING,   
    amendNo: DataTypes.STRING,
    step: DataTypes.STRING,
    state: DataTypes.INTEGER,
    userID: DataTypes.STRING,
    userName: DataTypes.STRING,
    isAgreed: DataTypes.STRING,
    suggestion: DataTypes.STRING,
    backup: DataTypes.STRING,
  });

  return BankAmendRecord;
};