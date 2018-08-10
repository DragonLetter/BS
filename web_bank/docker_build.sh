cp docker_common.js ./src/common.js
docker build -t web_bank .
cp ./build/build.js /home/wwwroot/default
docker run -d -p 9000:9000 --name "web_bank" web_bank
