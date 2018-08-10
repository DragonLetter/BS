'use strict';
var crypto = require('crypto');

var helper={};
helper.getPrivateKey=function(req){
    var head=req.headers;
    var encrptKey= req.session.key;
    return "-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgfMFCvZHd5FZomo6w\r\n1I2oR9o6rmYUSuMG68RAt3nub0ihRANCAAR4WkR7juBjAKYm07XJkNzRnhmTz9As\r\n7rS8SrcAxExOr1AYu4204z3iEqOlkgJAqJxGJWbShyFOWfiryJnBHBpj\r\n-----END PRIVATE KEY-----\r\n";
    //return "-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgqjan9hfkrWbh+tqo\r\noRz3AUfGPjkWz6BlSuLodghP3FChRANCAATYIgVzVHP+lhcyS61gNtzzdTrch1LT\r\ncFfMhnFx6+IRgLLJxB3bT9/o1iei6jU79cTXJtjyaiLmtKcWrEouB16F\r\n-----END PRIVATE KEY-----\r\n";
}
helper.getCertificate=function(req){
    var head=req.headers;
    var encrptKey= req.session.cert;
    return "MIICFDCCAbqgAwIBAgIRAOa8NeHBQvO/x2kc8HPHHkMwCgYIKoZIzj0EAwIwbzEL";
    //return "-----BEGIN CERTIFICATE-----\r\nMIICFDCCAbqgAwIBAgIRAOa8NeHBQvO/x2kc8HPHHkMwCgYIKoZIzj0EAwIwbzEL\r\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\r\ncmFuY2lzY28xFzAVBgNVBAoTDkIxLmV4YW1wbGUuY29tMRowGAYDVQQDExFjYS5C\r\nMS5leGFtcGxlLmNvbTAeFw0xODA2MjkwNzEzNDdaFw0yODA2MjYwNzEzNDdaMFkx\r\nCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4g\r\nRnJhbmNpc2NvMR0wGwYDVQQDDBRBZG1pbkBCMS5leGFtcGxlLmNvbTBZMBMGByqG\r\nSM49AgEGCCqGSM49AwEHA0IABHhaRHuO4GMApibTtcmQ3NGeGZPP0CzutLxKtwDE\r\nTE6vUBi7jbTjPeISo6WSAkConEYlZtKHIU5Z+KvImcEcGmOjTTBLMA4GA1UdDwEB\r\n/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIM/0jc/xCYXYsrmdX3QM\r\nxMj88sPSpyd30a8Hho11IfGtMAoGCCqGSM49BAMCA0gAMEUCIQCMaOv0UdRZ0z7m\r\nnrQeIGSsSW1a07ZijkARTih5th/+OQIgRaWVFFBvJ0EZnz7xZxQiLruyXfUe4t9e\r\nIZzE/m4xUyI=\r\n-----END CERTIFICATE-----\r\n";
    //return "-----BEGIN CERTIFICATE-----\r\nMIICYTCCAgegAwIBAgIUM1J9lj3pXWASjtS5bscTjmjeDIwwCgYIKoZIzj0EAwIw\r\nbzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\r\nbiBGcmFuY2lzY28xFzAVBgNVBAoTDkMxLmV4YW1wbGUuY29tMRowGAYDVQQDExFj\r\nYS5DMS5leGFtcGxlLmNvbTAeFw0xODA2MjkwNzMxMDBaFw0xOTA2MjkwNzM2MDBa\r\nMF4xCzAJBgNVBAYTAkNOMRcwFQYDVQQIEw5Ob3J0aCBDYXJvbGluYTEVMBMGA1UE\r\nChMMRHJhZ29uTGVkZ2VyMQ8wDQYDVQQLEwZjbGllbnQxDjAMBgNVBAMTBWFkbWlu\r\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE2CIFc1Rz/pYXMkutYDbc83U63IdS\r\n03BXzIZxceviEYCyycQd20/f6NYnouo1O/XE1ybY8moi5rSnFqxKLgdehaOBkTCB\r\njjAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUZmTF6TmW\r\nJcxU1KVma42XhB25dJ8wKwYDVR0jBCQwIoAgfBcxNVFJH+qsUW9PeCLGNJ1fd+2r\r\ngePBnHstVSShSv8wIgYDVR0RBBswGYIXaVpocDNmN3k0aWpid2RvMXA3cGwyeFow\r\nCgYIKoZIzj0EAwIDSAAwRQIhAOO3Pihn8gpnzBvXdgrJQ2qJQM41SClbKZRmRzEU\r\nuAqpAiACRAIfR6OW/objjLoLHISr0LB+x46+nbzCa+K3Yxk9OQ==\r\n-----END CERTIFICATE-----\r\n";
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
