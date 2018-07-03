'use strict';

var url = require('url');

var User = require('./UserService');

module.exports.createUser = function createUser (req, res, next) {
  User.createUser(req, res, next);
};

module.exports.createUsersWithArrayInput = function createUsersWithArrayInput (req, res, next) {
  User.createUsersWithArrayInput(req, res, next);
};

module.exports.createUsersWithListInput = function createUsersWithListInput (req, res, next) {
  User.createUsersWithListInput(req, res, next);
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  User.deleteUser(req, res, next);
};

module.exports.getUserByName = function getUserByName (req, res, next) {
  User.getUserByName(req, res, next);
};

module.exports.loginUser = function loginUser (req, res, next) {
  User.loginUser(req, res, next);
};
module.exports.appLoginUser = function appLoginUser (req, res, next) {
  User.appLoginUser(req, res, next);
};


module.exports.logoutUser = function logoutUser (req, res, next) {
  User.logoutUser(req, res, next);
};

module.exports.updateUser = function updateUser (req, res, next) {
  User.updateUser(req, res, next);
};

module.exports.getAllUsers = function getAllUsers (req, res, next) {
  User.getAllUsers(req, res, next);
};
module.exports.getCurrentUser = function getCurrentUser (req, res, next) {
  var sessionUser= req.session.user;
  req.swagger.params.sessionUser=sessionUser;
  User.getCurrentUser(req, res, next);
};
