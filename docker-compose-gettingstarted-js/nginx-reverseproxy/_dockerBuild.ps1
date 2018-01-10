$imageName = "nginx-reverseproxy";

#   Removing old tags
Write-Host ("Removing docker images " + $imageName + " (latest)")
docker rmi $imageName

#   Building and tagging docker image
Write-Host ("Building docker images " + $imageName + " (latest)")
docker build -t $imageName .

docker images