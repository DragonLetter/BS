'use strict';
var crypto = require('crypto');

var helper={};
helper.getPrivateKey=function(req){
    var head=req.headers;
    var encrptKey= req.session.key;
    return  "-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgkPHBrNHq6Ta9aJZi\r\na3SJhoO0EvkhfT07MSL64N7OeOChRANCAAS1+vRU5jYfMQNgH3GtUSV+/xKs9I4P\r\npoH/enm5EBBrwJ9mBX63liv4FqRfauJxGv2lL4S4hJQ6Jw/SQeEmgtHJ\r\n-----END PRIVATE KEY-----\r\n"; 
}
helper.getCertificate=function(req){
    var head=req.headers;
    var encrptKey= req.session.cert;
    return "-----BEGIN CERTIFICATE-----\r\nMIICFDCCAbqgAwIBAgIRAOa8NeHBQvO/x2kc8HPHHkMwCgYIKoZIzj0EAwIwbzEL\r\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\r\ncmFuY2lzY28xFzAVBgNVBAoTDkIxLmV4YW1wbGUuY29tMRowGAYDVQQDExFjYS5C\r\nMS5leGFtcGxlLmNvbTAeFw0xODA2MjkwNzEzNDdaFw0yODA2MjYwNzEzNDdaMFkx\r\nCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4g\r\nRnJhbmNpc2NvMR0wGwYDVQQDDBRBZG1pbkBCMS5leGFtcGxlLmNvbTBZMBMGByqG\r\nSM49AgEGCCqGSM49AwEHA0IABHhaRHuO4GMApibTtcmQ3NGeGZPP0CzutLxKtwDE\r\nTE6vUBi7jbTjPeISo6WSAkConEYlZtKHIU5Z+KvImcEcGmOjTTBLMA4GA1UdDwEB\r\n/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIM/0jc/xCYXYsrmdX3QM\r\nxMj88sPSpyd30a8Hho11IfGtMAoGCCqGSM49BAMCA0gAMEUCIQCMaOv0UdRZ0z7m\r\nnrQeIGSsSW1a07ZijkARTih5th/+OQIgRaWVFFBvJ0EZnz7xZxQiLruyXfUe4t9e\r\nIZzE/m4xUyI=\r\n-----END CERTIFICATE-----\r\n"; 
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
