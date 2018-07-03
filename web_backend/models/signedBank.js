"use strict";

var Bank  = require('./bank');
var Corporation = require('./corporation')

module.exports = function(sequelize, DataTypes) {
  var SignedBank = sequelize.define("SignedBank", {
    corporationId: DataTypes.INTEGER,
    bankId:DataTypes.INTEGER,
    address:DataTypes.STRING,
    accountNo:DataTypes.INTEGER,
    accountName:DataTypes.STRING,
    remark:DataTypes.STRING,
    state:DataTypes.INTEGER,
  });
 
  return SignedBank;
};
