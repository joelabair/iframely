#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export NODE_ENV=$NODE_ENV

cd $DIR && \
rm -f out.log && \
rm -f err.log && \
rm -f /home/joelbair/.forever/iframely.log && \
forever start -l iframely.log -o out.log -e err.log cluster.js
