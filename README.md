# LoRaWAN system

This is a whole LoRa system.

## Architecture

![Architecture](https://github.com/xisiot/resources/blob/master/lora-system/images/Architecture.jpg "Architecture")

## Installation

lora-system supports two methods for installation.

### Installation with repository

#### System Requirements

This system requires the following components imperatively.

- Node.js (>=8)
- MySQL (>=5.7)
- Redis
- Kafka
- MongoDB

#### Getting Started

- Install all the components listed in [System Requirements](https://github.com/xisiot/lora-system/tree/master#system-requirements).

- Create a new database in MySQL.

- Start Kafka, Redis and MongoDB in the background.

- Clone this repo into a directory:

  ```sh
  git clone https://github.com/xisiot/lora-system.git --recursive
  cd lora-system
  ```

- Install all Node.js dependencies by `npm install`.

- Copy a local ``config.json`` from ``config_template.json``:

  ```sh
  cp config_template.json config.json
  ```

- Modify the configurations of kafkaHost, MySQL and other customized fields in ``config.json``.

- Use ``start.sh`` to start LoRa system:

  ```sh
  ./start.sh
  ```

### Installation with docker

#### System Requirements

This system requires the following components imperatively.

- Docker

#### Getting Started

- Install all the components listed in [System Requirements](https://github.com/xisiot/lora-system/tree/master#system-requirements-1)

- Pull the xisiot/lora-system docker image:

- ```sh
  docker pull xisiot/lora-system:v1.0.0
  ```

- Run the xisiot/lora-system image in a container, mapping your machine’s port 12234 to the container’s published port 12234 using `-p`:

- ```sh
  docker run -it --name="test" -p 12234:12234/udp xisiot/lora-system:latest /bin/bash
  ```

- Start MySQL, Redis, MongoDB and Kafka in the background:

- ```sh
  service mysql start
  redis-server &
  mongod -config /etc/mongod.conf &
  cd root/kafka
  ./bin/zookeeper-server-start.sh -daemon config/zookeeper.properties
  ./bin/kafka-server-start.sh -daemon config/server.properties
  ```

- Use `start.sh` to start LoRa system:

- ```sh
  cd ../lora/lora-system
  ./start.sh
  ```


## License

LoRa system is distributed under the GPL-3.0 license. See also [License](https://github.com/xisiot/lora-system/blob/master/LICENSE)
