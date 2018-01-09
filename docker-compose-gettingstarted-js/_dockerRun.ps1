#   Required hotfix https://github.com/docker/compose/issues/2775
[Console]::OutputEncoding = [System.Text.Encoding]::Default

docker-compose up -d

docker ps