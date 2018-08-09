#!/bin/bash

cp config.json lora-network-server/config/config.json
cp config.json lora-network-connector/config/config.json
cp config.json lora-join-server/config/config.json

pm2 start pm2.json
