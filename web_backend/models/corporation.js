"use strict";

module.exports = function(sequelize, DataTypes) {
  var Corporation = sequelize.define("Corporation", {
    name: DataTypes.STRING,
    domain: DataTypes.STRING,
    nation:DataTypes.STRING,
    contact:DataTypes.STRING,
    email:DataTypes.STRING,
    account:DataTypes.STRING,
    depositBank:DataTypes.STRING,
    address:DataTypes.STRING,
    postcode:DataTypes.STRING,
    telephone:DataTypes.STRING,
    telefax:DataTypes.STRING,
    creationTime:DataTypes.DATE,
  });
 
  return Corporation;
};
