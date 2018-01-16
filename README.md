# docker-playground

Repository for Docker examples

## Current examples

* [Docker Compose getting started tutorial](#docker-compose-gettingstarted-js): Implementation of the offical Docker Compose getting started guide

## docker-compose-gettingstarted-js

Sample code for getting started using Docker Compose.

### Main references

The main references used for this development are:

* [Getting started with Docker Compose](https://docs.docker.com/compose/gettingstarted/)
* [Using Redis in Node JS](https://www.sitepoint.com/using-redis-node-js/)
* [Using Redis in and Express JS application](https://coligo.io/nodejs-api-redis-cache/)
* [Using nginx reverse proxy in a Docker Compose solution](http://www.bogotobogo.com/DevOps/Docker/Docker-Compose-Nginx-Reverse-Proxy-Multiple-Containers.php)

### Solution description

This sample app starts 3 containers with Docker Compose. The images for these containers are:

* **redis**: A Redis cache server. The image used is from Docker Hub
* **[expressjs-redis-example-app](#expressjs-redis-example-app)**: A custom Node Js app using Express JS and Redis client to render a HTML page with Express Handlebars
* **[nginx-reverseproxy](#nginx-reverseproxy)**: A custom nginx server to redirect to the Node JS werver

#### Docker Compose configuration

This configuration is described in the [docker-compose.yml](docker-compose-gettingstarted-js/docker-compose.yml) file.

The **redis** container starts an image from Docker Hub without any particular configuration.

The **expressjs-redis-example-app** container starts the latest version of an image of the same name, based on a node image from Docker Hub and the [expressjs-redis-example-app source code](#expressjs-redis-example-app). This containers depends on the **redis** container. By specifying this dependency, Docker Compose configures its local network to allow the **expressjs-redis-example-app** container to connect to the **redis** server container.

The **nginx-reverseproxy** container starts the latest version of an image of the same name, based on an nginx image from Docker Hub and the [nginx-reverseproxy server configuration](#nginx-reverseproxy). This containers depends on the **expressjs-redis-example-app** container. By specifying this dependency, Docker Compose configures its local network to allow the **nginx-reverseproxy** container to connect to the **expressjs-redis-example-app** container.

Only the **nginx-reverseproxy** container has an external port forwarding configured, for request on the host port 80 (localhost:80 or locahost) to the container port 80 (default HTTP port).

#### expressjs-redis-example-app

TODO

#### nginx-reverseproxy

The nginx server configuration is described in the [default.conf](docker-compose-gettingstarted-js/nginx-reverseproxy/default.conf) file.

This configuration:
* defines an upstream to the **expressjs-redis-example-app** container on port 80,
* defines a server (virtual host) to listen on incoming requests on port 80, with two locations:
    * / (root). This configuration returns the default content from the original nginx image
    * /expressjs-redis-example-app/. This configuration is a reverse proxy without redirect to the **expressjs-redis-example-app** upstream. It sets some basic HTTP redirection headers (original host, original client IP, forwarded for and forwarded host headers)

The **nginx-reverseproxy** is built on an existing nginx image from Docker Hub.

The built image exposes port 80 (on which the nginx server is configured to listen) and replaces existing default.conf with custom configuration.