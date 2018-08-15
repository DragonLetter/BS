var net = require('net');

// var HOST = '127.0.0.1';
// var PORT = 6969;
var client = new net.Socket();

export function BclcSockSendData(HOST, PORT, DataString) {
    client.connect(PORT, HOST, function() {
        console.log('Connected to ' + HOST + ':' + PORT);
        //建立连接后向服务器发送数据
        client.write(DataString);
    });
}

export function BclcSockRecvData() {
    // 客户端处理服务器的返回数据
    client.on('data', function(data) {
        console.log('Recv data:' + data);
        //处理完成后关闭连接
        client.destroy();
    });
    return data;
}