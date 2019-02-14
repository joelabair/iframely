FROM node:8

RUN DEPS="libkrb5-dev" \
    apt-get update && \
    apt-get install -q -y --no-install-recommends $DEPS && \
    npm install -g forever && \
    npm install && \
    apt-get purge -y --auto-remove $DEPS && \
    apt-get autoremove && \
    apt-get clean

RUN groupmod -g 988 node &> /dev/null || true
RUN usermod -d /home/node -s /bin/nologin -u 988 -g 988 node &> /dev/null || true
RUN install -onode -gnode -d /home/node

COPY . /iframely

WORKDIR /iframely

USER node

EXPOSE 8061

ENTRYPOINT ["node", "./cluster.js"]
