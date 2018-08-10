"use strict";

module.exports = function(sequelize, DataTypes) {
  var ApplicationForm = sequelize.define("ApplicationForm", {
    lcNo: DataTypes.STRING,
    applyCorp:DataTypes.STRING,
    sendBank:DataTypes.STRING,
    recvBank:DataTypes.STRING,
    benefCorp:DataTypes.STRING,
    amount:DataTypes.STRING,
    state:DataTypes.STRING,
  });

 
  return ApplicationForm;
};
