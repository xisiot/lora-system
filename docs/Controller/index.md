# MAC Command Organizer
The Network Server and the Network Controller implement the organization of the MAC Command.
## 1. MAC Command Queue
For each end-device, the Network Controller maintains a MAC Command queue with each element in the queue as shown in the following TABLE 1.
<center>TABLE 1 Field Description of MAC Command Queue</center>

| Field    |                Description               |
|:--------:|:----------------------------------------:|
| CID      |             	MAC Command ID              |
| Payload  |  Byte sequence that Command may contain  |

## 2. Downlink MAC Command Algorithm

### 2.1 MAC Command Req Downlink Algorithm
The algorithm takes the time when uplink packet arrives as the start of the loop.

1. Once the uplink data arrives, if the packet contains the MAC Command, the Network Server extracts the part and sends it to the Network Controller by an array;

2. The Network Controller will read all the commands in the MAC Command Queue, and put them into the array Q, then traverse the array Q, then delete all Ans;

3. The MAC Command in the data packet which the Network Controller receives contains Ans and Req, and the Network Controller will traverse all the data packet;

4. When Encountering MAC Command Ans, the Network Controller will compare it with the MAC Command Req of the array Q, and record the position of the first unmatched Ans-Req pair as d;

5. When Encountering MAC Command Req, the Network Controller will processe it;

6. Clear the original MAC Command queue, and push all elements of array Q from position d into the new MAC Command queue;

7. Traverse MAC Command Req Queue and application data Queue;

8. Construct downlink data according to the TABLE 2 policy and send it to the Network Connector by Network Server;

9. The Network Connector encapsulates the LoRa packet and delivers it to the gateway.

<center>TABLE 2 Downlink MAC Command and Application Data Group Package Policy</center>

|Downlink Application Data|Downlink MAC Commands|Send Downlink Packet|FOpts|FRMPayload|Other|
|:-----------------------:|:-------------------:|:------------------:|:---:|:--------:|:---:|
| not have |     not have     | no |   -  |         -       |         -                |
|   have   |     not have     | yes| null | Application Data|         -                |
| not have | have(> 15 bytes) | yes| null |        MAC      |         FPort = 0        |
| not have | have(<= 15 bytes)| yes| MAC  |       null      |         -                |
|  have    | have(> 15 bytes) | yes| null |        MAC      |FPort = 0</br>FPending = 1|
|  have    | have(<= 15 bytes)| yes| null | Application Data|         -                |

![MAC Command Queue Schematic Diagram](https://github.com/xisiot/resources/blob/master/lora-system/images/MACCommandQueue.png)

### 2.2 Boundary or Special Circumstances
* RXParamSetupAns, RXTimingSetupAns, DlChannelAns three types MAC Command（TBD）

* Version Issue

  The server is based on LoRaWAN 1.1 protocol. Before issuing the MAC Command downlink,checking the LoRaWAN version supported by the device is principal. If the LoRaWAN version of device is out of support version,the MAC Command is directly removed from the queue.

* The total number of bytes of the MAC Command Queue exceeds 15 bytes, does not exceed the maximum allowed by FRMPayload, and there is data in the application data queue

  * Command Req is all placed in FRMPayload
  * FPort = 0
  * FPending = 1 

* The total number of bytes in the MAC Command Queue exceeds the maximum allowed by FRMPayload
  * Keep the last Command Req not sent
  * FPending = 1

## 3. Uplink MAC Command Algorithm

## 4. Network Server and Network Controller Interactive Data Format
### 4.1 Uplink(Network Server to Network Controller)
The Network Server sends the uplink MAC Command and the transmission parameters which can be useful in the Network Controller. The data format is as follows.
```json
{
  "DevAddr": "",
  "data": "",
  "adr": "",
  "devtx":
    {
      "freq": "",
      "datr": "",
      "codr": "",
    },
  "gwrx": [
    {
      "gatewayId": "",
      "time": "",
      "tmst": "",
      "chan": "",
      "rfch": "",
      "stat": "",
      "modu": "",
      "rssi": "",
      "lsnr": "",
      "size": "",
    },
  ],
}
```   
 
 The field description of uplink data is shown in the following TABLE 3.

 <center>TABLE 3 Field Description of Uplink Data Format</center>

|  Field  | Type  | Example                  | Required |
|:-------:|:-----:|:------------------------:|:--------:|
| DevAddr | Buffer|&lt;Buffer 00 96 44 72&gt;|   Yes    |
|  data   | Array | Explained below          |   Yes    |
|  ADR    | Bool  |  true/false              |   Yes    |
| devtx   | Object|Table 4 for instructions  |   Yes    |
| gwrx    | Array |Table 5 for instructions  |  Yes     |

<center>Description of data Field</center>

```json
[
  {
    "0x01": { "Version": <Buffer 02>, },
  },
  {
    "0x02": null,
  },
  {
    "0x03": { "Status": <Buffer 02>, },
  },
]

```

<center>TABLE 4 Description of devtx Field </center>

| Field |  Type | Example  | Required |
|:-----:|:-----:|:--------:|:--------:|
| freq  | Number|  433.3   |    Yes   |
| datr  | String|"SF7BW125"|    Yes   |
| codr  | String|  "4/6"   |    Yes   |

<center>TABLE 5 Description of gwrx Field </center>

|   Field   |  Type  | Example  |Required   |
|:---------:|:------:|:--------:|:---------:|
| gatewayId | Buffer |&lt;Buffer b8 27 ed ff fe 52 0e 51&gt; | Yes |
| time      | String |      "2013-03-31T16:21:17.528002Z"    | Yes |
| tmst      | Number |      3512348611                       | Yes |
| chan      | Number |       2                               | Yes |
| rfch      | Number |      0                                | Yes |
| stat      | Number |      1                                | Yes |
| modu      | String |      "LORA"                           | Yes |
| rssi      | Number |      -35                              | Yes |
| lsnr      | Number |      5.1                              | Yes |
| size      | Number |      32                               | Yes |

### 4.2 Downlink(Network Controller to Network Server)
The downlink MAC Command that the Network Controller will send is stored in the Redis queue as Json format.

```json
 {
    "cid": "payload",
  }

```
_Example_

```json
{
    "0x01": { "Version": <Buffer 02>, },
  }

```

The MAC Command field definition is shown in the following TABLE 6.

<center>TABLE 6 Description of MAC Command Field</center>

| cid| MAC Command | payload |
|:--:|:-----------:|:--------:|
|0x01|ResetInd     |Version|
|0x01|ResetConf    |Version|
|0x02|LinkCheckReq ||
|0x02|LinkCheckAns |Margin<br> GwCnt|
|0x03|LinkADRReq   |TXPower<br>ChMask<br>Redundancy|
|0x03|LinkADRAns   |Status|
|0x04|DutyCycleReq |DutyCyclePL|
|0x04|DutyCycleAns ||
|0x05|RXParamSetupReq|DLSettings<br>Frequency|
|0x05|RXParamSetupAns|Status|
|0x06|DevStatusReq ||
|0x06|DevStatusAns |Battery<br>Margin|
|0x07|NewChannelReq|ChIndex<br>Freq<br>DrRange|
|0x07|NewChannelAns|Status|
|0x08|RXTimingSetupReq|Settings|
|0x08|RXTimingSetupAns||
|0x09|TxParamSetupReq|DwellTime|
|0x09|TxParamSetupAns||
|0x0A|DlChannelReq |ChIndex<br>Freq|
|0x0A|DlChannelAns |Status|
|0x0B|RekeyInd     |Version|
|0x0B|RekeyConf    |Version|
|0x0C|ADRParamSetupReq|ADRParam|
|0x0C|ADRParamSetupAns||
|0x0D|DeviceTimeReq||
|0x0D|DeviceTimeAns|Seconds<br>FractionalSec|
|0x0E|ForceRejoinReq|ForceRejoinReq|
|0x0F|RejoinParamSetupReq|RejoinParamSetupReq|
|0x0F|RejoinParamSetupAns|Status|

## 5. Introduction
The Network Server and the Network Controller implement the organization of the MAC Command. The Network Controller implements the analysis of the uplink MAC Command and performs corresponding algorithm processing, and simultaneously delivers the downlink MAC Command command. The Network Controller includes processFlow Module, MAC Command Issuer and MAC Command Handler:

* processFlow Module

  The processFlow module is the core part of controller, which handles the MAC command part of each uplink data forwarded by the network server.The processing flow has been described in detail in the MAC Command Req Uplink Algorithm.

* MAC Command Issuer

  The MAC Command Issuer is used to initiate the MAC command, which is the form of the MAC command that the end-device can receive.

* MAC Command Handler

  The MAC command Handler is the processing of the MAC command in the uplink data.
  