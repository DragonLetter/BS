"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    domain:DataTypes.STRING,
    contact:DataTypes.STRING,
    email:DataTypes.STRING,
    password:DataTypes.STRING,
    phone:DataTypes.STRING,
    userStatus:DataTypes.INTEGER,
    userType:DataTypes.INTEGER,
    causername: DataTypes.STRING,
  });

 
  return User;
};