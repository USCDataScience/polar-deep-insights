FROM node:12

# install dependencies
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn cache clean --force && yarn

# copy app source to image _after_ npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . /opt/app

CMD [ "yarn", "start" ]
