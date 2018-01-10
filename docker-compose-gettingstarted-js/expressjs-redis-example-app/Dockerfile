FROM node:9.3.0

#   Set workdir
WORKDIR /usr/src/app

#   Copy source files (check .dockerignore)
COPY ./ ./

#   Set Environment variables (Port to be used by ExpressJs)
ENV NODE_ENV production
ENV PORT 80
ENV REDIS_HOST redis

#   Install
RUN npm install

#   Command to run when starting the image
CMD [ "npm", "start" ]