#创建本地文件夹存储容器中应用产生的日志文件
mkdir -p ~/web_bank/logs

#启动容器并挂载本地文件到容器中
docker run --name web_bank_i -p 9000:9000 -v ~/web_bank/logs:/usr/src/node/logs -d web_bank
