#获取当前路径并设置工作路径
WORKDIR=$(cd $(dirname $0); pwd)
echo "workdir:"$WORKDIR

#构建镜像前准备工作
cp $WORKDIR/docker_index.js $WORKDIR/index.js

#删除以前旧的镜像并构建新镜像
docker rm -f web_backend_i
docker rmi web_backend
docker build -t web_backend .
