var net = require('net');
var path = require('path');
var conf  = require(path.join(__dirname, '..', 'config', 'bclc.json'));

var HOST = conf["ip"];
var PORT = conf["port"];
var client = new net.Socket();
var bclcSock = {};

// Socket接口发送请求数据
bclcSock.sendData = function BclcSockSendData(DataString) {
    client.connect(PORT, HOST, function() {
        console.log('Connected to ' + HOST + ':' + PORT);
        //建立连接后向服务器发送数据
        client.write(DataString);
    });
}

// Socket接口接受返回结果
bclcSock.recvData = function BclcSockRecvData() {
    // 客户端处理服务器的返回数据
    client.on('data', function(data) {
        console.log('Recv data:' + data);
        //处理完成后关闭连接
        client.destroy();
    });
    return data;
}

module.exports = bclcSock;