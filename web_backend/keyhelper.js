'use strict';
var crypto = require('crypto');

var helper={};
helper.getPrivateKey=function(req){
    var head=req.headers;
    var encrptKey= req.session.key;
    return encrptKey;//"-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgBZYbtwoiDUGye/VU\r\nc6WwxRWJEXeRdzoICU6Dm74jcZGhRANCAATF3YE/B0lq7uzxb64pZUp/yw1ini1O\r\ngHpo387a8VsHQfON+uNDVUVQGbi7qLFzkgOilSxssrNN5Bpq5HXqJgTG\r\n-----END PRIVATE KEY-----\r\n";
}
helper.getCertificate=function(req){
    var head=req.headers;
    var encrptKey= req.session.cert;
    return encrptKey;//"-----BEGIN CERTIFICATE-----\r\nMIICEjCCAbmgAwIBAgIQEx4Fu/oNahha0jyj/zDNDjAKBggqhkjOPQQDAjBvMQsw\r\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\r\nYW5jaXNjbzEXMBUGA1UEChMOQjEuZXhhbXBsZS5jb20xGjAYBgNVBAMTEWNhLkIx\r\nLmV4YW1wbGUuY29tMB4XDTE3MTEwNTA0MTM0NVoXDTI3MTEwMzA0MTM0NVowWTEL\r\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\r\ncmFuY2lzY28xHTAbBgNVBAMMFEFkbWluQEIxLmV4YW1wbGUuY29tMFkwEwYHKoZI\r\nzj0CAQYIKoZIzj0DAQcDQgAExd2BPwdJau7s8W+uKWVKf8sNYp4tToB6aN/O2vFb\r\nB0HzjfrjQ1VFUBm4u6ixc5IDopUsbLKzTeQaauR16iYExqNNMEswDgYDVR0PAQH/\r\nBAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgZekDR4M+lmIBr79dCfF1\r\nxaOn9YbgdZZwnRKXc7PhMz4wCgYIKoZIzj0EAwIDRwAwRAIgOEbDIUF7Xi0M2rbM\r\nzK2uc6x+PMQ+as5fKEEVnz70ACcCIFNAiSPRwxJfPI1UmZzrBA4OzQ4cU4kVGaJt\r\n/BfRrFkc\r\n-----END CERTIFICATE-----\r\n";
}
helper.setPrivateKey=function(req,encrptKey){
    req.session.key=encrptKey;
}
helper.setCertificate=function(req,encrptCert){
    req.session.cert=encrptCert;
}
helper.hashPassword=function(userName,password){
    var content=userName+";"+password;
    var md5sum = crypto.createHash("md5");
    md5sum.update(content);
    var hash=md5sum.digest("hex");
    return hash;
}


module.exports = helper;