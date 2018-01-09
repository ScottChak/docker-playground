FROM node:latest

#   Set workdir
WORKDIR /usr/src/app

#   Copy source files (check .dockerignore)
COPY ./ ./

#   Set Environment variables (Port to be used by ExpressJs)
ENV NODE_ENV production
ENV PORT 80

#   Install
RUN npm install

#   Command to run when starting the image
CMD [ "npm", "start" ]