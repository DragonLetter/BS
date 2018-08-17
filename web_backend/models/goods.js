"use strict";

module.exports = function (sequelize, DataTypes) {
  var Goods = sequelize.define("Goods", {
    GoodsNo: DataTypes.STRING,
    AllowPartialShipment: DataTypes.INTEGER,
    AllowTransShipment: DataTypes.INTEGER,
    LatestShipmentDate: DataTypes.DATE,
    ShippingWay: DataTypes.INTEGER,
    ShippingPlace: DataTypes.STRING,
    ShippingDestination: DataTypes.STRING,
    TradeNature: DataTypes.INTEGER,
    GoodsDescription: DataTypes.STRING,
  });

  return Goods;
};
