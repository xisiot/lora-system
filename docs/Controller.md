## Controller

The LoRa™ network controller focuses on processing and managing MAC commands, which are used to modify associated conﬁgurations or adjust transmission parameters in physical layer. 

### Functions

The LoRa™ network controller implements the analysis of the uplink MAC Commands, performs corresponding algorithms, and generates the downlink MAC Commands which may be sent within the downlink packet or individually.  

#### MAC Command Queue

For each end-device, the LoRa™ network controller maintains a MAC Command queue with each element in the queue as shown in the following table.

|  Field  |              Description               |
| :-----: | :------------------------------------: |
|   CID   |             MAC Command ID             |
| Payload | Byte sequence that Command may contain |

#### MAC Command Alogorithm

The step one starts as soon as the uplink packet arrives, and step one to step nine is continuous cycling.

1. Once the uplink data arrives, if the packet contains the MAC Command, the LoRa™ Network Server extracts the part and sends it to the Network Controller by an array;
2. The LoRa™ Network Controller will read all the commands in the MAC Command Request Queue, and put them into the array Q, then traverse the array Q, then delete all data in the MAC Command Answer Queue;
3. The MAC Command in the data packet which the Network Controller receives contains answers and requests, and the Network Controller will traverse all the data packet;
4. When Encountering MAC Command answer, the Network Controller will compare it with the array Q, and record the position of the first unmatched answer-request pair as d;
5. When Encountering MAC Command request, the Network Controller will process it;
6. Clear the original MAC Command Request Queue, and push all elements of array Q from position d into the new MAC Command Request Queue;
7. Traverse MAC Command Request Queue and application data Queue;
8. Construct downlink data according to the following table policy and send it to the Network Connector by Network Server;
9. The Network Connector encapsulates the LoRa™ packet and delivers it to the gateway.

<center>Downlink MAC Command and Application Data Group Package Policy</center>

| Downlink Application Data |   Downlink MAC Commands    | Send Downlink Packet | FOpts |    FRMPayload    |           Other            |
| :-----------------------: | :------------------------: | :------------------: | :---: | :--------------: | :------------------------: |
|       Not Available       |       Not Available        |          No          |   -   |        -         |             -              |
|       Is Available        |       Not Available        |         Yes          | Null  | Application Data |             -              |
|       Not Available       | Is Available (> 15 bytes)  |         Yes          | Null  |       MAC        |         FPort = 0          |
|       Not Available       | Is Available (<= 15 bytes) |         Yes          |  MAC  |       Null       |             -              |
|       Is Available        | Is Available (> 15 bytes)  |         Yes          | Null  |       MAC        | FPort = 0</br>FPending = 1 |
|       Is Available        | Is Available (<= 15 bytes) |         Yes          | Null  | Application Data |             -              |

### Interaction with LoRa™ Nework Server

The LoRa™ join server subscribes the topic CS-sub to receive join requests from LoRa™ network server, and publishes join accept on topic CS-pub to LoRa™ network server.

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