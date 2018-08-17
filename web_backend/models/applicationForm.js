"use strict";

module.exports = function (sequelize, DataTypes) {
  var ApplicationForm = sequelize.define("ApplicationForm", {
    lcNo: DataTypes.STRING,
    applyCorp: DataTypes.STRING,
    sendBank: DataTypes.STRING,
    recvBank: DataTypes.STRING,
    benefCorp: DataTypes.STRING,
    amount: DataTypes.STRING,
    state: DataTypes.STRING,
    GoodsInfo: DataTypes.STRING,
    ExpiryDate: DataTypes.DATE,
    ExpiryPlace: DataTypes.STRING,
    IsAtSight: DataTypes.INTEGER,
    AfterSight: DataTypes.FLOAT,
    DocumentRequire: DataTypes.INTEGER,
    Currency: DataTypes.STRING,
    OtherRequire: DataTypes.INTEGER,
    ChargeInIssueBank: DataTypes.INTEGER,
    ChargeOutIssueBank: DataTypes.INTEGER,
    DocDelay: DataTypes.FLOAT,
    Contract: DataTypes.STRING,
    Attachments: DataTypes.STRING,
  });

  return ApplicationForm;
};
