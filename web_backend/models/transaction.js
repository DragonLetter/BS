"use strict";

module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define("Transaction", {
    channelname: DataTypes.STRING,
    blockid: DataTypes.INTEGER,
    txhash: DataTypes.STRING,
    createdt: DataTypes.INTEGER,
    chaincodename: DataTypes.DATE,
  });
 
  return Transaction;
};
