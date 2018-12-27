#Tutorias

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

* Use ``start.sh`` to start LoRa™ system:

```sh
  ./start.sh
```

To test if the system has started properly, please refer to: [Motes Emulator](Implementations/Motes.md).

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

* Use `start.sh` to start LoRa™ system:

```sh
  cd ../lora/lora-system
  ./start.sh
```

To test if the system has started properly, please refer to: [Motes Emulator](Implementations/Motes.md).

---

## Configuration

The default configuration file is shown as follows.

```sh
{
  "database": {
    "mysql": {
      "username": "username",
      "password": "password",
      "database": "mysql",
      "host": "localhost",
      "port": 3306,
      "dialect": "mysql",
      "operatorsAliases": false,
      "logging": false,
      "timezone": "+08:00",
      "define": {
        "freezeTableName": true,
        "timestamp": true,
        "charset": "utf8"
      },
      "pool": {
        "max": 10,
        "min": 1,
        "idle": 10000,
        "acquire": 30000
      }
    },
    "redis": {
      "cluster": false,
      "options": [
        {
          "host": "localhost",
          "port": 6379
        }
      ]
    },
    "mongodb": {
      "host": "localhost",
      "port": 27017,
      "db": "loraLogger",
      "cluster": false
    }
  },
  "mqClient_ns": {
    "consumerGroup": {
      "options": {
        "kafkaHost": "localhost:9092",
        "groupId": "lora-network-server-message-dispatch-in",
        "sessionTimeout": 15000,
        "protocol": [
          "roundrobin"
        ],
        "fromOffset": "latest"
      },
      "topics": [
        "NS-sub",
        "AS-pub",
        "JS-pub"
      ]
    },
    "client": {
      "kafkaHost": "localhost:9092",
      "clientId": "lora-network-server-message-dispatch-out"
    },
    "producer": {
      "requireAcks": 1,
      "ackTimeoutMs": 100,
      "partitionerType": 2
    },
    "schemaPath": {
      "messages": "config/messages.json",
      "common": "config/common.json"
    },
    "topics": {
      "pubToApplicationServer": "AS-sub",
      "subFromApplicationServer": "AS-pub",
      "pubToConnector": "NC-sub",
      "subFromConnector": "NS-sub",
      "pubToJoinServer": "JS-sub",
      "subFromJoinServer": "JS-pub",
      "pubToControllerServer": "CS-sub",
      "subFromControllerServer": "CS-pub"
    }
  },
  "log": {
    "level": "debug",
    "colorize": true
  },
  "server": {
    "fcntCheckEnable": true,
    "deduplication_Delay": 200,
    "downlink_Data_Delay": 200
  },
  "mqClient_js": {
    "consumerGroup": {
      "options": {
        "kafkaHost": "localhost:9092",
        "groupId": "lora-join-server-consumer",
        "sessionTimeout": 15000,
        "protocol": [
          "roundrobin"
        ],
        "fromOffset": "latest"
      },
      "topics": [
        "JS-sub"
      ]
    },
    "client": {
      "kafkaHost": "localhost:9092",
      "clientId": "lora-join-server-produce"
    },
    "producer": {
      "requireAcks": 1,
      "ackTimeoutMs": 100,
      "partitionerType": 2,
      "joinServerTopic": "JS-pub"
    }
  },
  "mqClient_nc": {
    "consumerGroup": {
      "options": {
        "kafkaHost": "localhost:9092",
        "groupId": "lora-network-connector-consumer",
        "sessionTimeout": 15000,
        "protocol": [
          "roundrobin"
        ],
        "fromOffset": "latest"
      },
      "topics": [
        "NC-sub"
      ]
    },
    "client": {
      "kafkaHost": "localhost:9092",
      "clientId": "lora-network-connector-produce"
    },
    "producer": {
      "requireAcks": 1,
      "ackTimeoutMs": 100,
      "partitionerType": 2
    },
    "topics": {
      "pubToServer": "NS-sub"
    }
  },
  "udp": {
    "port": 1700
  },
  "http": {
    "port": 3000
  },
  "mqClient_as": {
    "consumerGroup": {
      "options": {
        "kafkaHost": "localhost:9092",
        "groupId": "lora-application-server-message-dispatch-in",
        "sessionTimeout": 15000,
        "protocol": [
          "roundrobin"
        ],
        "fromOffset": "latest"
      },
      "topics": [
        "AS-sub",
        "cloud-sub"
      ]
    },
    "client": {
      "kafkaHost": "localhost:9092",
      "clientId": "lora-application-server-message-dispatch-out"
    },
    "producer": {
      "requireAcks": 1,
      "ackTimeoutMs": 100,
      "partitionerType": 2
    },
    "schemaPath": {
      "messages": "config/messages.json",
      "common": "config/common.json"
    },
    "topics": {
      "pubToCloud": "cloud-pub",
      "subFromCloud": "cloud-sub",
      "pubToServer": "AS-pub",
      "subFromServer": "AS-sub"
    }
  },
  "mqClient_nct": {
    "consumerGroup": {
      "options": {
        "kafkaHost": "localhost:9092",
        "groupId": "lora-network-controller-message-dispatch-in",
        "sessionTimeout": 15000,
        "protocol": [
          "roundrobin"
        ],
        "fromOffset": "latest"
      },
      "topics": [
        "CS-sub"
      ]
    },
    "client": {
      "kafkaHost": "localhost:9092",
      "clientId": "lora-network-controller-message-dispatch-out"
    },
    "producer": {
      "requireAcks": 1,
      "ackTimeoutMs": 100,
      "partitionerType": 2
    },
    "schemaPath": {
      "messages": "config/messages.json",
      "common": "config/common.json"
    },
    "topics": {
      "pubToServer": "CS-pub",
      "subFromServer": "CS-sub"
    }
  },
}
```

In general, the following options are necessary for users to modify according to actual situations,

- database.mysql.username: the username of MySQL
- database.mysql.password: the user's password of MySQL
- database.mysql.database: the database used for X-LoRa in MySQL
- udp.port: the port for receiving UDP packets from LoRa™ Gateways(default value is 1700)
- http.port: the port of HTTP interfaces(default value is 3000)

Other configurations are free to change to fit the environments.

---

## Installation of LoRa™ Web Server

#### System Requiremwnts

All the requirements below should be met before installing the LoRa™ web server.

* Apache (version: 2.4.* recommend: 2.4.7)
* PHP (version>=7.0.0 recommend: 7.0.30)
* MySQL (version>=5.7 recommend: 5.7)
* MongoDB (recommend: 3.4.9)
* Composer (recommend: 1.5.2)

#### Getting Started

* Clone this repo into a directory:

```sh
  git clone https://github.com/xisiot/lora-web-server
  cd lora-web-server
```

* Install dependencies by using `composer install`: 

```sh
  composer install
```

* Copy a local ``. env`` from ``.env.example ``:

```sh
  cp .env.example .env
```

* Run `` php artisan key:generate`` to generate the app key in ``.env`` file.

```sh
  php artisan key:generate
```

* Modify the configurations of MySQL, MongoDB and the registration interface URL in ``. env `` file. The detailed configurations are described as follows:

```php
  // the configuration of the database(MySQL)
  DB_CONNECTION=mysql
  // the host of the database
  DB_HOST=127.0.0.1
  // the port of the database
  DB_PORT=3306
  // the name of the database
  DB_DATABASE=
  // the username
  DB_USERNAME=
  // the password
  DB_PASSWORD=
   
  //registration interface provided by lora server,the default is http://localhost:3000
  HTTP_URL=http://localhost:3000
   
  // the configuration of the database(MongoDB) 
  MONGO_HOST=127.0.0.1
  MONGO_PORT=27017
  // the name of the Mongo database
  MONGO_DB=
```

* Perform database migration by using `php artisan migrate`:

```sh
  php artisan migrate
```

* Run the artisan command to start the LoRa™ web server system directly :

```sh
  php artisan serve --host=0.0.0.0 --port=8000
```

* Self-starting the web needs to do the following operations: 

   * Ubuntu 14.04

Add the ``xxx.conf`` file to the ``/etc/init`` directory and modify the configurations about the project path, log, upstart commands, and so on. The detailed configurations are described as follows: 

```sh
  # lora-web-server config
  # a web management system for lora-web-server
  # this is a upstart conf file
  # lora-web-server name can be modified, 
  # this is the name of the self-started service
  description  " lora-web-server "
  # no configuration required
  start on runlevel [2345]
  stop on shutdown
     	
  respawn
  respawn limit 10 5
  # configuration content that needs to be modified
  script
    PHP=`which php`
    # the directory of the Laravel project
    PROJECT_PATH='/XXX/XXX/lora-web-server '
    # the directory of the log of the Laravel project
    LOG_PATH='/XX/XX/lora-web-server/storage/logs/laravel.log'
    # upstart host name, set to local
    HOST='0.0.0.0'
    # the port number of the web page,
    # ensure that it is not occupied by other service.
    PORT=8000
    # no configuration required
    LOG_DIR=`dirname $LOG_PATH`
    [[ -d $LOG_DIR ]] || mkdir -p $LOG_PATH
      # no configuration required
      exec $PHP "$PROJECT_PATH/artisan" serve --host $HOST --port $PORT >> $LOG_PATH 2>&1
     end script
```

Run the following command to start the LoRa™ web server system :

```sh
  service lora-web-server start
```

   * Ubuntu 16.04

Add the upstart script to the ``/usr/sbin/`` directory and write the absolute path to the ``lora-web-server.service`` file in ``/lib/systemd/system/`` directory:

```sh
  #!/bin/sh  XXX stand for the absolute path of the laravel project 
  php /XXX/XXX/lora-web-server /artisan serve --host 0.0.0.0 --port 8000
  #the XXXX after the port indicates the port number of the web page startup.
```

Add the ``lora-web-server.service`` file to ``/lib/systemd/system/`` directory :

```sh
     [Unit]
     Description= lora-web-server
     
     [Service]
     #Type=forking
     #User=root
     #the specific shell execution file of the service process, 
     #xxx is the file name, not the folder name
     ExecStart=/usr/sbin/lora-web-server
     #here is the startup configuration file under the /usr/sbin/ path above.
     PrivateTmp=true
     
     [Install]
     WantedBy=multi-user.target
```

Run the following command to start the LoRa™ web server system :

```sh
  systemctl start lora-web-server.service
```

---

## Usage

This section describes the detailed instructions of X-LoRa. It shows how to create applications, register gateways and activate devices.

#### Registration on LoRa™ Web

Users need to register their applications, gateways and devices on the LoRa™ web before further operations.

##### User Management

Create an account for the LoRa™ web and start enjoying the service the LoRa™ server provided. With a LoRa™ web account, the following can be done:

* Creating applications, gateways and devices
* Easy access to the transmission data and application data

It's necessary to fill in the following fields when register an account. Note that the password field requires at least 6 characters long.

<center>TABLE 1 Description of User Registration Form</center>

|     Field      |  Type  |   Description   | Attribute |
| :------------: | :----: | :-------------: | :-------: |
|      Name      | String |   User's name   | Required  |
| E-mail Address | String |  User's email   | Required  |
|    Password    | String | User's password | Required  |

##### Gateway Management

LoRa™ gateways directly connect to LoRa™ network connector and upload and download data for LoRa™ devices. However, registering gateway in the LoRa™ web is firstly needed. The verification of the existence of the gateways without registering in the LoRa™ web can’t success.

The fields in the following table need to be filled in during the registration of gateways. Note that the gatewayID field should be unique. If not, the registration can’t be successful.

Once the registration is successful, the web will return a list of gateways that the user has registered.

<center>TABLE 2 Description of Gateway Registration Form</center>

|     Field      |  Type  |     Description     | Attribute |
| :------------: | :----: | :-----------------: | :-------: |
|   gatewayID    | String | Gateway MAC address |  Unique   |
|      type      | String |   Indoor/Outdoor    | Required  |
| frequency plan | Number |      Frequency      | Required  |
|     model      | String |     X01/X02/X03     | Required  |
|    location    | String |  Gateway location   | Required  |

##### Application Management

Each device belongs to a certain application. Therefore, before registering devices, users should register applications first.

The fields in the following table need to be filled in during the registration of applications. Note that the AppEUI field should be unique. If not, the registration can’t be successful.

Once the registration is successful, the web will return a list of applications that the user has registered.

<center>TABLE 3 Description of Application Registration Form</center>

|      Field       |  Type  |            Description             | Attribute |
| :--------------: | :----: | :--------------------------------: | :-------: |
| Application Name | String |          Application name          | Required  |
|      AppEUI      | String | LoRa™ application unique identifier |  Unique   |

##### Device Management

Before LoRa™ devices are able to connect to the LoRa™ server, users should register them in the LoRa™ web. Without that, the verification of the existence of the devices will fail.

Device registration must be performed after the application is registered, which has been explained in the previous section. Due to the fact that activation of an end-device can be achieved in two ways, device registration can be divided into two categories, i.e., Over-The-Air Activation (OTAA) and Activation by Personalization (ABP) modes. The attribute fields required for the registration of the two modes have different requirements, i.e.,

* OTAA Mode

  The fields in the following table need to be filled in during the registration of devices. Note that the DevEUI field should be unique. If not, the registration can’t be successful.

  Once the registration is successful, the web will return a list of devices that the user has registered.

  <center>TABLE 4 Description of OTAA Device Registration Form</center>

  | Field  |  Type  |          Description          | Attribute |
  | :----: | :----: | :---------------------------: | :-------: |
  | DevEUI | String | LoRa™ device unique identifier |  Unique   |
  | AppKey | String |    AES-128 application key    | Required  |

* ABP Mode

  The fields in the following table need to be filled in during the registration of devices. Note that the DevEUI field and DevAddr field should be unique. If not, the registration can’t be successful.

  Once the registration is successful, the web will return a list of devices that the user has registered.

  <center>TABLE 5 Description of ABP Device Registration Form</center>

  |  Field  |  Type  |          Description          | Attribute |
  | :-----: | :----: | :---------------------------: | :-------: |
  | DevEUI  | String | LoRa™ device unique identifier |  Unique   |
  | AppKey  | String |    AES-128 application key    | Required  |
  | DevAddr | String |  LoRa™ device unique address   |  Unique   |
  | NwkSKey | String |      Network session key      | Required  |
  | AppSKey | String |    Application session key    | Required  |

#### Interaction with LoRa™ Server
For over-the-air activation, LoRa™ devices must follow a join procedure prior to participating in data exchanges with the Network Server. An end-device has to go through a new join procedure every time when it has lost the session context information. After that, devices can send the uplink messages and receive the downlink messages from the LoRa™ server.

Activating a LoRa™ devices by personalization means that all the necessary information is stored in devices in the very beginning. These devices can interact with LoRa™ server directly.

## Application Integration

#### Introduction

This section describes how to integrate customized application servers into X-LoRa systems.<br>
Application Server is responsible for handling application payloads. It is necessary to support various applications with different encoding methods such as Protocol Buffer serialization to improve network transmission efficiency. Application Server also functions as a bridge between the cloud platform owned by users and the X-LoRa system so that customers can control LoRa™ devices and enjoy the applications through web browsers or APPs on smartphones. The IoT cloud can get the application payloads by subscribing the specific topic, and can also send downlink messages to the LoRa™ Server through the application server.

#### Interaction with Server

The data exchange format from Server to Application Server is defined in this section.

##### Server to Application Server

```json
{
    DevAddr: <Buffer 00 08 fb 31>,
    FRMPayload: <Buffer c9 77 36 15>,
}
```
