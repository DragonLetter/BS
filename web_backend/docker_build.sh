cp docker_index.js ./index.js
docker build -t web_backend .
docker run -d -p 8080:8080 --name "web_backend" web_backend
