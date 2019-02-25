FROM node:10

MAINTAINER Joel A Bair <joel.a.bair@gmail.com>

USER root

RUN groupmod -g 988 node
RUN usermod -d /home/node -s /bin/nologin -u 988 -g 988 node
RUN install -onode -gnode -d /home/node

COPY . /iframely

RUN DEPS="libkrb5-dev" \
    apt-get update && \
    apt-get install -q -y --no-install-recommends $DEPS && \
    apt-get purge -y --auto-remove $DEPS && \
    apt-get autoremove && \
    apt-get clean

WORKDIR /iframely

RUN DEPS="libkrb5-dev" npm install --quiet

USER node

EXPOSE 8061

CMD node ./cluster.js
