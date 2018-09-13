"use strict";

module.exports = function (sequelize, DataTypes) {
  var BillState = sequelize.define("BillState", {
    AFNo: DataTypes.STRING,
    step: DataTypes.STRING,
    state: DataTypes.INTEGER,
    No: DataTypes.STRING,
    accAmount: DataTypes.STRING,
    suggestion: DataTypes.STRING,
    isAgreed: DataTypes.STRING,
  });

  return BillState;
};