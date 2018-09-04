'use strict';

var url = require('url');
var User = require('./UserService');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

module.exports.createUser = function createUser(req, res, next) {
  Logger.info("createUser");
  User.createUser(req, res, next);
};

module.exports.umCreate = function umCreate(req, res, next) {
  Logger.info("umCreate");
  User.umCreate(req, res, next);
};

module.exports.umUpdate = function umUpdate(req, res, next) {
  Logger.info("umUpdate");
  User.umUpdate(req, res, next);
};

module.exports.umDelete = function umDelete(req, res, next) {
  Logger.info("umDelete");
  User.umDelete(req, res, next);
};

module.exports.getUMUsers = function getUMUsers(req, res, next) {
  Logger.info("getUMUsers");
  User.getUMUsers(req, res, next);
};

module.exports.createUsersWithArrayInput = function createUsersWithArrayInput(req, res, next) {
  Logger.info("createUsersWithArrayInput");
  User.createUsersWithArrayInput(req, res, next);
};

module.exports.createUsersWithListInput = function createUsersWithListInput(req, res, next) {
  Logger.info("createUsersWithListInput");
  User.createUsersWithListInput(req, res, next);
};

module.exports.deleteUser = function deleteUser(req, res, next) {
  Logger.info("deleteUser");
  User.deleteUser(req, res, next);
};

module.exports.getUserByName = function getUserByName(req, res, next) {
  Logger.info("getUserByName");
  User.getUserByName(req, res, next);
};

module.exports.loginUser = function loginUser(req, res, next) {
  Logger.info("loginUser");
  User.loginUser(req, res, next);
};

module.exports.appLoginUser = function appLoginUser(req, res, next) {
  Logger.info("appLoginUser");
  User.appLoginUser(req, res, next);
};

module.exports.logoutUser = function logoutUser(req, res, next) {
  Logger.info("logoutUser");
  User.logoutUser(req, res, next);
};

module.exports.updateUser = function updateUser(req, res, next) {
  Logger.info("updateUser");
  User.updateUser(req, res, next);
};

module.exports.getAllUsers = function getAllUsers(req, res, next) {
  Logger.info("getAllUsers");
  User.getAllUsers(req, res, next);
};

module.exports.getCurrentUser = function getCurrentUser(req, res, next) {
  Logger.info("getCurrentUser");
  var sessionUser = req.session.user;
  req.swagger.params.sessionUser = sessionUser;
  User.getCurrentUser(req, res, next);
};
