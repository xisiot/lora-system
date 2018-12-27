## Installation of LoRa Web Server

This section describes the installation of LoRa Web Server.

#### System Requiremwnts

All the requirements below should be met before installing the LoRa web server.

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

* Run the artisan command to start the LoRa web server system directly :

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

Run the following command to start the LoRa web server system :

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

Run the following command to start the LoRa web server system :

```sh
  systemctl start lora-web-server.service
```

---