## Installation

There are two methods to deploy an X-LoRa system, i.e., installation with repositories or with Docker.

### Installation with Repositories

#### System Requirements

It is necessary for users to make sure that all the prerequisites below have been installed before deploying X-LoRa from repositories.

* Node.js (version >= 8)
* MySQL (version >=5.6)
* Redis 
* Kafka
* MongoDB

#### Getteing Started

After installing the required software, please follow the steps below to configure the environments.

* Create a new database in MySQL.

* Start Kafka, Redis and MongoDB in the background.

* Clone this repo into a directory:

```sh
  git clone https://github.com/xisiot/lora-system.git --recursive
  cd lora-system
```

* Install all Node.js dependencies by using `npm install`. 

* Copy a local ``config.json`` from ``config_template.json``:

```sh
  cp config_template.json config.json
```

* Modify the configurations of kafka, MySQL and other customized fields in ``config.json``. The detailed configurations are described in Section 2.2.

* Use ``start.sh`` to start LoRa system:

```sh
  ./start.sh
```

To test if the system has started properly, please refer to: [Motes Emulator](../Implementations/Motes.md).

### Installation with Docker

#### System Requiremwnts

It is necessary for users to make sure that all the prerequisites below have been installed before deploying X-LoRa from Docker.

* Docker

#### Getting Started

After successful installation of Docker, please follow the steps below:

* Pull the xisiot/lora-system docker image:

```sh
  docker pull xisiot/lora-system:latest
```

* Run the xisiot/lora-system image in a container and map the port of 1700 to the container’s published port 1700 using option `-p`:

```sh
  docker run -it --name="test" -p 1700:1700/udp -p 3000:3000/tcp xisiot/lora-system:latest /bin/bash
```

* Start MySQL, Redis, MongoDB and Kafka in the background:

```sh
  service mysql start
  redis-server &
  mongod -config /etc/mongod.conf &
  cd root/kafka
  ./bin/zookeeper-server-start.sh -daemon config/zookeeper.properties
  ./bin/kafka-server-start.sh -daemon config/server.properties
```

  No more configurations need to be changed in this installation process.

* Use `start.sh` to start LoRa system:

```sh
  cd ../lora/lora-system
  ./start.sh
```

To test if the system has started properly, please refer to: [Motes Emulator](../Implementations/Motes.md).

---