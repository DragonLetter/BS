"use strict";

module.exports = function (sequelize, DataTypes) {
  var EntitySequence = sequelize.define("EntitySequence", {
    entityName: DataTypes.STRING,
    sequenceNumber: DataTypes.INTEGER
  });

  return EntitySequence;
};
