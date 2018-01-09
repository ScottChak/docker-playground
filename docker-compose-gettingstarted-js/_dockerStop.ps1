#   Required hotfix https://github.com/docker/compose/issues/2775
[Console]::OutputEncoding = [System.Text.Encoding]::Default

docker-compose down

docker ps
docker ps -a