var net = require('net');
var confNode = require('../config/nodeconf.json');
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

var bclcConf = confNode["Bclc"];
var HOST = bclcConf.IP;
var PORT = bclcConf.Port;
var client = new net.Socket();
var connFlag = false;

// Socket接口发送请求数据
exports.BclcSockSendData = function (DataString, callback) {
    // 设置编码方式为UTF-8
    client.setEncoding('utf8');

    // 建立连接
    if (false == connFlag) {
        client.connect(PORT, HOST, function () {
            Logger.debug('Connected to ' + HOST + ':' + PORT);
            connFlag = true;
            //建立连接后向服务器发送数据
            client.write(DataString);
        });
    } else {
        client.write(DataString);
    }

    client.on('data', function (data) {
        callback != undefined && callback(data);
        // client.destroy();
    });

    client.on('error', function (error) {
        //错误出现之后关闭连接
        Logger.info('error:' + error);
        connFlag = false;
        client.destroy();
    });

    client.on('close', function () {
        //正常关闭连接
        connFlag = false;
        Logger.debug('Connection closed');
    });
}