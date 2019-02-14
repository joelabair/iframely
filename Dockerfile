FROM node:8

RUN groupadd --gid 988 -r node &> /dev/null || true
RUN groupmod -g 988 node &> /dev/null || true

RUN useradd -r --uid 988 --gid 988 node &> /dev/null || true
RUN usermod -d /home/node -s /bin/nologin -u 988 -g 988 node &> /dev/null || true
RUN install -onode -gnode -d /home/node &> /dev/null || true

COPY . /iframely

WORKDIR /iframely

RUN DEPS="libkrb5-dev" \
    apt-get update && \
    apt-get install -q -y --no-install-recommends $DEPS && \
    npm install -g forever && \
    npm install && \
    apt-get purge -y --auto-remove $DEPS && \
    apt-get autoremove && \
    apt-get clean

USER node

EXPOSE 8061

ENTRYPOINT ["node", "./cluster.js"]
