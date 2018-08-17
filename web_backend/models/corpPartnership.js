"use strict";

module.exports = function (sequelize, DataTypes) {
  var CorpPartnership = sequelize.define("CorpPartnership", {
    hostCorpId: DataTypes.INTEGER,
    corporationId: DataTypes.INTEGER,
    contact: DataTypes.STRING,
    email: DataTypes.STRING,
    creationTime: DataTypes.STRING,
  });

  return CorpPartnership;
};
