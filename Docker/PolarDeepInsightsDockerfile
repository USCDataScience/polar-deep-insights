FROM ruby:2.3-alpine
MAINTAINER preranathm@gmail.com

# Internal unpriviled user will have this ID:
ENV CONTAINER_USER_ID="1000" \
    CONTAINER_GROUP_ID="1000"

# Updates OS and adds system required packages
RUN apk update && apk upgrade
RUN apk add nodejs git ruby 
RUN apk add --update build-base libffi-dev 
RUN gem install compass

# creates a user "user"
RUN adduser -D -u ${CONTAINER_USER_ID} -g ${CONTAINER_GROUP_ID} -h /home/user -s /bin/sh user

# Global npm folder writeable by "user"
RUN mkdir -p /opt/npm-global && \
    chown user:user /opt/npm-global

# After this point everthing is done as unpriveleged user
USER user

# configuring environment variables
ENV NPM_CONFIG_PREFIX=/opt/npm-global
ENV PATH=$NPM_CONFIG_PREFIX/bin:$PATH

# Installing usefull npm packages
RUN npm install -g \
    npm@3.10.6 \
    grunt@1.0.1 \
    grunt-cli@1.2.0 \
    bower@1.7.9 \
    yo@1.8.4

# Creating a directory inside the container
WORKDIR /home/user/src

# Copy entrypoint script into the container
COPY ./entrypoint.sh /entrypoint.sh

# Copy everything to the workdir, inside the container
COPY ./ . 

# Always root is set as the owner, so let's change it to user
USER root
RUN chown -R user:user .
USER user

EXPOSE 9000 
EXPOSE 35729
ENTRYPOINT ["/entrypoint.sh"]
CMD ["grunt", "serve"]

