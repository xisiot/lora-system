# Implementations

## Connector

The LoRa network connector serves as the entrance of the whole X-LoRa system.

### Functions

* **Gateway Connections**

   LoRa gateways directly connect to LoRa network connector and upload and download data for LoRa devices. The format of packages follows the Gateway to Server Interface Definition by SEMTECH Corporation, which can be referred in **Section 1.2**. The communications are carried on UDP. Connector will record two UDP ports for gateways separately, i.e., *pull port* and *push port*, after receiving corresponding type of data. Further downlink data is sent to the matching port. 

* **Package Encapsulation and De-capsulation**

   One of the main jobs of LoRa network connector is to parse and encapsulate packages received from LoRa Gateways. Data from LoRa devices are kept in *data* field as an array in gateway packages. These data are byte sequences originally and encoded in *base64* format before uploading. The illustration below shows how the data of devices are packaged.

   [data field picture]

   After receiving packages from gateways, connector needs to extract device data from data field and decode each element with base64. Then, each data is parsed by bytes according to the message type that is come up with the MHDR field. All message types defined in LoRaWAN 1.1 are well supported. After each field is sliced, some necessary verifications are conducted, as well as decryption, which can be referred at following paragraphs. When everything’s fine, the message is published to the message queue on topic NC-pub for those subscribers interested. The message format is defined in **Section 1.3**. 

   The LoRa network connector has also subscribed a topic named *NC-sub* where it can receive downlink messages for LoRa devices and encapsulate them to byte sequences. During this process, the messages are encrypted and the *MIC* is calculated. Then, the messages are encoded by *base64* and inserted into the *data* field of the JSON document for gateways. This kind of messages is called *PULL_RESP*, and forwarded to the *pull port* of gateways over UDP.

* **Verification**

   LoRa network connector is responsible for necessary message verifications and prevent illegal messages from entering the systems. All checks are listed below for clarity.

   |      Item       |            Further Description            |      Action       |
   | :-------------: | :---------------------------------------: | :---------------: |
   |  MIC Mismatch   |              Data corruption              |      Discard      |
   | Identify Error  |     Device or gateway does not exist      |      Discard      |
   | Illegal Format  | Message is not assembled in standard way  |      Discard      |
   | Out of Boundary |      Data exceed the maximum length       |      Discard      |
   |   FCnt Error    | The count of message frames is discordant | Discard or Ignore |

* **Security**

   LoRa network connector needs to encrypt and decrypt data to ensure privacy. The detailed processes of encryption and decryption can be found in LoRaWAN 1.0.2 standard. Connector is strictly stick to the standard to guarantee it accordance. Devices must make sure the root key *AppKey* is carefully saved in their hardware.

   On the other hand, the transmission between gateways and connector is transparent, which could bring security vulnerabilities. This can be fixed by conducting secured version of UDP (such as DTLS where TLS is used in UDP) both in connector side and gateway sides.

* **Load Balancing, availablity and throttling**

   LoRa network connector has also considered the performance since it is the entrance of the backend servers. Load balancing can be applied by deploying multiple connectors and proper schedule algorithms. The availability, in this way, is also kept. Throttling is required in connector to keep the vicious data flood out of the house.

### Interaction with LoRa Gateways

The LoRa network connector interacts with LoRa gateways with **six** types of messages in total. The detailed format can be learned from the open documents of Semtech Corporation. Here, we only give some brief instructions. 

The following three messages are sent from **gateway** to **connector**.

* **PULL_DATA**

   This message should be sent periodically by gateways to inform connector that the current gateway is alive. Besides, the UDP port gateway used to send PULL_DATA is recorded as *pull port*.

* **PUSH_DATA**

   This message contains a JSON object where three main kinds of data, i.e., the status of gateway itself, the status of LoRa device and the uplink data. The key names are *stat*, *rxpk* and *data* (inside *rxpk* field), respectively. The *rxpk* field is defined as an array so that it can contain multiple messages from different devices. This JSON object is serialized with ASCII-only characters and must not exceed 2048 octets. An example JSON object is listed below, which contains a *stat* field and one *rxpk* field. 

```json
   { rxpk:
      [ { tmst: 1545034506,
          chan: 7,
          rfch: 0,
          freq: 435.9,
          stat: 1,
          modu: 'LORA',
          datr: 'SF12BW125',
          codr: '4/5',
          lsnr: 2,
          rssi: -119,
          size: 24,
          data: 'gJbhkgAgTQCw9hsOerYkPu9D' } ],
     stat:
      { time: '2018-12-17 16:15:06 GMT',
        rxnb: 1,
        rxok: 0,
        rxfw: 0,
        ackr: 100,
        dwnb: 0,
        txnb: 0 } 
   }
```

   The UDP port used by PUSH_DATA will be marked as *push port* in connector. 

* **TX_ACK**

   This message is used to acknowledge the connector that the PULL_RESP (will be described below) message is received and some (maybe no) errors occurred.

   

The following three kinds of messages are sent from **connector** to **gateways**.

* **PULL_ACK**

   This is to acknowledge the gateways that the PULL_DATA is successfully received.

* **PUSH_ACK**

   This is to acknowledge the gateways that the PUSH_DATA is successfully received.

* **PULL_RESP**

   This kind of message is used for connector to send downlink message to gateways. It has a similar structure as *rxpk* except that the key name of JSON object is changed to *txpk* and the total length cannot exceed 1000 octets. An example PULL_RESP message is shown as follow,

```json
   {‘txpk’: {'codr': '4/5',
    'data': 'oJbhkgCjfwcGBgaWMvobrA==',
    'datr': 'SF12BW125',
    'freq': 435.9,
    'imme': False,
    'ipol': False,
    'modu': 'LORA',
    'powe': 25,
    'rfch': 0,
    'size': 16,
    'tmst': 1546035144}
   }
```

   The PULL_RESP is sent to the gateway through *pull_port*. Therefore, gateways MUST send PULL_DATA before any PULL_RESP can be received.

### Interaction with LoRa Server

The connector publishes its uplink data to *message queue* and receive downlink data from it. In our X-LoRa system, the LoRa network server is responsible for direct interaction with connector. Therefore, network server will subscribe topic *NC-pub* and publish data on topic *NC-sub*. The data exchange format between connector and network server is defined in this section. 

* **Connect to Network Server**

   Connector needs to upload all necessary and plain data to network server for further processing. In order to ensure consistency, the data format is designed the same as the LoRaWAN MAC payloads with each field parsed and pre-processed. On the other hand, the meta data (*stat* and *rxpk*) will also be sent without any changes. The example JSON format of an uplink message from connector is shown below,

```json
   { version: <Buffer 02>,
     token: <Buffer 93 b9>,
     identifier: <Buffer 00>,
     gatewayId: <Buffer 00 00 00 00 00 00 00 00>,
     stat:
       { time: '2018-12-17 16:43:16 GMT',
         rxnb: 1,
         rxok: 0,
         rxfw: 0,
         ackr: 100,
         dwnb: 0,
         txnb: 0 },
     rxpk:
       [ { tmst: 1545036196,
           chan: 7,
           rfch: 0,
           freq: 435.9,
           stat: 1,
           modu: 'LORA',
           datr: 'SF12BW125',
           codr: '4/5',
           lsnr: 2,
           rssi: -119,
           size: 24,
           data:
            { MHDR: { MType: 4, Major: 0 },
              MACPayload:
               { FHDR:
                  { DevAddr: <Buffer 00 92 e1 96>,
                    FCtrl: { ADR: 0, ADRACKReq: 0, ACK: 1, ClassB: 0, FOptsLen: 0 },
                    FCnt: <Buffer 00 00 00 53>,
                    FOpts: [ ] },
                 FPort: <Buffer d2>,
                 FRMPayload: <Buffer 68 65 6c 6c 6f> },
              },
           raw: 'gJbhkgAgUwDSxFa50NDuZxdj' },
       ]
   }
```

* **Network Server to Connector**

   The downlink data from network server to connector follows the same pattern so that here only gives an example for reference, 

```json
   { version: <Buffer 02>,
     token: <Buffer 3e 7d>,
     identifier: <Buffer 03>,
     gatewayId: <Buffer 00 00 00 00 00 00 00 00>,
     txpk:
      { imme: false,
        tmst: 1546036645,
        freq: 435.9,
        rfch: 0,
        powe: 25,
        datr: 'SF12BW125',
        modu: 'LORA',
        codr: '4/5',
        ipol: false,
        data:
         { MHDR: { MType: 5, Major: 0 },
           MACPayload:
            { FHDR:
               { DevAddr: <Buffer 00 92 e1 96>,
                 FCtrl: { ACK: 1, ADR: true, FPending: 0, FOptsLen: 3 },
                 FCnt: <Buffer 00 00 07 85>,
                 FOpts: [ { '06': {} }, { '06': {} }, { '06': {} },] },
              FPort: <Buffer e6> } } } }
```

---

## Server

The LoRa network server is the core of the whole X-LoRa system.

### Functions

* **Data Managemrnt and Service Scheduling**

Server is responsible for data management and service scheduling. It invokes different modules according to the requirements of data processing. Depending on the type of uplink packet, the information in the packet is separated into specific formats. 

The data about MAC layer control commands is sent to Controller, the original application data is fed into Application Server and the join packets are forwarded to the Join Server without any interpretation. 

Moreover, Server is required to schedule packet transmissions on the downlink. One of LoRa gateways is selected to send downlink packets through exploiting the uplink transmission parameters such as RSSI and SNR. 

In addition, Server identifies the contents of downlink packets from two queues, which are responsible for application data and MAC commands.

* **Deduplication**

Sometimes, LoRa devices may connect with more than one LoRa gateway. Therefore, single packet from a LoRa node is likely to be received by multiple LoRa gateways simultaneously. To avoid the waste of radio resources due to redundancy, Server is essential for filtering duplicate packets. Only one of the duplicate packets is fed into the subsequent processing modules such as Application Server and Controller. However, the transmission information such as SNR attached in the duplicate packets is not discarded and can be used as reference parameters for downlink routing. Finally, historical data is collected and stored in Server. It can provide the possibility for managers to check up the uplink/downlink packets and monitor the running states of LoRa devices and gateways.

### HTTP APIs

The HTTP APIs are used to register and issue downlink MAC Commands. It is convenient for users to manage the system. Furthermore, users can integrate X-LoRa into their own platforms using these HTTP APIs. All HTTP API methods are listed below.

#### User Register

Only users who have been registered can use the X-LoRa System. This API is used for user register and returns the userID used for gateway, application and device register.

```javascript
POST /register
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "email": "test@xisiot.com",
    "password": "123456"
  }
```

* Response
```json
Body:
  {
    "userID": "4c0c99ca5caef7c9f4707d641c726f55"
  }
```
#### User Login

This API is used for user login and returns the userID.

``` javascript
POST /login
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "email": "test@xisiot.com",
    "password": "123456"
  }
```

* Response
```json
Body:
  {
    "userID": "4c0c99ca5caef7c9f4707d641c726f55"
  }
```
#### Application Register 

This API is used for application register.

``` javascript
POST /application
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "userID": "4c0c99ca5caef7c9f4707d641c726f55 ",
    "AppEUI": "9816be466f467a17",
    "name": "test"
  }
```

* Response
```json
Body:
  {
    "code": "200",
    "message": "success"
  }
```
#### Device Register

This API is used for device register.

``` javascript
POST /device
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "AppEUI": "9816be466f467a17",
    "DevEUI": "AAAAAAAAAAAAAAAA",
    "AppKey": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  }
```

* Response
```json
Body:
  {
    "code": "200",
    "message": "success"
  }
```
#### Gateway Register

This API is used for gateway register.

``` javascript
POST /gateway
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "userID": "4c0c99ca5caef7c9f4707d641c726f55 ",
    "gatewayId": "bbbbbbbbbbbbbbbb"
  }
```

* Response
```json
Body:
  {
    "code": "200",
    "message": "success"
  }
```
#### Issue MAC Commands

This API is used to send the downlink MACCommand.

``` javascript
POST /maccommand
```

* Request
```json
Headers:
  Content-Type: application/x-www-form-urlencoded

Body:
  {
    "DevAddr": "12345678 ",
    "MACCommand": "030200ff01"
  }
```

* Response
```json
Body:
  {
    "code": "200",
    "message": "success"
  }
```
* MAC Commands

  All the MAC Commands defined in LoRaWAN 1.1 are listed below. Bold font means the downlink MAC Commands.

  | Cid  |     MAC Command     |             Payload             | Length(byte) |
  | :--: | :-----------------: | :-----------------------------: | :----------: |
  | 0x01 |      ResetInd       |             Version             |      1       |
  | 0x01 |      ResetConf      |             Version             |      1       |
  | 0x02 |    LinkCheckReq     |                                 |      0       |
  | 0x02 |    LinkCheckAns     |        Margin<br> GwCnt         |    1<br>1    |
  | 0x03 |     LinkADRReq      | TXPower<br>ChMask<br>Redundancy | 1<br>2<br>1  |
  | 0x03 |     LinkADRAns      |             Status              |      1       |
  | 0x04 |    DutyCycleReq     |           DutyCyclePL           |      1       |
  | 0x04 |    DutyCycleAns     |                                 |      0       |
  | 0x05 |   RXParamSetupReq   |     DLSettings<br>Frequency     |    1<br>3    |
  | 0x05 |   RXParamSetupAns   |             Status              |      1       |
  | 0x06 |    DevStatusReq     |                                 |      0       |
  | 0x06 |    DevStatusAns     |        Battery<br>Margin        |    1<br>1    |
  | 0x07 |    NewChannelReq    |   ChIndex<br>Freq<br>DrRange    | 1<br>3<br>1  |
  | 0x07 |    NewChannelAns    |             Status              |      1       |
  | 0x08 |  RXTimingSetupReq   |            Settings             |      1       |
  | 0x08 |  RXTimingSetupAns   |                                 |      0       |
  | 0x09 |   TxParamSetupReq   |            DwellTime            |      1       |
  | 0x09 |   TxParamSetupAns   |                                 |      0       |
  | 0x0A |    DlChannelReq     |         ChIndex<br>Freq         |    1<br>3    |
  | 0x0A |    DlChannelAns     |             Status              |      1       |
  | 0x0B |      RekeyInd       |             Version             |      1       |
  | 0x0B |      RekeyConf      |             Version             |      1       |
  | 0x0C |  ADRParamSetupReq   |            ADRParam             |      1       |
  | 0x0C |  ADRParamSetupAns   |                                 |      0       |
  | 0x0D |    DeviceTimeReq    |                                 |      0       |
  | 0x0D |    DeviceTimeAns    |    Seconds<br>FractionalSec     |    4<br>1    |
  | 0x0E |   ForceRejoinReq    |         ForceRejoinReq          |      2       |
  | 0x0F | RejoinParamSetupReq |       RejoinParamSetupReq       |      1       |
  | 0x0F | RejoinParamSetupAns |             Status              |      1       |

#### Error List

| Code |           Message           |
| :--: | :-------------------------: |
| 2101 |        invalid email        |
| 2102 |      invalid password       |
| 2103 |       invalid AppEUI        |
| 2104 |       invalid DevEUI        |
| 2105 |       invalid AppKey        |
| 2106 |      invalid gatewayId      |
| 2107 |       invalid DevAddr       |
| 2108 |     invalid MACCommand      |
| 3101 |   user already registered   |
| 3102 |     user not registered     |
| 3103 |     user password error     |
| 3201 | application already created |
| 3202 |   application not created   |
| 3301 |   device already created    |
| 3401 |   gateway already created   |

---

## Join Server

The LoRa join server handles the registrations of LoRa devices according to LoRaWAN standard.

### OTAA vs ABP

LoRaWAN standard defines two ways of activation for LoRa devices, i.e., Over-The-Air Activation (OTAA) and Activation by Personalization (ABP). All LoRa devices must be activated in either way before access the network. 

In OTAA mode, LoRa devices only need to store AppEUI, DevEUI (or JoinEUI in LoRaWAN standard 1.1) and AppKey in their hardware. Then, these devices can issue activations by sending join request messages to servers. Some necessary parameters will be generated by server and respond via join accept messages. Some other data (e.g. session keys) are generated by both devices and server. These data are coincident since they use the same arguments and algorithms.

In ABP mode, all the necessary information is loaded in devices in the very beginning. These devices can interact with connector directly. Some previous operations need to be taken before enabling OTAA or adopting ABP to devices, please refer to Section 3.3.2 for more information.

### Functions

* **Activation**

   LoRa join server is only responsible for handling devices with OTAA mode. The ABP based devices can access the network directly. The join requests are parsed by connector first. Then, network server will forward the requests to join server via message queue under topic Join-sub. After receiving the requests, join server will generate some necessary data such as the unique identifier DevAddr for devices. The DevAddr contains the NetID for purpose of roaming. Two session keys, i.e., NwkSKey and AppSKey, are also calculated according to the protocol. Another part of the join procedure is to initialize some physical parameters of devices. The RX1DRoffset defines the offset between uplink data rate and downlink data rate at first reception slot. The Rx2 Data rate sets the data rate for second reception slot. Furthermore, the RxDelay configures the delay between TX and first reception slot. The scope of RxDelay varies from 0s to 15s. The details can be found in RXTimingSetupReq command. All these values are region specific and set to their default values during activation.

   Join server also needs to generate join accept messages for responses. These messages are published on topic *Join-pub* and network server needs to get them generally.

* **Rejoin**

   **UNIMPLEMENTED**

### Interaction with LoRa Network Server

The LoRa join server subscribes the topic Join-sub to receive join requests from LoRa network server, and publishes join accept on topic Join-pub to LoRa network server. 

* **Network Server to Join Server**

```json
   { MHDR: { MType: 0, Major: 0 },
     MACPayload: {
       AppEUI: <Buffer 7b 80 60 6c af eb 0f 26>,
       DevEUI: <Buffer 37 b8 90 3b 37 b8 90 3b>,
       DevNonce: <Buffer 81 bf>,
     },
   },
```

* **Join Server to Network Server**

```json
   { MHDR: { MType: 1, Major: 0 },
     MACPayload:
     { AppNonce: <Buffer 32 dc 97>,
       NetID: <Buffer 00 00 00>,
       DevAddr: <Buffer 00 92 e1 96>,
       DLSettings: <Buffer c0>,
       RxDelay: <Buffer 01> },
   },
```

---

## Controller

The LoRa network controller focuses on processing and managing MAC commands, which are used to modify associated conﬁgurations or adjust transmission parameters in physical layer. 

### Functions

The LoRa network controller implements the analysis of the uplink MAC Commands, performs corresponding algorithms, and generates the downlink MAC Commands which may be sent within the downlink packet or individually.  

#### MAC Command Queue

For each end-device, the LoRa network controller maintains a MAC Command queue with each element in the queue as shown in the following table.

|  Field  |              Description               |
| :-----: | :------------------------------------: |
|   CID   |             MAC Command ID             |
| Payload | Byte sequence that Command may contain |

#### MAC Command Alogorithm

The step one starts as soon as the uplink packet arrives, and step one to step nine is continuous cycling.

* 1.Once the uplink data arrives, if the packet contains the MAC Command, the LoRa Network Server extracts the part and sends it to the Network Controller by an array;
* 2.The LoRa Network Controller will read all the commands in the MAC Command Request Queue, and put them into the array Q, then traverse the array Q, then delete all data in the MAC Command Answer Queue;
* 3.The MAC Command in the data packet which the Network Controller receives contains answers and requests, and the Network Controller will traverse all the data packet;
* 4.When Encountering MAC Command answer, the Network Controller will compare it with the array Q, and record the position of the first unmatched answer-request pair as d;
* 5.When Encountering MAC Command request, the Network Controller will process it;
* 6.Clear the original MAC Command Request Queue, and push all elements of array Q from position d into the new MAC Command Request Queue;
* 7.Traverse MAC Command Request Queue and application data Queue;
* 8.Construct downlink data according to the TABLE 1 policy and send it to the Network Connector by Network Server;
* 9.The Network Connector encapsulates the LoRa packet and delivers it to the gateway.

<center>Downlink MAC Command and Application Data Group Package Policy</center>

| Downlink Application Data |   Downlink MAC Commands    | Send Downlink Packet | FOpts |    FRMPayload    |           Other            |
| :-----------------------: | :------------------------: | :------------------: | :---: | :--------------: | :------------------------: |
|       Not Available       |       Not Available        |          No          |   -   |        -         |             -              |
|       Is Available        |       Not Available        |         Yes          | Null  | Application Data |             -              |
|       Not Available       | Is Available (> 15 bytes)  |         Yes          | Null  |       MAC        |         FPort = 0          |
|       Not Available       | Is Available (<= 15 bytes) |         Yes          |  MAC  |       Null       |             -              |
|       Is Available        | Is Available (> 15 bytes)  |         Yes          | Null  |       MAC        | FPort = 0</br>FPending = 1 |
|       Is Available        | Is Available (<= 15 bytes) |         Yes          | Null  | Application Data |             -              |

### Interaction with LoRa Nework Server

The LoRa join server subscribes the topic CS-sub to receive join requests from LoRa network server, and publishes join accept on topic CS-pub to LoRa network server.

* **Network Server to Network Controller**

```json
   {
       DevAddr: <Buffer 00 96 44 72>,
       data: [
       {
        	0x01: { Version: <Buffer 02>, },
       },
   	{
       	0x02: null,
       },
       {
       	0x03: { "Status": <Buffer 02>, },
       },
   	],
       adr: true,
       devtx:
         {
           "freq": 433.3,
           "datr": "SF7BW125",
           "codr": "4/6",
         },
       gwrx: [
         {
           gatewayId: <Buffer b8 27 eb ff fe 52 0e 51>,
           time: "2013-03-31T16:21:17.528002Z",
           tmst: 3512348611,
           chan: 2,
           rfch: 0,
           stat: 1,
           modu: "LORA",
           rssi: -35,
           lsnr: 5.1,
           size: 32,
         },
       ],
     }
```

* **Network Controller to Network Server**

```json
    {
       "cid": "payload",
     }
   
```
*Example:* 

```json
    {
       0x01: { "Version": <Buffer 02>, },
    }
```

---

## Motes Emulator

This is a useful tool to emulate end devices (a.k.a. Motes) and test LoRa server based on *LoRaWAN™* *1.0.2 protocol*. 

### Requirements

* Python 3.6
* Linux

### Installation

* Use pip to install pipenv:

```sh
  (sudo) pip3 install pipenv
```

* Clone this repo into a directory:

```sh
  git clone https://github.com/houluy/lora-motes-emulator.git
```

* Use pipenv to create a virtual Python enviroment and install all the dependencies:

```sh
  pipenv --python 3 install
```

### See the Helps

```sh
pipenv run python main.py -h
```

or by:

```sh
pipenv shell
python main.py -h
```

### Usage

This tool can be used step by step as follows,

1. Copy a local *config* file and *device info* file from the templates, then modify the *src* and *dest* address as the address of test server and LoRa server.

2. Modify device information in `device.json` you just copied. The information fields include *AppEUI*, *DevEUI*, *AppKey* and *GatewayEUI* (a.k.a. *GatewayID*).

3. Install the tool, and start the virtual shell by command `pipenv shell`.
4. Totally four kinds of LoRa messages are supported: *pull data*, *join confirmed data up* (with or without *FOpts*) and *MAC Commands* *in FRMPayload field*. The examples are shown below:

```
python main.py pull

python main.py join

python main.py app -m (your uplink message, will be encoded by UTF-8) -f (your MACCommand in FOpts field)

python main.py mac -c (your MAC Command in FRMPayload field)
```

If this is your first-time running, run *pull* and *join* commands in the very beginning to register the port of gateway and the LoRa device. The device info will be saved automatically in *models/device.pkl* using *pickle*, and loaded next time. Then, you can use *app* or *mac* to test your server. Here are the examples.

```
python main.py app -m helloworld -f 0302
python main.py mac -c 0302
```

### Contributions

This repo is hosted on <https://github.com/houluy/lora-motes-emulator> and under *MIT license*, any contribution or suggestion is welcome. Just open an issue or send a pull request.