"use strict";

module.exports = function (sequelize, DataTypes) {
  var Corporation = sequelize.define("Corporation", {
    name: DataTypes.STRING,
    domain: DataTypes.STRING,
    no: DataTypes.STRING,
    nation: DataTypes.STRING,
    contact: DataTypes.STRING,
    email: DataTypes.STRING,
    account: DataTypes.STRING,
    depositBank: DataTypes.STRING,
    address: DataTypes.STRING,
    creationTime: DataTypes.DATE,
  });

  return Corporation;
};
