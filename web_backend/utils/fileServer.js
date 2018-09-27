var qiniu = require("qiniu");
var confNode = require("../config/nodeconf");
var stream = require('stream');
var Readable = require('stream').Readable;
var qsModel = require('querystring');
var urlModel = require('url');
const log4js = require('./log4js');
const Logger = log4js.getLogger('be');

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;

var mac = new qiniu.auth.digest.Mac(confNode.FileServerQiNiu.ACCESS_KEY, confNode.FileServerQiNiu.SECRET_KEY);
var resumeUploader = new qiniu.resume_up.ResumeUploader(config);
var putExtra = new qiniu.resume_up.PutExtra();

//构建上传策略函数
function uptoken(bucket) {
    var options = {
        scope: bucket,
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
}

exports.uploadFileStreamQN = function (bucket, fileBuff, fileName) {
    // 创建一个bufferstream
    var rsStream = new Readable;
    var bufferStream = new stream.PassThrough();
    //将Buffer写入
    // rsStream.push(fileBuff);
    // rsStream.push(null);

    //将Buffer写入
    bufferStream.end(fileBuff);
    //进一步使用
    bufferStream.pipe(rsStream);

    var uploadToken = uptoken(bucket);
    resumeUploader.putStream(uploadToken, fileName, rsStream, fileBuff.length, putExtra, function (respErr,
        respBody, respInfo) {
        if (respErr) {
            console.log(respErr);
        }

        if (respInfo.statusCode == 200) {
            console.log(respBody);
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
        }
    });
}

function post(url, data, fn) {
    data = data || {};
    var content = qsModel.stringify(data);
    var parse_u = urlModel.parse(url, true);
    var isHttp = parse_u.protocol == 'http:';
    var options = {
        host: parse_u.hostname,
        port: parse_u.port || (isHttp ? 80 : 443),
        path: parse_u.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length
        }
    };
    var req = require(isHttp ? 'http' : 'https').request(options, function (res) {
        var _data = '';
        res.on('data',
            function (chunk) {
                _data += chunk;
            });
        res.on('end',
            function () {
                fn != undefined && fn(_data);
            });
    });
    req.write(content);
    req.end();
}

exports.uploadFileStream = function (type, fileString, fileName) {
    var req = {
        "fileName": fileName,
        "file": fileString,
        "dirName": type
    }
    Logger.debug("req to fileserver:" + JSON.stringify(req));
    post('http://' + confNode.FileServer.IP + ':' + confNode.FileServer.Port + confNode.FileServer.Path, req, function (data) {
        Logger.debug(data);
        return data;
    });
}