"use strict";

module.exports = function (sequelize, DataTypes) {
  var BillRecord = sequelize.define("BillRecord", {
    AFNo: DataTypes.STRING,
    No: DataTypes.STRING,
    step: DataTypes.STRING,
    userID: DataTypes.STRING,
    userName: DataTypes.STRING,
    isAgreed: DataTypes.STRING,
    suggestion: DataTypes.STRING,
    accAmount: DataTypes.STRING
  });

  return BillRecord;
};