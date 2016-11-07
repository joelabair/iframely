#!/bin/sh

export NODE_ENV=$NODE_ENV

cd /home/joelbair/www/app.dvlp.sendsites.local/scripts/iframely/ && \
rm -f out.log && \
rm -f err.log && \
rm -f /home/joelbair/.forever/iframely.log && \
forever start -l iframely.log -o out.log -e err.log cluster.js
