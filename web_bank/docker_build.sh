#获取当前路径并设置工作路径
WORKDIR=$(cd $(dirname $0); pwd)
echo "workdir:"$WORKDIR

#构建镜像前准备工作
cp $WORKDIR/docker_common.js $WORKDIR/src/common.js

#删除以前旧的镜像并构建新镜像
docker rmi web_bank
docker build -t web_bank .
