'use strict';
var models  = require('../models');
var Sequelize=require("sequelize");
var log4js = require("log4js");
var path = require('path');
var NodeCache = require( "node-cache" );
var logger = log4js.getLogger();
var keyHelper=require("../keyhelper");
var options  = require(path.join(__dirname, '..', 'config', 'fabric.json'));
exports.createUser = function (req, res, next) { var args=req.swagger.params;
  /**
   * Create user
   * This can only be done by the logged in user.
   *
   * body User Created user object
   * no response value expected for this operation
   **/

   var hashPwd=keyHelper.hashPassword(args.body.value.username,args.body.value.password);
  models.User.create({
    'username': args.body.value.username,
    'firstName': args.body.value.firstName,
    'lastName': args.body.value.lastName,
    'email': args.body.value.email,
    'password': hashPwd,
    'phone': args.body.value.phone,
    'domain': args.body.value.domain,
    'userStatus': args.body.value.userStatus
  }).then(function(data){
    res.end(JSON.stringify("true"));
  }).catch(function(e){
    logger.info(e);
    if(e.name.indexOf("SequelizeUniqueConstraintError") != -1){
      res.end(JSON.stringify("registed username"));
    }
  });
  var argbank = args.body.value.bank;
  if(argbank)
  {
    models.Bank.create({
      'name':  argbank.name,
      'domain': argbank.domain,
      'no': argbank.no,
      'address': argbank.address,
      'remark': argbank.remark
    }).then(function(data){
      res.end(JSON.stringify("true"));
    }).catch(function(e){
      logger.info(e);
      if(e.name.indexOf("SequelizeUniqueConstraintError") != -1){
        res.end(JSON.stringify("registed bank"));
      }
    });
  }
}

exports.createUsersWithArrayInput = function (req, res, next) { var args=req.swagger.params;
  /**
   * Creates list of users with given input array
   * 
   *
   * body List List of user object
   * no response value expected for this operation
   **/
  logger.info("trace args");
//  models.User.bulkCreate(JSON.stringify(args.body.value));
  models.User.bulkCreate(args.body.value);
  res.end(JSON.stringify("true"));
}

exports.createUsersWithListInput = function (req, res, next) { var args=req.swagger.params;
  /**
   * Creates list of users with given input array
   * 
   *
   * body List List of user object
   * no response value expected for this operation
   **/
  res.end();
}

exports.deleteUser = function (req, res, next) { var args=req.swagger.params;
  /**
   * Delete user
   * This can only be done by the logged in user.
   *
   * username String The name that needs to be deleted
   * no response value expected for this operation
   **/
  models.User.destroy({
    where: {username: args.username.value}
  }).then(function(data){
    if(data == 0){
      console.log('unknown user');
      res.end(JSON.stringify("unknown user"));
    }else if(data >= 1){
      console.log('delete user ok');
      res.end(JSON.stringify("true"));
    }else{
      console.log('false');
      res.end(JSON.stringify("false"));
    }
  });
}

exports.getUserByName = function (req, res, next) { var args=req.swagger.params;
  /**
   * Get user by user name
   * 
   *
   * username String The name that needs to be fetched. Use user1 for testing. 
   * returns User
   **/
  var examples = {};
  examples['application/json'] = {
  "firstName" : "unknown",
  "lastName" : "unknown",
  "password" : "unknown",
  "userStatus" : -1,
  "phone" : "unknown",
  "id" : -1,
  "email" : "unknown",
  "username" : "unknown"
};
  models.User.findOne({
    'where': {
        'username': args.username.value,
    }
  }).then(function(data){
    if(data == null){
      if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
        res.end(JSON.stringify("true"));
      }
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data.dataValues || {}, null, 2));
    }
  });
  
  
}


exports.appLoginUser = function (req, res, next) { var args=req.swagger.params;
 
  const myCache = new NodeCache();
  myCache.set(args.body.value.userName , args.body.value.privateKey, 10000 );
  res.end();
}

exports.loginUser = function(req, res, next) {
  /**
   * Logs user into the system
   * 
   *
   * username String The user name for login
   * password String The password for login in clear text
   * returns String
   **/
  var args=req.swagger.params;
  var hashPwd=keyHelper.hashPassword(args.body.value.userName,args.body.value.password);
  models.User.findOne({
    'where': {
        'username': args.body.value.userName,
        'password': hashPwd
    }
  }).then(
    function(data){
      if(data == null){
        console.log('unknown user');
        res.status(400).end("Invalid username/password supplied");
      }
      else{
        if(data.dataValues.userStatus == 0){
          console.log('registed user');
          req.session.user =data.dataValues;//将当前用户基本信息放入Session中。
          req.session.username=data.dataValues.username;

          var option=options[data.dataValues.username];  
          req.session.key = option.privateKey;// "privateKey": "-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgfMFCvZHd5FZomo6w\r\n1I2oR9o6rmYUSuMG68RAt3nub0ihRANCAAR4WkR7juBjAKYm07XJkNzRnhmTz9As\r\n7rS8SrcAxExOr1AYu4204z3iEqOlkgJAqJxGJWbShyFOWfiryJnBHBpj\r\n-----END PRIVATE KEY-----\r\n";
          req.session.cert= option.cert;// "cert":"-----BEGIN CERTIFICATE-----\r\nMIICFDCCAbqgAwIBAgIRAOa8NeHBQvO/x2kc8HPHHkMwCgYIKoZIzj0EAwIwbzEL\r\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\r\ncmFuY2lzY28xFzAVBgNVBAoTDkIxLmV4YW1wbGUuY29tMRowGAYDVQQDExFjYS5C\r\nMS5leGFtcGxlLmNvbTAeFw0xODA2MjkwNzEzNDdaFw0yODA2MjYwNzEzNDdaMFkx\r\nCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4g\r\nRnJhbmNpc2NvMR0wGwYDVQQDDBRBZG1pbkBCMS5leGFtcGxlLmNvbTBZMBMGByqG\r\nSM49AgEGCCqGSM49AwEHA0IABHhaRHuO4GMApibTtcmQ3NGeGZPP0CzutLxKtwDE\r\nTE6vUBi7jbTjPeISo6WSAkConEYlZtKHIU5Z+KvImcEcGmOjTTBLMA4GA1UdDwEB\r\n/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIM/0jc/xCYXYsrmdX3QM\r\nxMj88sPSpyd30a8Hho11IfGtMAoGCCqGSM49BAMCA0gAMEUCIQCMaOv0UdRZ0z7m\r\nnrQeIGSsSW1a07ZijkARTih5th/+OQIgRaWVFFBvJ0EZnz7xZxQiLruyXfUe4t9e\r\nIZzE/m4xUyI=\r\n-----END CERTIFICATE-----\r\n";
        
        
          res.end(JSON.stringify("true"));
        }
        else{
          console.log('invalid user');
          res.end(JSON.stringify("invalid user"));
        }
      }
    }
  ).catch(
    function (e) {
      console.error(e); 
      throw e;
    }
  );
}

exports.logoutUser = function (req, res, next) { var args=req.swagger.params;
  req.session.destroy();
  res.end(JSON.stringify("true"));
}

exports.updateUser = function (req, res, next) { var args=req.swagger.params;
  /**
   * Updated user
   * This can only be done by the logged in user.
   *
   * username String name that need to be updated
   * body User Updated user object
   * no response value expected for this operation
   **/
  models.User.update(args.body.value,
    {
      'where': {'username': args.username.value}
    }
  ).then(function(data){
    console.log(data);
    if(data[0] == 0){
      console.log('unknown user');
      res.end(JSON.stringify("unknown user"));
    }else if(data[0] == 1){
      console.log('true');
      res.end(JSON.stringify("true"));
    }else{
      console.log('false');
      res.end(JSON.stringify("false"));
    }
  }).catch(function(e){
    console.log(e);
  })
}


exports.getAllUsers = function (req, res, next) { var args=req.swagger.params;
  models.User.findAll().then(function(data){
    var result=[];
    for(var i=0;i<data.length;i++){
      var user=dbUser2ViewUser(data[i]);
      result.push(user);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  });
}
function dbUser2ViewUser(dbUser){
  return {
    "id": dbUser.id,
  "username": dbUser.username,
  "firstName": dbUser.firstName,
  "lastName": dbUser.lastName,
  "email": dbUser.email,
  "phone": dbUser.phone,
  "domain":dbUser.domain,
  "userStatus": dbUser.userStatus}
}


exports.getCurrentUser = function (req, res, next) { var args=req.swagger.params;
 var u= args.sessionUser;
 if(!u){
   res.status(401).send("please login first!");
 }
 else{
  res.setHeader('Content-Type', 'application/json');
  var user=dbUser2ViewUser(u);
  var bankQuery=models.Bank.findOne({
    'where': {
        'domain': user.domain
    }
  });
  var corpQuery=models.Corporation.findOne({
      'where': {
          'domain': user.domain
      }
  });
  Promise.all([bankQuery,corpQuery]).then(function([bank,corp]){
    if(bank){
      user.bank=bank;
    }
    if(corp){
      user.corp=corp;
    }
    res.end(JSON.stringify(user));
  });
  }
}