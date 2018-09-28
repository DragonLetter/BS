#创建本地文件夹存储容器中应用产生的日志文件
mkdir -p ~/web_backend/logs

#启动容器并挂载本地文件到容器中
docker run --name web_backend_i -p 8080:8080 -v ~/web_backend/logs:/usr/src/node/logs -d web_backend
