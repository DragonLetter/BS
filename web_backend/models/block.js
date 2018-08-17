"use strict";

module.exports = function (sequelize, DataTypes) {
  var Block = sequelize.define("Block", {
    blockNum: DataTypes.INTEGER,
    datahash: DataTypes.STRING,
    prehash: DataTypes.STRING,
    channelname: DataTypes.STRING,
    txcount: DataTypes.INTEGER,
  });

  return Block;
};
