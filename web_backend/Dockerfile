#设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM centos:centos7

#创建app目录,保存我们的代码
RUN mkdir -p /usr/src/node

#安装nodejs基础包
RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum install -y wget gcc gcc-c++ make bzip2 cjkuni-ukai-fonts fontconfig 
RUN cd /usr/src/node
RUN wget "https://npm.taobao.org/mirrors/node/v8.11.4/node-v8.11.4-linux-x64.tar.gz"
RUN tar -xvf node-v8.11.4-linux-x64.tar.gz -C /usr/local
RUN ln -s /usr/local/node-v8.11.4-linux-x64/bin/node /usr/bin/node
RUN ln -s /usr/local/node-v8.11.4-linux-x64/bin/npm /usr/bin/npm

#支持中文乱码
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

#设置工作目录
WORKDIR /usr/src/node

#复制所有文件到 工作目录。
COPY . /usr/src/node

#编译运行node项目，使用npm安装程序的所有依赖,利用taobao的npm安装
RUN npm install -g cnpm --registry=http://registry.npm.taobao.org
RUN ln -s /usr/local/node-v8.11.4-linux-x64/bin/cnpm /usr/bin/cnpm
RUN cnpm update
RUN cnpm install
#RUN npm install yarn -g
#RUN yarn

#暴露container的端口
EXPOSE 8080

#运行命令
CMD ["npm", "start"]
