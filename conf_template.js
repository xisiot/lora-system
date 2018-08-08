// This is a template config file
// Please COPY this file when deploying a new server
'use strict';

//Network-server identifier
const nsid = 1;
const kafkaHost = 'localhost:9092';

module.exports = {

  //Database settings
  database: {
    mysql: {
      username: 'username',
      password: 'password',
      database: 'mysql',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql',
      operatorsAliases: false,
      logging: false,
      timezone: '+08:00',
      define: {
        'freezeTableName': true,
        'timestamp': true,
        'charset': 'utf8',
      },
    },
    redis: {
      cluster: false,
      options: [{
        host: 'localhost',
        port: 6379,
        retryStrategy: function (times) {
          var delay = Math.min(times * 50, 30000);
          if (delay >= 30000) {
            console.log('---------------Redis Retry close---------------');
            return 'close';
          }
          return delay;
        }
      }],
    },
    mongodb: {
      host: 'localhost',
      port: 27017,
      db: 'loraLogger',
      cluster: false,
    },
  },

  //Test file setting
  mocha: {
    timeout: 5000,
    longTimeOut: 15000,
  },

  //Kafka consumer & producer setting
  mqClient_ns: {
    nsid: `${nsid}`, // if exist in topic schema
    consumerGroup: {
      options: {
        kafkaHost: kafkaHost,
        groupId: `lora-network-server-message-dispatch-in-${nsid}`,
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        fromOffset: 'latest'
      },
      topics: ['NS-sub', 'AS-pub', 'JS-pub']
    },
    client: {
      kafkaHost: kafkaHost,
      clientId: `lora-network-server-message-dispatch-out-${nsid}`
    },
    producer: {
      requireAcks: 1,
      ackTimeoutMs: 100,
      partitionerType: 2
    },

    //Custom shema to verify packet validity. Not used in server.
    schemaPath: {
      messages: 'config/messages.json',
      common: 'config/common.json'
    },

    //Kafka topics for receiving and sending data
    topics: {
      pubToApplicationServer: 'AS-sub',
      subFromApplicationServer: 'AS-pub',
      pubToConnector: 'NC-sub',
      subFromConnector: 'NS-sub',
      pubToJoinServer: 'JS-sub',
      subFromJoinServer: 'JS-pub',
      pubToControllerServer: 'CS-sub',
      subFromControllerServer: 'CS-pub'
    },
  },

  //winston logger setting
  log: {
    level: 'debug',
    colorize: true,
  },

  //LoRa network-server setting
  server: {
    /*
    Set whether to enable FCnt check
    */
    fcntCheckEnable: true,
    /*
    Waiting time for Uplink package de-duplication
    Unit: milliseconds(ms)
    */
    deduplication_Delay: 200,
    /*
    Waiting time for downlink package processing
    Unit: milliseconds(ms)  
    */
    downlink_Data_Delay: 200,//ms
  },

  mqClient_js: {
    consumerGroup: {
      options: {
        kafkaHost: kafkaHost,
        groupId: 'lora-join-server-consumer',
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        fromOffset: 'latest'
      },
      topics: [
        'JS-sub'
      ]
    },
    client: {
      kafkaHost: kafkaHost,
      clientId: 'lora-join-server-producer'
    },
    producer: {
      requireAcks: 1,
      ackTimeoutMs: 100,
      partitionerType: 2,
      joinServerTopic: 'JS-pub'
    }
  },

  mqClient_nc: {
    consumerGroup: {
      options: {
        kafkaHost: kafkaHost,
        groupId: 'lora-network-connector-consumer',
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        fromOffset: 'latest'
      },
      topics: [
        'NC-sub'
      ]
    },
    client: {
      kafkaHost: kafkaHost,
      clientId: 'lora-network-connector-producer'
    },
    producer: {
      requireAcks: 1,
      ackTimeoutMs: 100,
      partitionerType: 2
    },
    topics: {
      pubToServer: 'NS-sub'
    }
  },

  mqClient_as: {
    nsid: `${nsid}`, // if exist in topic schema
    consumerGroup: {
      options: {
        kafkaHost: kafkaHost,
        groupId: `lora-application-server-message-dispatch-in-${nsid}`,
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        fromOffset: 'latest'
      },
      topics: ['AS-sub', `cloud-sub-${nsid}-lora`]
    },
    client: {
      kafkaHost: kafkaHost,
      clientId: `lora-application-server-message-dispatch-out-${nsid}`
    },
    producer: {
      requireAcks: 1,
      ackTimeoutMs: 100,
      partitionerType: 2
    },
    schemaPath: {
      messages: 'config/messages.json',
      common: 'config/common.json'
    },
    topics: {
      pubToCloud: `cloud-pub-${nsid}`,
      subFromCloud: `cloud-sub-${nsid}-lora`,
      pubToServer: 'AS-pub',
      subFromServer: 'AS-sub',
    },
  },

  pb: {
    '260febaf6c60807b': 'pm25_message.pm25',
  }
};
