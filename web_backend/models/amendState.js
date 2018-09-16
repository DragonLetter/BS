"use strict";

module.exports = function (sequelize, DataTypes) {
  var AmendState = sequelize.define("AmendState", {
    AFNo: DataTypes.STRING,
    amendNo: DataTypes.STRING,
    step: DataTypes.STRING,
    state: DataTypes.INTEGER,
    lcNo: DataTypes.STRING,   
    suggestion: DataTypes.STRING,
    isAgreed: DataTypes.STRING,
    backup: DataTypes.STRING,
  });

  return AmendState;
};