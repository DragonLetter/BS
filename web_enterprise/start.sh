#创建本地文件夹存储容器中应用产生的日志文件
mkdir -p ~/web_enterprise/logs

#启动容器并挂载本地文件到容器中
docker run --name web_enterprise_i -p 8000:8000 -v ~/web_enterprise/logs:/usr/src/node/logs -d web_enterprise

