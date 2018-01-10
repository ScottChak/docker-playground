#   Required hotfix https://github.com/docker/compose/issues/2775
[Console]::OutputEncoding = [System.Text.Encoding]::Default

docker stop redis
docker rm redis
docker run -d -p 6379:6379 --name redis redis:4.0.6

docker ps