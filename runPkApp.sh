#! /bin/bash
NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules
export NODE_PATH

cd /root/workspace/pkEdisonTestApp && DEBUG=verbose node index.js
