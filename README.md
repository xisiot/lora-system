# LoRaWAN system

This is a whole LoRa system.

## Architecture 

![](/Users/xjy/Downloads/Architecture.jpg)

## System Requirements

This system requires the following components imperatively.

- Node.js (>= 8)
- MySQL (>= 5.7)
- Redis
- Kafka
- MongoDB

## Getting Started

- Install all the components listed in [System Requirements](https://github.com/xisiot/lora-system/new/master?readme=1#system-requirements).

- Create a new database in MySQL.

- Start Kafka, Redis and MongoDB in the background.

- Clone this repo into a directory:

  ```
  git clone https://github.com/xisiot/lora-system.git --recursive
  cd lora-system
  ```

- Install all Node.js dependencies by `npm install`.

- Copy a local ``config.json`` from ``config_template.json``:

  ```
  cp config_template.json config.json
  ```

- Modify the configurations of kafkaHost, MySQL and other customized fields in ``config.js``.

- Use ``start.sh`` to start LoRa system:

  ```sh
  ./start.sh
  ```


## License

LoRa system is distributed under the MIT license. See also [License](https://github.com/xisiot/lora-system/blob/master/LICENSE)
