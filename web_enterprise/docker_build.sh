cp ./docker_common.js src/utils/common.js
docker build -t web_enterprise .
docker run -d -p 8000:8000 --name "web_enterprise" web_enterprise
