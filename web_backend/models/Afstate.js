"use strict";

module.exports = function (sequelize, DataTypes) {
  var Afstate = sequelize.define("Afstate", {
    AFNo: DataTypes.STRING,
    step: DataTypes.STRING,
    state: DataTypes.INTEGER,
    lcNo: DataTypes.STRING,
    depositAmount: DataTypes.STRING,
    suggestion: DataTypes.STRING,
    isAgreed: DataTypes.STRING,
    backup: DataTypes.STRING,
  });

  return Afstate;
};