## Server

The LoRa™ network server is the core of the whole X-LoRa system.

### Functions

* **Data Managemrnt and Service Scheduling**

Server is responsible for data management and service scheduling. It invokes different modules according to the requirements of data processing. Depending on the type of uplink packet, the information in the packet is separated into specific formats. 

The data about MAC layer control commands is sent to Controller, the original application data is fed into Application Server and the join packets are forwarded to the Join Server without any interpretation. 

Moreover, Server is required to schedule packet transmissions on the downlink. One of LoRa™ gateways is selected to send downlink packets through exploiting the uplink transmission parameters such as RSSI and SNR. 

In addition, Server identifies the contents of downlink packets from two queues, which are responsible for application data and MAC commands.

* **Deduplication**

Sometimes, LoRa™ devices may connect with more than one LoRa™ gateway. Therefore, single packet from a LoRa™ device is likely to be received by multiple LoRa™ gateways simultaneously. To avoid the waste of radio resources due to redundancy, Server is essential for filtering duplicate packets. Only one of the duplicate packets is fed into the subsequent processing modules such as Application Server and Controller. However, the transmission information such as SNR attached in the duplicate packets is not discarded and can be used as reference parameters for downlink routing. Finally, historical data is collected and stored in Server. It can provide the possibility for managers to check up the uplink/downlink packets and monitor the running states of LoRa™ devices and gateways.

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

  All the MAC Commands defined in LoRaWAN™ 1.1 are listed below. Bold font means the downlink MAC Commands.

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
