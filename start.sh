#!/bin/bash

npm install

cd lora-network-server
pm2 start pm2.json
echo "lora-network-server start successful"

cd ../lora-network-connector
pm2 start pm2.json
echo "lora-network-connector start successful"

cd ../lora-join-server
pm2 start pm2.json
echo "lora-join-server start successful"
