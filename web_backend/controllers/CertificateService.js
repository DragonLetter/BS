'use strict';
var models  = require('../models');
var Sequelize=require("sequelize");
var log4js = require("log4js");
var logger = log4js.getLogger();
var r = require('jsrsasign');
var copService = require('fabric-ca-client/lib/FabricCAClientImpl.js');
var Client = require('fabric-client');
var path      = require("path");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'dbconfig.json'))[env];
var nodeConf  = require(path.join(__dirname, '../config/nodeconf.json'));

if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL,config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

exports.cancelCertificateApply = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * applySerialNumber (String)
  **/
  var crt = {
    'applyState': 2
  };
  models.Certificate.update(crt,
    {
      'where': {
        'applySerialNumber': args.applySerialNumber.originalValue,
        'applyState': {$ne: 1}
      }
    }
  ).then(function(data){
    console.log(data);
    if(data[0] == 0){
      console.log('unknown applySerialNumber or the apply is confirmed');
      res.end(JSON.stringify("unknown applySerialNumber or the apply is confirmed"));
    }else if(data[0] == 1){
      console.log('true');
      res.end(JSON.stringify("true"));
    }else{
      console.log('false');
      res.end(JSON.stringify("false"));
    }
  }).catch(function(e){
    console.log(e);
  });
}

exports.cancelCertificateEnroll = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * enrollSerialNumber (String)
  **/
  var crt = {
    'enrollState': 2
  };
  models.Certificate.update(crt,
    {
      'where': {
        'enrollSerialNumber': args.enrollSerialNumber.originalValue,
        'applyState': 1,
        'enrollState': 0
      }
    }
  ).then(function(data){
    console.log(data);
    if(data[0] == 0){
      console.log('unknown enrollSerialNumber or a finished enroll item');
      res.end(JSON.stringify("unknown enrollSerialNumber or a finished enroll item"));
    }else if(data[0] == 1){
      console.log('true');
      res.end(JSON.stringify("true"));
    }else{
      console.log('false');
      res.end(JSON.stringify("false"));
    }
  }).catch(function(e){
    console.log(e);
  }); 
}

exports.certificateApply = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * body (CertificateApply)
  **/
  
  var mac = new r.KJUR.crypto.Mac({alg: "HmacSHA1", "pass": "pass"}); //pass设置密码
  mac.updateString(JSON.stringify(args.body.value)+Date.now());
  var macHex = mac.doFinal();
  args.body.value.applySerialNumber=macHex;
  sequelize.query("INSERT INTO `Certificates` (`companyName`,`businessLicense`,`businessEntity`,`contactNumber`,`csr`,`applySerialNumber`,`userId`) VALUES (\'"+args.body.value.companyName+"\',\'"+args.body.value.businessLicense+"\',\'"+args.body.value.businessEntity+"\',\'"+args.body.value.contactNumber+"\',\'"+args.body.value.csr+"\',\'"+args.body.value.applySerialNumber+"\',"+args.body.value.userId+")").spread(function(sql1, sql2){
    console.log("log info");
    res.end("applySerialNumber:"+args.body.value.applySerialNumber);
    });
  /*
  models.Certificate.create(args.body.value).then(function(data){
    res.end("applySerialNumber:"+args.body.value.applySerialNumber);
  }).catch(function(e){
    logger.info(e);
    if(e.name.indexOf("SequelizeUniqueConstraintError") != -1){
      res.end(JSON.stringify("have the same apply item"));
    }
  });
  */
}

exports.certificatePublish = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * enrollSerialNumber (String)
  **/
  models.Certificate.findOne({
    'where': {
      'enrollSerialNumber': args.enrollSerialNumber.originalValue,
      'enrollState': 1
    }
  }).then(
    function(data){
      if(data == null){
        console.log('invaild request');
        res.end(JSON.stringify("invaild request"));
      }
      else{
        res.end("certificate:"+data.dataValues.certificate);
      }
    }
  ).catch(
    function (e) {
      console.error(e); 
      throw e;
    }
  );
  
}

exports.certificateRevoke = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * enrollSerialNumber (String)
  **/
  var crt = {
    'certificateState': 2
  };
  models.Certificate.update(crt,
    {
      'where': {
        'enrollSerialNumber': args.enrollSerialNumber.originalValue,
        'certificateState': 1
      }
    }
  ).then(function(data){
    console.log(data);
    if(data[0] == 0){
      console.log('invalid request');
      res.end(JSON.stringify("invalid request"));
    }else if(data[0] == 1){
      console.log('true');
      res.end(JSON.stringify("true"));
    }else{
      console.log('false');
      res.end(JSON.stringify("false"));
    }
  }).catch(function(e){
    console.log(e);
  });
}

exports.confirmCertificateApply = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * applySerialNumber (String)
  **/
  var crt = {
    'applyState': 1
  };
  models.Certificate.update(crt,
    {
      'where': {
        'applySerialNumber': args.applySerialNumber.originalValue,
        'applyState': {$ne: 2}
      }
    }
  ).then(function(data){
    console.log(data);
    if(data[0] == 0){
      console.log('unknown applySerialNumber or a cancel apply');
      res.end(JSON.stringify("unknown applySerialNumber or a cancel apply"));
    }else if(data[0] == 1){
      console.log('true');
      res.end(JSON.stringify("true"));
    }else{
      console.log('false');
      res.end(JSON.stringify("false"));
    }
  }).catch(function(e){
    console.log(e);
  });
}

exports.confirmCertificateEnroll = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * enrollSerialNumber (String)
  **/
  var crt = {
    'enrollState': 1,
    'certificate': args.certificate.originalValue
  };
  models.Certificate.update(crt,
    {
      'where': {
        'enrollSerialNumber': args.enrollSerialNumber.originalValue,
        'applyState': 1,
        'enrollState': 0
      }
    }
  ).then(function(data){
    console.log(data);
    if(data[0] == 0){
      console.log('unknown enrollSerialNumber or a cancel enroll');
      res.end(JSON.stringify("unknown enrollSerialNumber or a cancel enroll"));
    }else if(data[0] == 1){
      console.log('true');
      res.end(JSON.stringify("true"));
    }else{
      console.log('false');
      res.end(JSON.stringify("false"));
    }
  }).catch(function(e){
    console.log(e);
  });
}

exports.enrollCertificate = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * applySerialNumber (String)
  **/
  var csr;
  models.Certificate.findOne({
    'where': {
      'applySerialNumber': args.applySerialNumber.originalValue,
      'applyState': 1,
      'certificateState': {$ne: 1}
    }
  }).then(
    function(data){
      if(data == null){
        res.end(JSON.stringify("unknown applySerialNumber or a canceled apply or have enrolled a certificate"));
      }
      else{
        csr = data.dataValues.csr;
        return csr;        
      }
    }
  ).then((csr) => {
    if (csr === undefined) {
      console.error("csr cannot get");
      return;
    }
    var mac = new r.KJUR.crypto.Mac({alg: "HmacSHA1", "pass": "pass"}); //pass设置密码
    mac.updateString(args.applySerialNumber.originalValue+csr+Date.now());
    var macHex = mac.doFinal();
    var crt = {
      'enrollState': 1,
      'enrollSerialNumber': macHex
    };
    models.Certificate.update(crt,
      {
        'where': {
          'applySerialNumber': args.applySerialNumber.originalValue,
          'applyState': 1
        }
      }
    ).then(function(data){
      console.log(data);
      if(data[0] == 0){
        console.log('unknown applySerialNumber or a cancel apply');
        res.end(JSON.stringify("unknown applySerialNumber or a cancel apply"));
      }else if(data[0] == 1){
        res.end("enrollSerialNumber:"+crt.enrollSerialNumber);
        var csrStr = "-----BEGIN CERTIFICATE REQUEST-----\nMIHNMHICAQAwEDEOMAwGA1UEAwwFYWRtaW4wWTATBgcqhkjOPQIBBggqhkjOPQMB\nBwNCAATSs3cUksdTkUmk1zCgE0HpVIlZq4plNINYUJmpR7ji6/45Mrzn3oUXVJfU\nr7bY9dvsjgY7SX0h0AAOihBXPmt3oAAwDAYIKoZIzj0EAwIFAANJADBGAiEAwHyZ\nJqjEeK7DgYKvwqqq1Y81+sGZCTJhywZh1fspOe0CIQDTqbL5Y5LBj8gjHnhojfsl\nTZ6Tvbp5DwiArSCzu9zgjw==\n-----END CERTIFICATE REQUEST-----\n";
        var enrollRequest = {
          caUrl: "http://"+ nodeConf.CA.IP + ":" + nodeConf.CA.Port,
          enrollmentID: "admin",
          enrollmentSecret: "adminpw",
          caName: "ca-org",
          csr: csr
        };
        return enrollRequest;
      }else{
        console.log('false');
        res.end(JSON.stringify("false"));
      }
    }).then((enrollRequest) => {
      return this.enroll(enrollRequest);
    }).then((enrollResponse) => {
      enrollResponse.enrollSerialNumber = crt.enrollSerialNumber;
      var o = this.writeCertificate(enrollResponse);
    });
  }).catch(
    function (e) {
      console.error(e); 
      throw e;
    }
  );
}

exports.writeCertificate = function(args){
  var crt = {
    certificateState: 1,
    certificate: "args.certificate"
  };

  sequelize.query("UPDATE `Certificates` SET `certificateState`=1,`certificate`=\'"+args.certificate+"\' WHERE `enrollSerialNumber` = \'"+args.enrollSerialNumber+"\' AND `enrollState` = 1").spread(function(sql1, sql2){
    console.log("log info");
    });
  /*models.Certificate.update(crt,
    {
      'where': {
        'enrollSerialNumber': args.enrollSerialNumber,
        'enrollState': 1
      }
    }
  ).then(function(data){
    console.log(data);
    if(data[0] == 0){
      console.log('unknown enrollSerialNumber or a cancel enroll');
      return false;
//      res.end(JSON.stringify("unknown enrollSerialNumber or a cancel enroll"));
    }else if(data[0] == 1){
      console.log('true');
      return true;
//      res.end(JSON.stringify("true"));
    }else{
      console.log('false');
      return false;
//      res.end(JSON.stringify("false"));
    }
  }).catch(function(e){
    console.log(e);
  });*/
}

exports.enroll = function(args){
  return new Promise(function (resolve, reject) {
    var client = new Client();
    var cryptoSuite = client.getCryptoSuite();
    if (!cryptoSuite) {
      cryptoSuite = Client.newCryptoSuite();
    }
    var	tlsOptions = {
      trustedRoots: [],
      verify: false
    };
    // need to enroll it with CA server
    var cop = new copService(args.caUrl, tlsOptions, args.caName, cryptoSuite);
    /*cop._fabricCAClient = new FabricCAClient({
      caname: caName,
      protocol: endpoint.protocol,
      hostname: endpoint.hostname,
      port: endpoint.port,
      tlsOptions: tlsOptions
    }, this.getCryptoSuite());*/
  
    cop._fabricCAClient.enroll(args.enrollmentID, args.enrollmentSecret, args.csr)
    .then(
    function (enrollResponse) {
      return resolve({
//        key: privateKey,
        certificate: enrollResponse.enrollmentCert,
        rootCertificate: enrollResponse.caCertChain
      });
    },
    function (err) {
      return reject(err);
    }
    );
  });
}

exports.queryCertificateApplyState = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * applySerialNumber (String)
  **/
  models.Certificate.findOne({
    'where': {'applySerialNumber': args.applySerialNumber.originalValue}
  }).then(
    function(data){
      if(data == null){
        console.log('unknown applySerialNumber');
        res.end(JSON.stringify("unknown applySerialNumber"));
      }
      else{
        res.end(JSON.stringify(data.dataValues.applyState));
      }
    }
  ).catch(
    function (e) {
      console.error(e); 
      throw e;
    }
  );
}

exports.queryCertificateEnrollState = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * enrollSerialNumber (String)
  **/
    var examples = {};
  examples['application/json'] = "aeiou";
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.getCertificateState = function (req, res, next) { var args=req.swagger.params;
  /**
   * parameters expected in the args:
  * applySerialNumber (String)
  **/
  models.Certificate.findOne({
    'where': {'applySerialNumber': args.applySerialNumber.originalValue}
  }).then(
    function(data){
      if(data == null){
        console.log('unknown applySerialNumber');
        res.end(JSON.stringify("unknown applySerialNumber"));
      }
      else{
        res.end(JSON.stringify(data.dataValues.applyState)+"-"+JSON.stringify(data.dataValues.enrollState)+"-"+JSON.stringify(data.dataValues.certificateState));
      }
    }
  ).catch(
    function (e) {
      console.error(e); 
      throw e;
    }
  );
}