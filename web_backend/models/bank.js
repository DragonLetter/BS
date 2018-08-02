"use strict";

module.exports = function(sequelize, DataTypes) {
  var Bank = sequelize.define("Bank", {
    name: DataTypes.STRING,
    domain:DataTypes.STRING,
    no:DataTypes.STRING,
    address:DataTypes.STRING,
    postcode:DataTypes.STRING,
    telephone:DataTypes.STRING,
    telefax:DataTypes.STRING,
    remark:DataTypes.STRING,
  });

 
  return Bank;
};
